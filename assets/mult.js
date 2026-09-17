/* ==========================================================================
   Тренажёр таблицы умножения — второй класс

   Цель не «посчитать», а «вспомнить». На каждый пример отведено несколько
   секунд: вспомнить ответ их хватает, а досчитать сложением «7, 14, 21…» —
   нет. Не успел — такая же ошибка, как неверный вариант: правильный ответ
   показываем сразу, и в следующих раундах этот пример попадается чаще.

   Статистика ведётся по каждому примеру (7×8 и 8×7 — один пример) и лежит
   под своим ключом: в журнал ошибок занятий она не попадает.
   ========================================================================== */

window.MULT = (function () {
  'use strict';

  /* Строки интерфейса — через словарь в assets/i18n.js; без него по-русски. */
  var t = window.I18N ? window.I18N.t : function (x, v) {
    return v ? String(x).replace(/\{(\w+)\}/g, function (m, k) { return k in v ? v[k] : m; }) : x;
  };

  var KEY = 'sasmo.g2.mult';

  var TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  var LIMITS = [
    { s: 10, name: 'спокойно' },
    { s: 6,  name: 'быстро' },
    { s: 4,  name: 'молния' }
  ];
  var LENGTHS = [20, 30, 50];

  // Верный ответ быстрее этого — пример знают наизусть, а не считают
  var FAST_MS = 3000;
  var HISTORY = 5;
  var ALL_FACTS = 45;          // разных примеров от 2×2 до 10×10

  /* ---------- хранилище ---------- */

  function blank() {
    return { cfg: { tables: [2, 3, 4, 5, 10], limit: 6, len: 20 }, facts: {}, rounds: [] };
  }

  function sanitizeCfg(c) {
    var d = blank().cfg;
    var tables = Array.isArray(c.tables)
      ? c.tables.filter(function (t) { return TABLES.indexOf(t) >= 0; })
      : [];
    return {
      tables: tables.length ? tables : d.tables,
      limit: LIMITS.some(function (l) { return l.s === c.limit; }) ? c.limit : d.limit,
      len: LENGTHS.indexOf(c.len) >= 0 ? c.len : d.len
    };
  }

  function load() {
    var st = blank();
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object') {
        if (raw.cfg) st.cfg = sanitizeCfg(raw.cfg);
        if (raw.facts && typeof raw.facts === 'object') st.facts = raw.facts;
        if (Array.isArray(raw.rounds)) st.rounds = raw.rounds;
      }
    } catch (e) { /* испорченные данные — начинаем с чистого листа */ }
    return st;
  }

  function save(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* пусто */ }
  }

  /* ---------- примеры ---------- */

  function key(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }

  function shuffle(arr, rnd) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // Примеры выбранных столбиков: 3 → 3×2 … 3×10. На 1 не умножаем — это не тренировка.
  function pool(tables) {
    var seen = {}, out = [];
    tables.forEach(function (a) {
      for (var b = 2; b <= 10; b++) {
        var k = key(a, b);
        if (seen[k]) continue;
        seen[k] = 1;
        out.push([Math.min(a, b), Math.max(a, b)]);
      }
    });
    return out;
  }

  /* История примера — последние ответы: время верного ответа в мс или -1,
     если ответ неверный или не успел.
       new  — ещё не встречался
       bad  — среди трёх последних есть ошибка
       good — два последних раза ответил быстро
       slow — знает, но пока вспоминает дольше, чем надо */
  function status(fact) {
    var h = fact && Array.isArray(fact.h) ? fact.h : [];
    if (!h.length) return 'new';
    if (h.slice(-3).some(function (ms) { return ms < 0; })) return 'bad';
    var two = h.slice(-2);
    if (two.length === 2 && two.every(function (ms) { return ms <= FAST_MS; })) return 'good';
    return 'slow';
  }

  var WEIGHT = { new: 3, bad: 6, slow: 3, good: 1 };

  /* Раунд: чаще то, что не выучено, но без одного и того же примера подряд
     и без перекоса, когда трудный пример занимает половину раунда. */
  function pickRound(pairs, facts, len, rnd) {
    rnd = rnd || Math.random;
    var cap = Math.ceil(len / pairs.length) + 1;
    var used = {}, out = [], prev = null;

    while (out.length < len) {
      var cands = pairs.filter(function (p) {
        var k = key(p[0], p[1]);
        return k !== prev && (used[k] || 0) < cap;
      });
      if (!cands.length) cands = pairs;

      var weights = cands.map(function (p) { return WEIGHT[status(facts[key(p[0], p[1])])]; });
      var total = weights.reduce(function (s, w) { return s + w; }, 0);
      var r = rnd() * total, at = 0;
      while (at < cands.length - 1 && r >= weights[at]) { r -= weights[at]; at++; }

      var pick = cands[at];
      prev = key(pick[0], pick[1]);
      used[prev] = (used[prev] || 0) + 1;
      out.push(rnd() < 0.5 ? { a: pick[0], b: pick[1] } : { a: pick[1], b: pick[0] });
    }
    return out;
  }

  /* Прорешать трудные: каждый пример два-три раза, вразброс. */
  function drillRound(pairs, rnd) {
    rnd = rnd || Math.random;
    var times = pairs.length < 4 ? 3 : 2;
    var list = [];
    pairs.forEach(function (p) {
      for (var t = 0; t < times; t++) list.push(p);
    });

    for (var attempt = 0; attempt < 30; attempt++) {
      shuffle(list, rnd);
      var clash = list.some(function (p, i) {
        return i > 0 && key(p[0], p[1]) === key(list[i - 1][0], list[i - 1][1]);
      });
      if (!clash) break;
    }
    return list.map(function (p) {
      return rnd() < 0.5 ? { a: p[0], b: p[1] } : { a: p[1], b: p[0] };
    });
  }

  function flip(n) {
    if (n < 10 || n > 99) return -1;
    var r = (n % 10) * 10 + Math.floor(n / 10);
    return r === n ? -1 : r;
  }

  /* Четыре варианта. Неверные — правдоподобные: тот, кто не помнит пример,
     не должен угадывать его по «странному» числу. */
  function options(a, b, rnd) {
    rnd = rnd || Math.random;
    var p = a * b;
    var taken = {};
    taken[p] = 1;
    var picked = [];

    function add(list, upTo) {
      for (var i = 0; i < list.length && picked.length < upTo; i++) {
        var v = list[i];
        if (v > 0 && !taken[v]) { taken[v] = 1; picked.push(v); }
      }
    }

    function sameParity(v) { return (v - p) % 2 === 0; }
    function otherParity(v) { return !sameParity(v); }

    // Самые коварные — соседи по таблице: 7×8 путают с 7×7 и 6×8
    var near = shuffle([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b], rnd);
    var more = shuffle([p + 2, p - 2, p + 10, p - 10, flip(p), a + b, p + 1, p - 1], rnd);

    // Все варианты стараемся держать одной чётности с ответом: у 3×7 = 21
    // все соседи по таблице чётные, и нечётный ответ среди них угадывался бы
    // без всякого знания таблицы
    add(near.filter(sameParity), 2);
    add(more.filter(sameParity), 3);
    add(near.filter(otherParity), 3);
    add(more.filter(otherParity), 3);
    add([p + 4, p + 6, p + 8, p + 3], 3);

    return shuffle(picked.concat(p), rnd);
  }

  /* ---------- мелочи ---------- */

  function sec(ms) { return (ms / 1000).toFixed(1).replace('.', ','); }

  function today() {
    var d = new Date();
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function now() {
    return window.performance && performance.now ? performance.now() : Date.now();
  }

  var raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function (fn) { return setTimeout(fn, 40); };
  var caf = window.cancelAnimationFrame
    ? window.cancelAnimationFrame.bind(window)
    : clearTimeout;

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  /* ==========================================================================
     Страница
     ========================================================================== */

  var st, root, run = null;
  var clock = { t0: 0, spent: 0, on: false, id: 0 };

  function $(id) { return document.getElementById(id); }

  function header(fill, ok, no, label) {
    var pf = $('pf'), cO = $('cO'), cN = $('cN'), cP = $('cP');
    if (pf) pf.style.width = (fill * 100) + '%';
    if (cO) cO.textContent = ok;
    if (cN) cN.textContent = no;
    if (cP) cP.textContent = label;
  }

  /* ---------- настройки и карта таблицы ---------- */

  function renderSetup() {
    stopRun();
    var cfg = st.cfg;
    header(0, '', '', t('выбери столбики и время'));

    var tableChips = TABLES.map(function (t) {
      return '<button class="vbtn' + (cfg.tables.indexOf(t) >= 0 ? ' on' : '') +
             '" data-table="' + t + '">×' + t + '</button>';
    }).join('');

    var limitChips = LIMITS.map(function (l) {
      return '<button class="vbtn' + (cfg.limit === l.s ? ' on' : '') + '" data-limit="' + l.s + '">' +
             t('{s} с <small>{name}</small>', { s: l.s, name: t(l.name) }) + '</button>';
    }).join('');

    var lenChips = LENGTHS.map(function (n) {
      return '<button class="vbtn' + (cfg.len === n ? ' on' : '') + '" data-len="' + n + '">' + n + '</button>';
    }).join('');

    root.innerHTML =
      '<div class="note">' +
        '<h3>' + t('Вспоминать, а не считать') + '</h3>' +
        '<p>' + t('Пример и четыре ответа. На каждый пример — несколько секунд: этого хватает, чтобы <b>вспомнить</b>, но мало, чтобы досчитать сложением «7, 14, 21…». Не успел — считается ошибкой, и правильный ответ сразу показывается.') + '</p>' +
        '<p style="margin-top:.35rem">' + t('Много «не успел» — лучше убрать часть столбиков, чем добавлять секунды: так ребёнок учит примеры наизусть, а не тренирует счёт.') + '</p>' +
      '</div>' +

      '<div class="mset">' +
        '<div class="mrow"><div class="mlbl">' + t('Столбики') + '</div>' +
          '<div class="chips" id="mTables">' + tableChips + '</div>' +
          '<div class="mquick">' +
            '<button data-quick="easy">2, 3, 4, 5, 10</button>' +
            '<button data-quick="hard">6, 7, 8, 9</button>' +
            '<button data-quick="all">' + t('все') + '</button>' +
          '</div></div>' +
        '<div class="mrow"><div class="mlbl">' + t('Время на пример') + '</div>' +
          '<div class="chips">' + limitChips + '</div></div>' +
        '<div class="mrow"><div class="mlbl">' + t('Примеров в раунде') + '</div>' +
          '<div class="chips">' + lenChips + '</div></div>' +
        '<button class="btn mgo" id="mGo">' + t('Поехали!') + '</button>' +
        '<div class="mkeys">' + t('на компьютере отвечать можно клавишами 1–4') + '</div>' +
      '</div>' +

      mapHTML() +
      roundsHTML();

    root.querySelector('.mset').addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;

      if (b.hasAttribute('data-table')) {
        var t = +b.getAttribute('data-table');
        var at = cfg.tables.indexOf(t);
        if (at >= 0) {
          if (cfg.tables.length === 1) return;        // хотя бы один столбик
          cfg.tables.splice(at, 1);
        } else {
          cfg.tables.push(t);
          cfg.tables.sort(function (x, y) { return x - y; });
        }
      } else if (b.hasAttribute('data-quick')) {
        var q = b.getAttribute('data-quick');
        cfg.tables = q === 'easy' ? [2, 3, 4, 5, 10] : q === 'hard' ? [6, 7, 8, 9] : TABLES.slice();
      } else if (b.hasAttribute('data-limit')) {
        cfg.limit = +b.getAttribute('data-limit');
      } else if (b.hasAttribute('data-len')) {
        cfg.len = +b.getAttribute('data-len');
      } else if (b.id === 'mGo') {
        save(st);
        startRound(pickRound(pool(cfg.tables), st.facts, cfg.len), 'round');
        return;
      } else {
        return;
      }
      save(st);
      renderSetup();
    });

    var reset = $('mReset');
    if (reset) {
      reset.addEventListener('click', function () {
        SASMO.armReset(reset, function () {
          st.facts = {};
          st.rounds = [];
          save(st);
          renderSetup();
        });
      });
    }
  }

  function mapHTML() {
    var counts = { good: 0, slow: 0, bad: 0 };
    var seen = {};
    var rows = '<tr><th>×</th>';
    for (var c = 2; c <= 10; c++) rows += '<th>' + c + '</th>';
    rows += '</tr>';

    for (var a = 2; a <= 10; a++) {
      rows += '<tr><th>' + a + '</th>';
      for (var b = 2; b <= 10; b++) {
        var k = key(a, b);
        var s = status(st.facts[k]);
        if (!seen[k]) { seen[k] = 1; if (counts[s] !== undefined) counts[s]++; }
        rows += '<td class="' + s + '">' + (a * b) + '</td>';
      }
      rows += '</tr>';
    }

    return '<div class="mmap">' +
        '<h3>' + t('Карта таблицы') + '</h3>' +
        '<div class="sum">' + t('Выучено <b>{good}</b> из {all} примеров', { good: counts.good, all: ALL_FACTS }) +
          (counts.bad ? t(' · ошибается в <b>{bad}</b>', { bad: counts.bad }) : '') + '</div>' +
        '<div class="mscroll"><table class="mtab">' + rows + '</table></div>' +
        '<div class="mlegend">' +
          '<span><i class="good"></i>' + t('выучен — дважды подряд быстрее 3 с') + '</span>' +
          '<span><i class="slow"></i>' + t('знает, но вспоминает долго') + '</span>' +
          '<span><i class="bad"></i>' + t('недавно ошибся или не успел') + '</span>' +
          '<span><i></i>' + t('ещё не встречался') + '</span>' +
        '</div>' +
      '</div>';
  }

  function roundsHTML() {
    if (!st.rounds.length) return '';
    var rows = st.rounds.slice(-7).reverse().map(function (r) {
      return '<li>' + t('{date} · <b>{ok} из {n}</b> за {limit} с', { date: r.date, ok: r.ok, n: r.n, limit: r.limit }) +
             (r.avg ? t(' · в среднем {avg} с', { avg: sec(r.avg) }) : '') +
             (r.kind === 'drill' ? t(' · трудные') : '') + '</li>';
    }).join('');
    return '<div class="note mrounds"><h3>' + t('Последние раунды') + '</h3><ul>' + rows + '</ul>' +
           '<button class="mini ghost" id="mReset" ' +
             'data-armed-text="Точно стереть? Нажми ещё раз">' + t('Стереть статистику таблицы') + '</button></div>';
  }

  /* ---------- раунд ---------- */

  function startRound(list, kind) {
    run = { list: list, i: 0, limit: st.cfg.limit, kind: kind, locked: true, wait: 0 };
    // на телефоне шапка на время раунда сжимается — см. body.mplaying в quiz.css
    document.body.classList.add('mplaying');

    root.innerHTML =
      '<div class="mplay">' +
        '<div class="mbar"><div class="mfill" id="mFill"></div></div>' +
        '<div class="mleft" id="mLeft"></div>' +
        '<div class="mexpr" id="mExpr"></div>' +
        '<div class="mopts" id="mOpts"></div>' +
        '<div class="mmsg" id="mMsg"></div>' +
      '</div>' +
      '<div class="mfoot"><button class="mini ghost" id="mStop">' + t('Закончить раунд') + '</button></div>';

    $('mOpts').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-j]');
      if (b) answer(+b.getAttribute('data-j'));
    });
    $('mStop').addEventListener('click', function () {
      stopRun();
      if (answered().length) renderResult(); else renderSetup();
    });

    window.scrollTo(0, 0);
    ask();
  }

  function answered() {
    return run ? run.list.filter(function (q) { return q.ms !== undefined; }) : [];
  }

  function playHeader() {
    var done = answered();
    var ok = done.filter(function (q) { return q.ms >= 0; }).length;
    var no = done.length - ok;
    header(done.length / run.list.length,
           t('{n} верно', { n: ok }), no + ' ' + t(plural(no, 'ошибка', 'ошибки', 'ошибок')),
           t('{n} из {m}', { n: Math.min(run.i + 1, run.list.length), m: run.list.length }));
  }

  function ask() {
    var q = run.list[run.i];
    q.opts = options(q.a, q.b);

    $('mExpr').textContent = q.a + ' × ' + q.b;
    $('mOpts').className = 'mopts';
    $('mOpts').innerHTML = q.opts.map(function (v, j) {
      return '<button class="mopt" data-j="' + j + '">' + v + '</button>';
    }).join('');
    $('mMsg').className = 'mmsg';
    $('mMsg').textContent = '';

    playHeader();
    run.locked = false;
    clock.spent = 0;
    resumeClock();
  }

  function elapsed() {
    return clock.spent + (clock.on ? now() - clock.t0 : 0);
  }

  function resumeClock() {
    clock.t0 = now();
    clock.on = true;
    tick();
  }

  function pauseClock() {
    if (clock.on) clock.spent += now() - clock.t0;
    clock.on = false;
    caf(clock.id);
  }

  function tick() {
    if (!run || run.locked || !clock.on) return;
    var limitMs = run.limit * 1000;
    var e = elapsed();
    var left = Math.max(0, 1 - e / limitMs);

    var fill = $('mFill');
    fill.style.width = (left * 100) + '%';
    fill.className = 'mfill' + (left < 0.25 ? ' crit' : left < 0.5 ? ' warn' : '');
    $('mLeft').textContent = t('{n} с', { n: Math.max(0, Math.ceil((limitMs - e) / 1000)) });

    if (e >= limitMs) { settle(null); return; }
    clock.id = raf(tick);
  }

  function answer(j) {
    if (!run || run.locked) return;
    settle(j);
  }

  /* j — индекс выбранного варианта, null — время вышло */
  function settle(j) {
    pauseClock();
    run.locked = true;

    var q = run.list[run.i];
    var p = q.a * q.b;
    var ms = Math.round(elapsed());
    var good = j !== null && q.opts[j] === p && ms <= run.limit * 1000;

    q.ms = good ? ms : -1;
    q.late = j === null;
    remember(q.a, q.b, q.ms);

    var opts = $('mOpts');
    opts.className = 'mopts locked';
    var btns = opts.querySelectorAll('.mopt');
    q.opts.forEach(function (v, i) {
      if (v === p) btns[i].classList.add('cok');
      else if (i === j) btns[i].classList.add('cno');
    });

    if (q.late) {
      $('mFill').style.width = '0%';
      $('mLeft').textContent = t('{n} с', { n: 0 });
    }

    var msg = $('mMsg');
    if (good) {
      msg.className = 'mmsg ok';
      msg.textContent = t(ms <= FAST_MS ? '⚡ Верно!' : '✓ Верно');
    } else {
      msg.className = 'mmsg no';
      msg.textContent = (q.late ? t('⏱ Время вышло: ') : '✗ ') + q.a + ' × ' + q.b + ' = ' + p;
    }

    playHeader();

    // На ошибке правильный ответ висит дольше — его надо успеть увидеть
    run.wait = setTimeout(function () {
      run.i++;
      if (run.i >= run.list.length) renderResult(); else ask();
    }, good ? 550 : 1800);
  }

  function remember(a, b, ms) {
    var k = key(a, b);
    var f = st.facts[k] && Array.isArray(st.facts[k].h) ? st.facts[k] : { h: [] };
    f.h.push(ms);
    if (f.h.length > HISTORY) f.h = f.h.slice(-HISTORY);
    st.facts[k] = f;
    save(st);
  }

  function stopRun() {
    pauseClock();
    document.body.classList.remove('mplaying');
    if (run) {
      clearTimeout(run.wait);
      run.locked = true;
    }
  }

  /* ---------- итог раунда ---------- */

  function renderResult() {
    stopRun();
    var done = answered();
    var n = done.length;
    var okList = done.filter(function (q) { return q.ms >= 0; });
    var fast = okList.filter(function (q) { return q.ms <= FAST_MS; }).length;
    var slow = okList.length - fast;
    var late = done.filter(function (q) { return q.late; }).length;
    var wrong = n - okList.length - late;
    var avg = okList.length
      ? okList.reduce(function (s, q) { return s + q.ms; }, 0) / okList.length
      : 0;

    st.rounds.push({ date: today(), n: n, ok: okList.length, limit: run.limit,
                     avg: Math.round(avg), kind: run.kind });
    if (st.rounds.length > 30) st.rounds = st.rounds.slice(-30);
    save(st);

    // Трудные — с ошибкой или «не успел»; медленные — верно, но дольше 3 с
    var trouble = [], slowOnes = [], seen = {};
    done.forEach(function (q) {
      if (q.ms < 0 && !seen[key(q.a, q.b)]) { seen[key(q.a, q.b)] = 1; trouble.push(q); }
    });
    done.forEach(function (q) {
      if (q.ms > FAST_MS && !seen[key(q.a, q.b)]) { seen[key(q.a, q.b)] = 1; slowOnes.push(q); }
    });

    var drill = trouble.length ? trouble : slowOnes;
    var rate = n ? okList.length / n : 0;
    var title = t(rate >= 0.9 && !late ? 'Отлично!' : rate >= 0.7 ? 'Хорошо!' : 'Есть над чем поработать');

    function chip(q, cls) {
      return '<span class="mfact' + cls + '">' + q.a + ' × ' + q.b + ' = ' + (q.a * q.b) + '</span>';
    }

    var facts = '';
    if (trouble.length || slowOnes.length) {
      facts =
        '<div class="mtrouble">' +
          (trouble.length
            ? '<h3>' + t('Ошибся или не успел') + '</h3><div class="mfacts">' +
                trouble.map(function (q) { return chip(q, ''); }).join('') + '</div>'
            : '') +
          (slowOnes.length
            ? '<h3>' + t('Верно, но дольше 3 секунд') + '</h3><div class="mfacts">' +
                slowOnes.map(function (q) { return chip(q, ' slow'); }).join('') + '</div>'
            : '') +
          '<p class="mhint">' + t('Проговорите эти примеры вслух пару раз и прорешайте их отдельно. В следующих раундах они будут попадаться чаще.') + '</p>' +
        '</div>';
    }

    root.innerHTML =
      '<div class="rp vis">' +
        '<h2>' + title + '</h2>' +
        '<div class="fs">' + okList.length + ' / ' + n + '</div>' +
        '<div class="fd">' + t('верных ответов · по <b>{limit} с</b> на пример', { limit: run.limit }) + '</div>' +
        '<div class="breakdown">' +
          '<div>' + t('⚡ быстро, до 3 с: <b>{n}</b>', { n: fast }) + '</div>' +
          '<div>' + t('🐢 верно, но дольше 3 с: <b>{n}</b>', { n: slow }) + '</div>' +
          '<div>' + t('✗ неверно: <b>{n}</b>', { n: wrong }) + '</div>' +
          '<div>' + t('⏱ не успел: <b>{n}</b>', { n: late }) + '</div>' +
          (okList.length ? '<div>' + t('среднее время верного ответа: <b>{avg} с</b>', { avg: sec(avg) }) + '</div>' : '') +
        '</div>' +
        facts +
        '<div>' +
          (drill.length
            ? '<button class="btn" id="mDrill">' +
                t(trouble.length ? 'Прорешать трудные ({n})' : 'Прорешать медленные ({n})', { n: drill.length }) + '</button>'
            : '') +
          '<button class="btn sec" id="mAgain">' + t('Новый раунд') + '</button>' +
        '</div>' +
        '<div style="margin-top:.6rem"><button class="mini" id="mSetup">' + t('Настройки и карта таблицы') + '</button></div>' +
      '</div>';

    header(1, t('{n} верно', { n: okList.length }), (n - okList.length) + ' ' +
           t(plural(n - okList.length, 'ошибка', 'ошибки', 'ошибок')), t('раунд окончен'));

    if ($('mDrill')) {
      $('mDrill').addEventListener('click', function () {
        startRound(drillRound(drill.map(function (q) { return [q.a, q.b]; })), 'drill');
      });
    }
    $('mAgain').addEventListener('click', function () {
      startRound(pickRound(pool(st.cfg.tables), st.facts, st.cfg.len), 'round');
    });
    $('mSetup').addEventListener('click', renderSetup);
    window.scrollTo(0, 0);
  }

  /* ---------- запуск ---------- */

  function start(mount) {
    st = load();
    root = mount;

    document.addEventListener('keydown', function (ev) {
      if (!run || run.locked || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var j = '1234'.indexOf(ev.key);
      if (j >= 0) { ev.preventDefault(); answer(j); }
    });

    // Свернул вкладку посреди примера — время не идёт, пока его не видно
    document.addEventListener('visibilitychange', function () {
      if (!run || run.locked) return;
      if (document.hidden) pauseClock(); else resumeClock();
    });

    renderSetup();
  }

  return {
    start: start,
    // для проверок без браузера
    _: { pool: pool, options: options, pickRound: pickRound, drillRound: drillRound,
         status: status, key: key }
  };
})();
