/* ==========================================================================
   Math Gate — настройки родителя (ParentActivity).

   Три состояния: пароля ещё нет (первая настройка), пароль есть, но вход
   не выполнен, и вход выполнен — тогда видны все настройки. Проверяет
   права Kotlin-сторона: страница только показывает и передаёт.
   ========================================================================== */

(function () {
  'use strict';

  var P = window.Parent || mockParent();
  var st = JSON.parse(P.state());
  var en = st.lang === 'en';
  var appsCache = null;

  var S = en ? {
    createTitle: 'Create a master password',
    createText: 'Digits only, 4 to 12. It opens the phone in any situation and protects these settings. ' +
                'Don’t show it to the child.',
    pw1: 'New password', pw2: 'Repeat it', save: 'Save password',
    pwBad: 'Use 4–12 digits.', pwDiff: 'The two passwords differ.',
    loginTitle: 'Parent sign-in', login: 'Sign in', wrong: 'Wrong password.', frozen: 'Too many tries. Wait {s} s.',
    status: 'Right now', locked: '🔒 Locked — tasks are required',
    openUntil: '🔓 Open until {t}', openScreen: '🔓 Open until the screen turns off', paused: '⏸ Lock is turned off',
    lockNow: 'Lock now', resume: 'Turn the lock back on', done: 'Done — leave parent mode',
    setup: 'Setup', a11y: 'Lock service (Accessibility)', a11ySub: 'Needed to cover other apps',
    admin: 'Uninstall protection (Device admin)', adminSub: 'The child can’t remove the app',
    turnOn: 'Turn on', on: '✓ on', off: '✗ off',
    restricted: 'Android 13 and newer: if the Accessibility switch is greyed out, open App info → ⋮ (top right) → ' +
                '“Allow restricted settings”, then try again.',
    appInfo: 'Open App info',
    rules: 'Rules', need: 'Tasks to unlock', time: 'Phone stays open', screen: 'until screen off',
    min: 'min', grade: 'Grade', sources: 'Where tasks come from',
    days: 'Daily lessons', exams: 'Mock exams', papers: 'Past olympiads',
    lang: 'Language', blockSet: 'Lock system Settings for the child',
    blockSetSub: 'Otherwise the lock can be switched off there',
    apps: 'Always allowed apps', appsSub: 'Open without tasks. The phone app and calls are always allowed.',
    showApps: 'Choose apps',
    change: 'Change master password',
    journal: 'Journal', today: 'Today: {ok} solved, {no} wrong', clear: 'Clear journal', empty: 'Nothing yet.',
    forgot: 'Forgot the password?',
    forgotText: 'Restart the phone in Safe Mode (hold the power-off button on screen). Third-party apps, including ' +
                'this lock, are off there. Then go to Settings → Security → Device admin apps, turn off Math Gate, ' +
                'and uninstall it.'
  } : {
    createTitle: 'Придумайте мастер-пароль',
    createText: 'Только цифры, от 4 до 12. Он открывает телефон в любой ситуации и защищает эти настройки. ' +
                'Не показывайте его ребёнку.',
    pw1: 'Новый пароль', pw2: 'Ещё раз', save: 'Сохранить пароль',
    pwBad: 'Нужно 4–12 цифр.', pwDiff: 'Пароли не совпадают.',
    loginTitle: 'Вход родителя', login: 'Войти', wrong: 'Неверный пароль.', frozen: 'Слишком много попыток. Подождите {s} с.',
    status: 'Сейчас', locked: '🔒 Закрыт — нужны задачи',
    openUntil: '🔓 Открыт до {t}', openScreen: '🔓 Открыт до выключения экрана', paused: '⏸ Замок выключен',
    lockNow: 'Закрыть сейчас', resume: 'Включить замок снова', done: 'Готово — выйти из режима родителя',
    setup: 'Подключение', a11y: 'Служба замка (Спец. возможности)', a11ySub: 'Без неё замок не закрывает приложения',
    admin: 'Защита от удаления (Администратор)', adminSub: 'Ребёнок не сможет удалить приложение',
    turnOn: 'Включить', on: '✓ включено', off: '✗ выключено',
    restricted: 'Android 13 и новее: если переключатель в «Спец. возможностях» серый, откройте «О приложении» → ⋮ ' +
                '(справа вверху) → «Разрешить ограниченные настройки» и попробуйте снова.',
    appInfo: 'Открыть «О приложении»',
    rules: 'Правила', need: 'Сколько задач решить', time: 'На сколько открывается', screen: 'до выкл. экрана',
    min: 'мин', grade: 'Класс', sources: 'Откуда задачи',
    days: 'Занятия по дням', exams: 'Пробные экзамены', papers: 'Прошлые олимпиады',
    lang: 'Язык', blockSet: 'Закрыть ребёнку системные Настройки',
    blockSetSub: 'Иначе замок можно выключить там',
    apps: 'Приложения без задач', appsSub: 'Открываются без задач. Телефон и звонки разрешены всегда.',
    showApps: 'Выбрать приложения',
    change: 'Сменить мастер-пароль',
    journal: 'Журнал', today: 'Сегодня: {ok} решено, {no} с ошибкой', clear: 'Очистить журнал', empty: 'Пока пусто.',
    forgot: 'Забыли пароль?',
    forgotText: 'Перезагрузите телефон в безопасном режиме (долгое нажатие на «Выключить» на экране). Сторонние ' +
                'приложения, и этот замок тоже, там не работают. Затем Настройки → Безопасность → Приложения ' +
                'администратора устройства: выключите Math Gate и удалите его.'
  };

  function fmt(s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k] !== undefined ? v[k] : m; }); }
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hhmm(ms) { var d = new Date(ms); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  /* ---------- экраны ---------- */

  function render() {
    st = JSON.parse(P.state());
    if (!st.hasPassword) return renderCreate(false);
    if (!st.authed) return renderLogin();
    renderMain();
  }

  function pwForm(title, text, btn) {
    return '<div class="pc"><h3>' + title + '</h3>' + (text ? '<p>' + text + '</p>' : '') +
      '<input class="pw" id="pw1" type="tel" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="' + S.pw1 + '">' +
      '<input class="pw" id="pw2" type="tel" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="' + S.pw2 + '">' +
      '<div class="msg" id="msg"></div>' +
      '<button class="btn" data-act="setpw">' + btn + '</button></div>';
  }

  function renderCreate(change) {
    el('app').innerHTML = pwForm(change ? S.change : S.createTitle, change ? '' : S.createText, S.save) +
      (change ? '<button class="btn ghost" data-act="back">←</button>' : '');
  }

  function renderLogin() {
    el('app').innerHTML = '<div class="pc"><h3>' + S.loginTitle + '</h3>' +
      '<input class="pw" id="pw" type="tel" inputmode="numeric" pattern="[0-9]*" autocomplete="off">' +
      '<div class="msg" id="msg">' + (st.frozen ? fmt(S.frozen, { s: st.frozen }) : '') + '</div>' +
      '<button class="btn" data-act="login">' + S.login + '</button></div>' +
      forgot();
  }

  function seg(field, opts, cur) {
    return '<div class="seg">' + opts.map(function (o) {
      return '<button data-set="' + field + '" data-val="' + o[0] + '" class="' + (String(o[0]) === String(cur) ? 'on' : '') + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  }

  function renderMain() {
    var status = st.paused ? S.paused
      : st.locked ? S.locked
      : st.unlockedUntil >= 9e18 ? S.openScreen
      : fmt(S.openUntil, { t: hhmm(st.unlockedUntil) });

    var h = '';
    h += '<div class="pc"><h3>' + S.status + '</h3><p class="pstat">' + status + '</p>' +
         (st.paused ? '<button class="btn" data-act="resume">' + S.resume + '</button>' : '') +
         '<button class="btn" data-act="lock">' + S.lockNow + '</button>' +
         '<button class="btn ghost" data-act="logout">' + S.done + '</button></div>';

    h += '<div class="pc"><h3>' + S.setup + '</h3>' +
         '<div class="row"><div class="lbl">' + S.a11y + '<small>' + S.a11ySub + '</small></div>' +
           (st.a11y ? '<span class="ok-mark">' + S.on + '</span>' : '<div class="seg"><button class="on" data-act="a11y">' + S.turnOn + '</button></div>') + '</div>' +
         '<div class="row"><div class="lbl">' + S.admin + '<small>' + S.adminSub + '</small></div>' +
           (st.admin ? '<span class="ok-mark">' + S.on + '</span>' : '<div class="seg"><button class="on" data-act="admin">' + S.turnOn + '</button></div>') + '</div>' +
         (st.a11y ? '' : '<p>' + S.restricted + '</p><div class="seg" style="justify-content:flex-start;margin-top:.4rem">' +
                          '<button data-act="appinfo">' + S.appInfo + '</button></div>') +
         '</div>';

    var pools = st.pools || [];
    function poolRow(key, label) {
      return '<div class="row"><div class="lbl">' + label + '</div><div class="seg">' +
             '<button data-pool="' + key + '" class="' + (pools.indexOf(key) >= 0 ? 'on' : '') + '">' +
             (pools.indexOf(key) >= 0 ? S.on : S.off) + '</button></div></div>';
    }
    h += '<div class="pc"><h3>' + S.rules + '</h3>' +
         '<div class="row"><div class="lbl">' + S.need + '</div>' + seg('need', [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]], st.need) + '</div>' +
         '<div class="row"><div class="lbl">' + S.time + '</div>' +
           seg('minutes', [[15, '15'], [30, '30'], [60, '60'], [120, '120'], [0, S.screen]], st.minutes) + '</div>' +
         '<div class="row"><div class="lbl">' + S.grade + '</div>' + seg('grade', [[2, '2'], [3, '3']], st.grade) + '</div>' +
         '<div class="row"><div class="lbl">' + S.lang + '</div>' + seg('lang', [['ru', 'RU'], ['en', 'EN']], st.lang) + '</div>' +
         '</div>';

    h += '<div class="pc"><h3>' + S.sources + '</h3>' +
         poolRow('days', S.days) + poolRow('exams', S.exams) +
         (st.grade === 3 ? poolRow('papers', S.papers) : '') + '</div>';

    h += '<div class="pc"><div class="row"><div class="lbl">' + S.blockSet + '<small>' + S.blockSetSub + '</small></div>' +
         '<div class="seg"><button data-act="blockset" class="' + (st.blockSettings ? 'on' : '') + '">' +
         (st.blockSettings ? S.on : S.off) + '</button></div></div></div>';

    h += '<div class="pc"><h3>' + S.apps + '</h3><p>' + S.appsSub + '</p><div class="apps" id="apps">' +
         '<div class="seg" style="justify-content:flex-start;margin-top:.4rem"><button data-act="apps">' + S.showApps +
         ' (' + (st.allowed || []).length + ')</button></div></div></div>';

    h += journal();
    h += '<div class="pc"><button class="btn ghost" data-act="changepw">' + S.change + '</button></div>';
    h += forgot();
    el('app').innerHTML = h;
  }

  function journal() {
    var log = JSON.parse(P.log());
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var ok = 0, no = 0;
    log.forEach(function (e) { if (e.t >= today.getTime()) { if (e.ok) ok++; else no++; } });
    var rows = log.slice(-30).reverse().map(function (e) {
      var d = new Date(e.t);
      return '<div><span class="t">' + d.getDate() + '.' + (d.getMonth() + 1) + ' ' + hhmm(e.t) + '</span>' +
             '<span class="' + (e.ok ? 'ok-mark' : 'no-mark') + '">' + (e.ok ? '✓' : '✗') + '</span>' +
             '<span>' + esc(e.topic || '') + ' <small>(' + esc(e.set) + ' #' + (e.i + 1) + ')</small></span></div>';
    }).join('');
    return '<div class="pc"><h3>' + S.journal + '</h3><p class="pstat">' + fmt(S.today, { ok: ok, no: no }) + '</p>' +
           '<div class="log">' + (rows || '<p>' + S.empty + '</p>') + '</div>' +
           (rows ? '<button class="btn ghost" data-act="clearlog">' + S.clear + '</button>' : '') + '</div>';
  }

  function forgot() {
    return '<div class="pc"><h3>' + S.forgot + '</h3><p>' + S.forgotText + '</p></div>';
  }

  function renderApps() {
    if (!appsCache) appsCache = JSON.parse(P.apps());
    var allowed = st.allowed || [];
    el('apps').innerHTML = appsCache.map(function (a) {
      return '<label><input type="checkbox" data-app="' + esc(a.pkg) + '"' +
             (allowed.indexOf(a.pkg) >= 0 ? ' checked' : '') + '>' + esc(a.label) + '</label>';
    }).join('');
  }

  /* ---------- действия ---------- */

  function save(o) { P.save(JSON.stringify(o)); }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-act],[data-set],[data-pool]');
    if (!t) return;

    if (t.hasAttribute('data-set')) {
      var f = t.getAttribute('data-set'), v = t.getAttribute('data-val');
      var o = {}; o[f] = (f === 'lang') ? v : parseInt(v, 10);
      save(o);
      if (f === 'lang') { location.reload(); return; }
      return render();
    }
    if (t.hasAttribute('data-pool')) {
      var k = t.getAttribute('data-pool');
      var pools = (st.pools || []).slice();
      var i = pools.indexOf(k);
      if (i >= 0) { if (pools.length > 1) pools.splice(i, 1); } else pools.push(k);
      save({ pools: pools });
      return render();
    }

    switch (t.getAttribute('data-act')) {
      case 'setpw': {
        var a = el('pw1').value, b = el('pw2').value;
        if (!/^\d{4,12}$/.test(a)) { el('msg').textContent = S.pwBad; return; }
        if (a !== b) { el('msg').textContent = S.pwDiff; return; }
        if (!P.setPassword(a)) { el('msg').textContent = S.pwBad; return; }
        return render();
      }
      case 'login': {
        if (P.login(el('pw').value)) return render();
        st = JSON.parse(P.state());
        el('pw').value = '';
        el('msg').textContent = st.frozen ? fmt(S.frozen, { s: st.frozen }) : S.wrong;
        return;
      }
      case 'back': return render();
      case 'changepw': return renderCreate(true);
      case 'lock': return P.lockNow();
      case 'logout': return P.logout();
      case 'resume': save({ paused: false }); return render();
      case 'blockset': save({ blockSettings: !st.blockSettings }); return render();
      case 'a11y': return P.openA11y();
      case 'admin': return P.openAdmin();
      case 'appinfo': return P.openAppInfo();
      case 'apps': return renderApps();
      case 'clearlog': P.clearLog(); return render();
    }
  });

  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (!t.hasAttribute || !t.hasAttribute('data-app')) return;
    var allowed = (st.allowed || []).filter(function (p) { return p !== t.getAttribute('data-app'); });
    if (t.checked) allowed.push(t.getAttribute('data-app'));
    save({ allowed: allowed });
    st.allowed = allowed;
  });

  // Вернулись из системных настроек (onResume) — обновить отметки «включено».
  // Экран ввода пароля не перерисовываем, чтобы не стереть набранное.
  window.ParentUI = {
    refresh: function () {
      var fresh = JSON.parse(P.state());
      if (fresh.authed && st.authed && !el('pw1')) render();
      else if (fresh.authed !== st.authed) render();
    }
  };

  /* ---------- заглушка для обычного браузера ---------- */

  function mockParent() {
    var s = { hasPassword: false, authed: true, frozen: 0, a11y: false, admin: false, lang: 'ru',
              need: 2, minutes: 30, grade: 3, pools: ['days'], allowed: [], blockSettings: true,
              paused: false, locked: true, unlockedUntil: 0 };
    var pass = null;
    return {
      state: function () { return JSON.stringify(s); },
      login: function (p) { s.authed = p === pass; return s.authed; },
      setPassword: function (p) { pass = p; s.hasPassword = true; s.authed = true; return true; },
      save: function (j) { var o = JSON.parse(j); for (var k in o) s[k] = o[k]; return true; },
      apps: function () { return JSON.stringify([{ pkg: 'org.wiki', label: 'Wikipedia' }, { pkg: 'com.maps', label: 'Maps' }]); },
      log: function () { return JSON.stringify([{ t: Date.now(), set: 'day03', i: 4, ok: true, topic: 'Четыре действия' }]); },
      clearLog: function () {}, lockNow: function () { s.locked = true; }, logout: function () {},
      openA11y: function () {}, openAdmin: function () {}, openAppInfo: function () {}
    };
  }

  render();
})();
