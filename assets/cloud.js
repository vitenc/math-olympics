/* ==========================================================================
   Облако: аккаунты взрослых, профили учеников и синхронизация прогресса

   Без настройки (assets/cloud-config.js пустой) модуль ничего не делает:
   prefix() — пустая строка, и тренажёр хранит всё, как раньше, в
   localStorage этого браузера.

   С настройкой:
     • взрослый (родитель или учитель) входит по шестизначному коду из
       письма — без пароля; у ребёнка аккаунта и почты нет;
     • у взрослого есть профили учеников: псевдоним, класс, отметка о
       согласии. Один профиль выбирается «активным» на этом устройстве;
     • прогресс активного ученика лежит в localStorage под приставкой
       st.<id>. — у каждого ребёнка на планшете свой, как у классов;
     • каждая запись движка (SASMO save) помечает ключ как изменённый, и
       через полторы секунды он уходит в таблицу kv. При открытии страницы
       изменения из облака подтягиваются: так планшет в классе и компьютер
       дома видят один и тот же прогресс.

   Работает без библиотек, через fetch: REST Supabase (PostgREST) и Auth.
   Схема и правила доступа — supabase/schema.sql.
   ========================================================================== */

window.SASMO_CLOUD = (function () {
  'use strict';

  var CFG = window.SASMO_CLOUD_CONFIG || {};
  var URL_ = String(CFG.url || '').replace(/\/+$/, '');
  var KEY = String(CFG.anonKey || '');

  var SESSION_KEY = 'cloud.session';
  var STUDENT_KEY = 'cloud.student';
  var CONSENT_VERSION = 'v1-2026-09';
  var PUSH_DELAY = 1500;

  /* ---------------------------------------------------------- хранилище --- */

  function get(k) {
    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; }
  }
  function put(k, v) {
    try {
      if (v === null || v === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { /* пусто */ }
  }
  function raw(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }

  function enabled() { return !!(URL_ && KEY); }
  function session() { return enabled() ? get(SESSION_KEY) : null; }
  function student() { return enabled() && session() ? get(STUDENT_KEY) : null; }

  /* Приставка ключей активного ученика. Пусто — работаем как без облака. */
  function prefix() {
    var s = student();
    return s && s.id ? 'st.' + s.id + '.' : '';
  }

  function studentName() {
    var s = student();
    return s ? s.nickname : '';
  }

  /* ------------------------------------------------------------ статус --- */

  var status = enabled() ? (session() ? 'idle' : 'signed-out') : 'off';
  var listeners = [];
  function setStatus(s) {
    status = s;
    listeners.forEach(function (fn) { try { fn(s); } catch (e) { /* пусто */ } });
    paintBadge();
  }
  function onStatus(fn) { listeners.push(fn); }

  /* --------------------------------------------------------------- сеть --- */

  function CloudError(message, code, httpStatus) {
    var e = new Error(message);
    e.code = code || '';
    e.status = httpStatus || 0;
    return e;
  }

  function request(method, path, body, headers, token) {
    var h = { apikey: KEY, 'Content-Type': 'application/json' };
    h.Authorization = 'Bearer ' + (token || KEY);
    Object.keys(headers || {}).forEach(function (k) { h[k] = headers[k]; });
    return fetch(URL_ + path, {
      method: method,
      headers: h,
      body: body === undefined ? undefined : JSON.stringify(body),
      keepalive: method !== 'GET' && JSON.stringify(body || '').length < 60000
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
        if (!res.ok) {
          var msg = data && (data.msg || data.message || data.error_description || data.error) || ('HTTP ' + res.status);
          throw CloudError(msg, data && (data.code || data.error_code), res.status);
        }
        return data;
      });
    });
  }

  function saveSession(data) {
    if (!data || !data.access_token) throw CloudError('no session');
    var s = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
      user: { id: data.user && data.user.id, email: data.user && data.user.email }
    };
    put(SESSION_KEY, s);
    return s;
  }

  var refreshing = null;
  function refresh() {
    var s = session();
    if (!s || !s.refresh_token) return Promise.reject(CloudError('signed out', '', 401));
    if (!refreshing) {
      refreshing = request('POST', '/auth/v1/token?grant_type=refresh_token', { refresh_token: s.refresh_token })
        .then(saveSession)
        .catch(function (e) {
          // Код обновления не приняли — сессия кончилась. Прогресс остаётся локально.
          if (e.status === 400 || e.status === 401) { put(SESSION_KEY, null); setStatus('signed-out'); }
          throw e;
        })
        .then(function (s2) { refreshing = null; return s2; }, function (e) { refreshing = null; throw e; });
    }
    return refreshing;
  }

  function token() {
    var s = session();
    if (!s) return Promise.reject(CloudError('signed out', '', 401));
    if (s.expires_at - Date.now() > 60 * 1000) return Promise.resolve(s.access_token);
    return refresh().then(function (s2) { return s2.access_token; });
  }

  /* Запрос от имени вошедшего взрослого; просроченный токен обновляется сам. */
  function api(method, path, body, headers) {
    return token().then(function (tk) {
      return request(method, path, body, headers, tk).catch(function (e) {
        if (e.status !== 401) throw e;
        return refresh().then(function (s2) { return request(method, path, body, headers, s2.access_token); });
      });
    });
  }

  /* ------------------------------------------------------------- вход ---- */

  function sendCode(email) {
    return request('POST', '/auth/v1/otp', { email: String(email).trim(), create_user: true });
  }

  function verify(email, code) {
    return request('POST', '/auth/v1/verify', {
      type: 'email', email: String(email).trim(), token: String(code).replace(/\s+/g, '')
    }).then(function (data) {
      var s = saveSession(data);
      setStatus('idle');
      return s;
    });
  }

  /* Выход: сессия и выбор ученика забываются; прогресс учеников остаётся
     на устройстве под их приставками — вернётся при следующем входе. */
  function signOut() {
    var s = session();
    put(SESSION_KEY, null);
    put(STUDENT_KEY, null);
    setStatus(enabled() ? 'signed-out' : 'off');
    if (s) request('POST', '/auth/v1/logout', {}, {}, s.access_token).catch(function () {});
  }

  /* ----------------------------------------------------- взрослый и дети --- */

  function me() { var s = session(); return s ? s.user : null; }

  function profile() {
    return api('GET', '/rest/v1/profiles?select=*&id=eq.' + me().id).then(function (rows) {
      return rows && rows[0] || null;
    });
  }

  function saveProfile(p) {
    return api('POST', '/rest/v1/profiles?on_conflict=id', [{
      id: me().id,
      role: p.role === 'teacher' ? 'teacher' : 'parent',
      display_name: p.display_name || null,
      consent_version: CONSENT_VERSION,
      consent_at: new Date().toISOString()
    }], { Prefer: 'resolution=merge-duplicates,return=representation' }).then(function (rows) { return rows[0]; });
  }

  function listStudents() {
    return api('GET', '/rest/v1/students?select=id,nickname,grade,consent_by,consent_at&owner_id=eq.' +
               me().id + '&order=created_at');
  }

  function createStudent(st) {
    return api('POST', '/rest/v1/students', {
      nickname: String(st.nickname).trim().slice(0, 40),
      grade: st.grade === 2 ? 2 : 3,
      consent_by: st.consent_by === 'school' ? 'school' : 'parent'
    }, { Prefer: 'return=representation' }).then(function (rows) { return rows[0]; });
  }

  function deleteStudent(id) {
    return api('DELETE', '/rest/v1/students?id=eq.' + id).then(function () {
      var cur = student();
      if (cur && cur.id === id) put(STUDENT_KEY, null);
      // и всё, что лежало на этом устройстве под его приставкой
      wipeLocal('st.' + id + '.');
    });
  }

  function useStudent(st) {
    put(STUDENT_KEY, st ? { id: st.id, nickname: st.nickname, grade: st.grade } : null);
    if (st) { try { localStorage.setItem('sasmo.grade', String(st.grade)); } catch (e) { /* пусто */ } }
  }

  function joinClass(code, studentId) {
    return api('POST', '/rest/v1/rpc/join_class', { code: code, student: studentId });
  }

  function studentClasses(studentId) {
    return api('POST', '/rest/v1/rpc/student_classes', { student: studentId });
  }

  /* --------------------------------------------------------------- учитель --- */

  function listClasses() {
    return api('GET', '/rest/v1/classes?select=id,name,grade,join_code,created_at&teacher_id=eq.' +
               me().id + '&order=created_at');
  }

  function createClass(c) {
    return api('POST', '/rest/v1/classes', { name: String(c.name).trim().slice(0, 60), grade: c.grade || null },
               { Prefer: 'return=representation' }).then(function (rows) { return rows[0]; });
  }

  function classRoster(classId) {
    return api('GET', '/rest/v1/class_members?select=student_id,joined_at,students(id,nickname,grade)' +
               '&class_id=eq.' + classId);
  }

  function addToClass(classId, studentId) {
    return api('POST', '/rest/v1/class_members', { class_id: classId, student_id: studentId });
  }

  function removeFromClass(classId, studentId) {
    return api('DELETE', '/rest/v1/class_members?class_id=eq.' + classId + '&student_id=eq.' + studentId);
  }

  /* Прогресс учеников — учителю для панели класса, родителю для выгрузки. */
  function readKv(studentIds, keys) {
    if (!studentIds.length) return Promise.resolve([]);
    var q = '/rest/v1/kv?select=student_id,key,value,updated_at&student_id=in.(' + studentIds.join(',') + ')';
    if (keys && keys.length) q += '&key=in.(' + keys.map(encodeURIComponent).join(',') + ')';
    return api('GET', q);
  }

  /* ----------------------------------------------------- синхронизация --- */

  function metaKey() { return prefix() + '__sync'; }
  function meta() { return get(metaKey()) || {}; }
  function saveMeta(m) { put(metaKey(), m); }

  var pushTimer = null;

  /* Движок сообщает о каждой записи в localStorage. Облако интересуют
     только ключи активного ученика. */
  function touched(fullKey) {
    var p = prefix();
    if (!p || fullKey.indexOf(p) !== 0 || fullKey === metaKey()) return;
    var k = fullKey.slice(p.length);
    var m = meta();
    m[k] = m[k] || {};
    m[k].t = Date.now();
    m[k].dirty = true;
    saveMeta(m);
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, PUSH_DELAY);
  }

  function isProgress(k) { return /(^|\.)progress$/.test(k); }
  function isErrors(k) { return /(^|\.)errors$/.test(k); }

  function answered(rec) {
    if (!rec) return 0;
    if (rec.exam && Array.isArray(rec.exam.given)) {
      return rec.exam.given.filter(function (g) { return g !== null && g !== undefined && g !== ''; }).length;
    }
    return rec.answers ? Object.keys(rec.answers).length : 0;
  }

  /* Какая из двух записей одного набора «дальше»: сданная сильнее начатой,
     из двух сданных — поздняя, из двух начатых — та, где больше ответов. */
  function better(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (!!a.done !== !!b.done) return a.done ? a : b;
    if (a.done) return (b.ts || 0) > (a.ts || 0) ? b : a;
    return answered(b) > answered(a) ? b : a;
  }

  /* Обе стороны менялись с прошлой синхронизации — сводим, а не затираем. */
  function merge(k, local, remote) {
    if (isProgress(k) && local && remote && typeof local === 'object' && typeof remote === 'object') {
      var out = {};
      Object.keys(remote).forEach(function (id) { out[id] = remote[id]; });
      Object.keys(local).forEach(function (id) { out[id] = better(local[id], out[id]); });
      return out;
    }
    if (isErrors(k) && Array.isArray(local) && Array.isArray(remote)) {
      // Лишняя задача в журнале безвредна, потерянная ошибка — нет
      var seen = {}, all = [];
      local.concat(remote).forEach(function (e) {
        if (!e || seen[e.key]) return;
        seen[e.key] = 1;
        all.push(e);
      });
      return all;
    }
    return local;          // прочее (таблица умножения) — побеждает это устройство
  }

  var pushing = null;

  function push() {
    var st = student();
    if (!st) return Promise.resolve(false);
    if (pushing) return pushing.then(push);
    var m = meta();
    var p = prefix();
    var rows = [];
    Object.keys(m).forEach(function (k) {
      if (!m[k].dirty) return;
      var v = raw(p + k);
      if (v === null) return;
      try { rows.push({ student_id: st.id, key: k, value: JSON.parse(v) }); } catch (e) { /* пусто */ }
    });
    if (!rows.length) return Promise.resolve(false);
    var sentAt = Date.now();
    setStatus('syncing');
    pushing = api('POST', '/rest/v1/kv?on_conflict=student_id,key', rows,
                  { Prefer: 'resolution=merge-duplicates,return=representation' })
      .then(function (back) {
        var m2 = meta();
        (back || []).forEach(function (r) {
          var e = m2[r.key] = m2[r.key] || {};
          e.s = Date.parse(r.updated_at) || Date.now();
          // пока ждали ответа, ключ могли тронуть ещё раз — тогда он всё ещё «грязный»
          if (!(e.t > sentAt)) e.dirty = false;
        });
        saveMeta(m2);
        setStatus('synced');
        return true;
      })
      .catch(function (e) {
        setStatus(e.status === 401 ? 'signed-out' : 'offline');
        return false;
      })
      .then(function (r) { pushing = null; return r; });
    return pushing;
  }

  /* Забрать из облака то, что изменилось с прошлого раза.
     Возвращает true, если что-то на этом устройстве поменялось. */
  function pull() {
    var st = student();
    if (!st) return Promise.resolve(false);
    setStatus('syncing');
    return api('GET', '/rest/v1/kv?select=key,value,updated_at&student_id=eq.' + st.id)
      .then(function (rows) {
        var m = meta(), p = prefix(), changed = false;
        (rows || []).forEach(function (r) {
          var at = Date.parse(r.updated_at) || 0;
          var e = m[r.key] || {};
          if (e.s && at <= e.s) return;                   // это мы и отправили
          var local = raw(p + r.key);
          var val = r.value;
          if (e.dirty && local !== null) {
            try { val = merge(r.key, JSON.parse(local), r.value); } catch (x) { val = r.value; }
          }
          try { localStorage.setItem(p + r.key, JSON.stringify(val)); } catch (x) { return; }
          m[r.key] = { t: Date.now(), s: at, dirty: !!e.dirty };
          changed = true;
        });
        saveMeta(m);
        return push().then(function () { setStatus('synced'); return changed; });
      })
      .catch(function (e) {
        setStatus(e.status === 401 ? 'signed-out' : 'offline');
        return false;
      });
  }

  /* Прогресс, накопленный до входа (без приставки), — в профиль ученика.
     Переносим только ключи его класса и только если у ученика там пусто. */
  function importLocal(grade) {
    var p = prefix();
    if (!p) return [];
    var keys = grade === 2
      ? ['sasmo.g2.progress', 'sasmo.g2.errors', 'sasmo.g2.mult']
      : ['sasmo.progress', 'sasmo.errors'];
    var moved = [];
    keys.forEach(function (k) {
      var v = raw(k);
      if (v === null || raw(p + k) !== null) return;
      try { localStorage.setItem(p + k, v); } catch (e) { return; }
      touched(p + k);
      moved.push(k);
    });
    return moved;
  }

  function wipeLocal(pre) {
    try {
      var drop = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(pre) === 0) drop.push(k);
      }
      drop.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) { /* пусто */ }
  }

  /* Всё, что хранится о ребёнке в облаке, — одним файлом. */
  function exportStudent(st) {
    return readKv([st.id]).then(function (rows) {
      return { student: st, exportedAt: new Date().toISOString(), data: rows };
    });
  }

  /* --------------------------------------------------------- на страницах --- */

  var LABEL = {
    'signed-out': ['☁️', 'Войти, чтобы прогресс сохранялся в облаке'],
    idle: ['☁️', ''], syncing: ['⏳', 'сохраняем…'], synced: ['☁️', 'сохранено'],
    offline: ['⚠️', 'нет связи — сохраним позже']
  };

  function t(s, v) { return window.I18N ? window.I18N.t(s, v) : s; }

  /* Строчка под шапкой: кто сейчас решает и сохранено ли. */
  function paintBadge() {
    if (!enabled() || typeof document === 'undefined') return;
    var header = document.querySelector('.header');
    if (!header) return;
    var el = header.querySelector('.cloudline');
    if (!el) {
      el = document.createElement('div');
      el.className = 'cloudline';
      header.appendChild(el);
    }
    var st = student();
    var l = LABEL[status] || LABEL.idle;
    if (!session()) {
      el.innerHTML = '<a href="account.html">' + l[0] + ' ' + t(l[1]) + '</a>';
    } else if (!st) {
      el.innerHTML = '<a href="account.html">👤 ' + t('Выбери, кто решает') + '</a>';
    } else {
      el.innerHTML = '<a href="account.html">👤 ' + esc(st.nickname) + '</a>' +
                     (l[1] ? ' · <span class="cl-' + status + '">' + l[0] + ' ' + t(l[1]) + '</span>' : '');
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function boot() {
    if (!enabled()) return;
    paintBadge();
    if (!student()) return;
    pull().then(function (changed) {
      // Пришли свежие ответы с другого устройства. Перерисовываем страницу,
      // только если ребёнок ещё ничего на ней не решает.
      if (changed && !document.querySelector('.qcard') && window.SASMO) window.SASMO.reload();
    });
    // уходя со страницы, отправляем недосланное
    window.addEventListener('pagehide', function () { push(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') push();
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else setTimeout(boot, 0);
  }

  return {
    enabled: enabled, session: session, student: student, studentName: studentName,
    prefix: prefix, status: function () { return status; }, onStatus: onStatus,
    sendCode: sendCode, verify: verify, signOut: signOut, me: me,
    profile: profile, saveProfile: saveProfile,
    listStudents: listStudents, createStudent: createStudent, deleteStudent: deleteStudent,
    useStudent: useStudent, joinClass: joinClass, studentClasses: studentClasses,
    listClasses: listClasses, createClass: createClass, classRoster: classRoster,
    addToClass: addToClass, removeFromClass: removeFromClass, readKv: readKv,
    touched: touched, push: push, pull: pull, merge: merge, importLocal: importLocal,
    exportStudent: exportStudent, api: api, CONSENT_VERSION: CONSENT_VERSION
  };
})();
