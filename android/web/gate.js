/* ==========================================================================
   Math Gate — экран с задачами, который закрывает телефон.

   Задачи берутся из тех же наборов, что у сайта (data/…), по программе
   класса из assets/plan.js / plan2.js и списку прошлых олимпиад из
   assets/paper.js. Родитель выбирает, какие наборы годятся.

   Засчитывается только верный ответ с первой попытки: иначе вариант
   ответа подбирается перебором. Ошибся — видишь разбор и берёшь новую
   задачу. Пока задача не решена, она не меняется: закрыть и открыть
   экран, чтобы выпала задача полегче, не выйдет.

   Мост с Android — объект Gate (GateOverlay.Bridge). В обычном браузере
   его нет, и страница работает на заглушке — так её удобно проверять.
   ========================================================================== */

(function () {
  'use strict';

  var Gate = window.Gate || mockGate();
  var cfg = JSON.parse(Gate.config());
  var en = cfg.lang === 'en';

  var S = en ? {
    title: 'Solve {need} {tasks} to unlock the phone',
    task: 'task', tasks: 'tasks',
    loading: 'Loading a task…',
    check: 'Check', hint: '💡 Hint',
    right: '✓ Correct!', wrong: '✗ Not this time — here is the solution',
    answer: 'Correct answer: {a}.',
    next: 'Next task →',
    open: '🎉 Unlock the phone',
    unlocked: '🎉 Well done! The phone is unlocked.',
    left: 'Correct. {n} more to go!',
    noTasks: 'No tasks found. Ask a parent to check the settings (🔑).'
  } : {
    title: 'Реши {need} {tasks}, чтобы открыть телефон',
    task: 'задачу', tasks: 'задачи',
    loading: 'Загружаем задачу…',
    check: 'Проверить', hint: '💡 Подсказка',
    right: '✓ Верно!', wrong: '✗ Не получилось — вот разбор',
    answer: 'Правильный ответ: {a}.',
    next: 'Следующая задача →',
    open: '🎉 Открыть телефон',
    unlocked: '🎉 Молодец! Телефон открыт.',
    left: 'Верно. Осталось ещё {n}.',
    noTasks: 'Задачи не нашлись. Попроси родителя проверить настройки (🔑).'
  };

  function fmt(s, v) {
    return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k] !== undefined ? v[k] : m; });
  }
  function el(id) { return document.getElementById(id); }

  var FIG = window.SASMO_FIG || { forQuestion: function () { return ''; }, forExplain: function () { return ''; } };
  var localize = (window.I18N && I18N.localize) || function (q) { return q; };
  var THEORY = window.SASMO_THEORY || null;

  /* ---------- откуда брать задачи ---------- */

  function buildSets() {
    var plan = window.PLANS[cfg.grade === 2 ? 2 : 3];
    var prefix = plan.grade === 2 ? 'g2/' : '';
    var pools = cfg.pools || ['days'];
    var sets = [];
    plan.days.forEach(function (d) {
      var isDay = d.kind === 'test' || d.kind === 'topic';
      var isExam = d.kind === 'exam';
      if ((isDay && pools.indexOf('days') >= 0) || (isExam && pools.indexOf('exams') >= 0)) {
        sets.push({ id: prefix + d.id, file: plan.dir + d.id + '.js', v: d.v });
      }
    });
    if (pools.indexOf('papers') >= 0) {
      (window.PAPERS || []).forEach(function (p) {
        if (p.grade === plan.grade) sets.push({ id: p.set, file: 'data/' + p.set + '.js', v: p.varName });
      });
    }
    return sets;
  }

  var SETS = buildSets();

  function loadSet(set, cb) {
    if (window[set.v]) return cb(window[set.v]);
    var s = document.createElement('script');
    s.src = set.file;
    s.onload = function () { cb(window[set.v] || null); };
    s.onerror = function () { cb(null); };
    document.body.appendChild(s);
  }

  /* ---------- память: текущая задача и недавно виденные ---------- */

  var CUR_KEY = 'gate.current';
  var SEEN_KEY = 'gate.seen';

  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* пусто */ } }

  function markSeen(key) {
    var seen = get(SEEN_KEY, []).filter(function (x) { return x !== key; });
    seen.push(key);
    put(SEEN_KEY, seen.slice(-200));
  }

  /* Годится ли задача для замка: есть ответ, понятный тип. */
  function usable(q) {
    if (!q || q.skip) return false;
    if (q.type === 'open') return typeof q.ans === 'number';
    return q.opts && q.opts.length > 1 && typeof q.ans === 'number';
  }

  /* Случайный набор → случайная задача, которую давно не видели. */
  function pick(tries, cb) {
    if (!SETS.length || tries <= 0) return cb(null);
    var set = SETS[Math.floor(Math.random() * SETS.length)];
    loadSet(set, function (data) {
      var qs = data && data.questions;
      if (!qs || !qs.length) return pick(tries - 1, cb);
      var seen = get(SEEN_KEY, []);
      var fresh = [];
      qs.forEach(function (q, i) {
        if (usable(q) && seen.indexOf(set.id + '#' + i) < 0) fresh.push(i);
      });
      if (!fresh.length) {
        // все задачи набора недавно были — годится любая, если больше ничего нет
        if (tries > 1) return pick(tries - 1, cb);
        qs.forEach(function (q, i) { if (usable(q)) fresh.push(i); });
        if (!fresh.length) return cb(null);
      }
      cb({ set: set, idx: fresh[Math.floor(Math.random() * fresh.length)] });
    });
  }

  function restore(cb) {
    var cur = get(CUR_KEY, null);
    if (!cur) return cb(null);
    var set = SETS.filter(function (s) { return s.id === cur.id; })[0];
    if (!set) return cb(null);
    loadSet(set, function (data) {
      var q = data && data.questions && data.questions[cur.idx];
      cb(usable(q) ? { set: set, idx: cur.idx } : null);
    });
  }

  /* ---------- отрисовка ---------- */

  var state = { cur: null, q: null, answered: false, done: false, typed: '' };

  function header() {
    el('title').textContent = fmt(S.title, { need: cfg.need, tasks: cfg.need === 1 ? S.task : S.tasks });
    var h = '';
    for (var i = 0; i < cfg.need; i++) h += '<span class="' + (i < cfg.solved ? 'on' : '') + '"></span>';
    el('dots').innerHTML = h;
  }

  function apps() {
    el('apps').innerHTML = (cfg.apps || []).map(function (a) {
      return '<button data-pkg="' + a.pkg + '">' + a.label.replace(/</g, '&lt;') + '</button>';
    }).join('');
  }

  function show(cur) {
    var q = localize(window[cur.set.v].questions[cur.idx]);
    state = { cur: cur, q: q, answered: false, done: false, typed: '' };
    put(CUR_KEY, { id: cur.set.id, idx: cur.idx });

    // «Мне непонятно — объясни»: теория к приёму, без ответа этой задачи
    var theory = THEORY ? THEORY.forQuestion(q, cfg.lang) : '';

    var body;
    if (q.type === 'open') {
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'];
      body = '<div class="pad-view" id="padView"></div>' +
             '<div class="pad" id="pad">' +
               keys.map(function (k) { return '<button data-key="' + k + '">' + k + '</button>'; }).join('') +
             '</div>' +
             '<button class="btn gate-next" data-act="check">' + S.check + '</button>';
    } else {
      body = '<div class="opts">' + q.opts.map(function (o, j) {
        return '<div class="opt" data-j="' + j + '" id="o' + j + '">' +
                 '<span class="lt">' + 'ABCDE'[j] + ')</span><span>' + o + '</span></div>';
      }).join('') + '</div>';
    }

    el('box').innerHTML =
      '<div class="qcard" id="card">' +
        '<div class="q-left">' +
          '<div class="qh"><span class="qt">' + q.q + '</span></div>' +
          FIG.forQuestion(q) +
          body +
          ((q.hint || theory) ? '<div class="qactions">' +
             (q.hint ? '<button class="mini ghost" data-act="hint">' + S.hint + '</button>' : '') +
             (theory ? '<button class="mini ghost theory-btn" data-act="theory">' + THEORY.label(cfg.lang) + '</button>' : '') +
           '</div>' : '') +
          (q.hint ? '<div class="hint" id="hint">💡 ' + q.hint + '</div>' : '') +
          '<div class="expl" id="expl">' + (q.ex || '') + FIG.forExplain(q) + '</div>' +
          (theory ? '<div class="theory" id="theory">' + theory + '</div>' : '') +
        '</div>' +
      '</div>';
    el('after').innerHTML = '';
    window.scrollTo(0, 0);
  }

  function next() {
    el('box').innerHTML = '<div class="empty">' + S.loading + '</div>';
    el('after').innerHTML = '';
    pick(12, function (cur) {
      if (!cur) { el('box').innerHTML = '<div class="empty">' + S.noTasks + '</div>'; return; }
      show(cur);
    });
  }

  /* ---------- ответ ---------- */

  function parseNum(raw) {
    var s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
    return parseFloat(s);
  }

  function answer(given) {
    if (state.answered) return;
    var q = state.q;
    var ok;
    if (q.type === 'open') {
      var n = parseNum(given);
      if (n === null) return;
      ok = Math.abs(n - q.ans) < 1e-9;
    } else {
      ok = given === q.ans;
    }
    state.answered = true;
    markSeen(state.cur.set.id + '#' + state.cur.idx);
    put(CUR_KEY, null);

    var r = JSON.parse(Gate.result(state.cur.set.id, state.cur.idx, ok, q.topic || ''));
    cfg.solved = r.solved;
    cfg.need = r.need;
    header();

    var card = el('card');
    card.classList.add('done', ok ? 'ok' : 'no');
    var hb = card.querySelector('[data-act="hint"]');
    if (hb) hb.remove();

    if (q.type === 'open') {
      el('padView').classList.add(ok ? 'cok' : 'cno');
      el('pad').classList.add('off');
      var cb = card.querySelector('[data-act="check"]');
      if (cb) cb.remove();
      if (!ok) el('expl').innerHTML = '<b>' + fmt(S.answer, { a: q.ans }) + '</b> ' + el('expl').innerHTML;
    } else {
      el('o' + given).classList.add(ok ? 'cok' : 'cno');
      if (!ok) el('o' + q.ans).classList.add('cok');
    }

    var note = ok ? (r.done ? S.unlocked : (r.need - r.solved > 0 ? fmt(S.left, { n: r.need - r.solved }) : S.right))
                  : S.wrong;
    state.done = r.done;
    el('after').innerHTML =
      '<div class="gate-note ' + (ok ? 'ok' : 'no') + '">' + note + '</div>' +
      (r.done ? '<button class="btn gate-next" data-act="open">' + S.open + '</button>'
              : '<button class="btn sec gate-next" data-act="next">' + S.next + '</button>');
  }

  function typeKey(k) {
    if (state.answered) return;
    if (k === '⌫') state.typed = state.typed.slice(0, -1);
    else if (k === ',') { if (state.typed && state.typed.indexOf(',') < 0) state.typed += ','; }
    else if (state.typed.length < 9) state.typed += k;
    el('padView').textContent = state.typed;
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-j],[data-key],[data-act],[data-pkg]');
    if (!t) return;
    if (t.hasAttribute('data-j')) return answer(parseInt(t.getAttribute('data-j'), 10));
    if (t.hasAttribute('data-key')) return typeKey(t.getAttribute('data-key'));
    if (t.hasAttribute('data-pkg')) return Gate.launch(t.getAttribute('data-pkg'));
    switch (t.getAttribute('data-act')) {
      case 'check': return answer(state.typed);
      case 'hint': el('hint').classList.add('vis'); t.remove(); return;
      case 'theory': el('theory').classList.toggle('vis'); return;
      case 'next': return next();
      case 'open': return Gate.close();
    }
  });

  /* Окно снова показали (телефон опять закрылся): обновить счёт,
     а если прошлый заход закончился открытием — дать новую задачу. */
  window.GateUI = {
    shown: function () {
      cfg = JSON.parse(Gate.config());
      header();
      apps();
      if (state.done || !state.cur) next();
      else if (state.answered) next();
    },
    // для проверки страницы в браузере без Android
    current: function () { return state.cur && { id: state.cur.set.id, idx: state.cur.idx }; }
  };

  /* ---------- заглушка для обычного браузера ---------- */

  function mockGate() {
    var solved = 0, need = 2;
    var q = new URLSearchParams(location.search);
    return {
      config: function () {
        return JSON.stringify({ need: need, solved: solved, grade: q.get('g') === '2' ? 2 : 3,
          lang: q.get('lang') || 'ru', pools: (q.get('pools') || 'days').split(','),
          apps: [{ pkg: 'dialer', label: en ? 'Phone' : 'Телефон' }] });
      },
      result: function (set, idx, ok) {
        if (ok) solved++;
        console.log('[gate] result', set, idx, ok);
        return JSON.stringify({ solved: Math.min(solved, need), need: need, done: solved >= need });
      },
      close: function () { console.log('[gate] close'); solved = 0; },
      launch: function (p) { console.log('[gate] launch', p); }
    };
  }

  /* ---------- старт ---------- */

  header();
  apps();
  el('loading').textContent = S.loading;
  restore(function (cur) { if (cur) show(cur); else next(); });
})();
