/* ==========================================================================
   SASMO Grade 3 — движок тренажёра
   Работает по протоколу file:// — без модулей, без fetch, без сборки.

   Формат задачи:
     {
       type : 'mcq' | 'open',      // выбор ответа | открытый ответ (число)
       q    : 'текст задачи (html)',
       opts : ['A','B','C','D'],   // только для mcq
       ans  : 2 | 37,              // индекс варианта для mcq, число для open
       hint : 'подсказка — приём, а не ответ',
       ex   : 'разбор решения',
       topic: 'Закономерности',    // для журнала ошибок
       img  : 'img/q1.png'         // необязательно
     }

   Режимы:
     practice — ответ проверяется сразу, есть подсказка (тренировочный день)
     exam     — ответы закрыты до кнопки «Завершить», таймер, счёт по SASMO
   ========================================================================== */

window.SASMO = (function () {
  'use strict';

  // Ключи задаёт страница: у второго и третьего класса за тренажёром
  // разные дети, и прогресс одного не должен мешаться с прогрессом другого.
  var PROGRESS_KEY = 'sasmo.progress';
  var ERRORS_KEY   = 'sasmo.errors';

  // Ссылки в итоговой панели тоже зависят от класса
  var HUB_HREF = 'index.html';
  var ERRORS_HREF = 'errors.html';

  /* Как показывать набор: «одна задача на экран» или всё списком.
     Ключ общий для обоих классов — это свойство устройства, а не ребёнка. */
  var VIEW_KEY = 'sasmo.view';
  var PHONE = '(max-width: 760px)';

  function savedView() {
    try { return localStorage.getItem(VIEW_KEY); } catch (e) { return null; }
  }

  function rememberView(step) {
    try { localStorage.setItem(VIEW_KEY, step ? 'step' : 'list'); } catch (e) { /* пусто */ }
  }

  /* По умолчанию телефон получает режим «по одной», монитор — список.
     Явный выбор ребёнка сильнее умолчания. */
  function prefersStep() {
    var saved = savedView();
    if (saved === 'step' || saved === 'list') return saved === 'step';
    return !!(window.matchMedia && window.matchMedia(PHONE).matches);
  }

  function usePlan(plan) {
    if (!plan) return;
    if (plan.keys && plan.keys.progress) PROGRESS_KEY = plan.keys.progress;
    if (plan.keys && plan.keys.errors)   ERRORS_KEY   = plan.keys.errors;
    var g = plan.grade && plan.grade !== 3 ? '?g=' + plan.grade : '';
    // Отдельные работы задают ссылки прямо: их журнал ошибок свой у каждого
    // решающего, и по классу его адрес не вычислить.
    HUB_HREF = plan.hubHref || ('index.html' + g);
    ERRORS_HREF = plan.errorsHref || ('errors.html' + g);
  }

  /* ---------- хранилище (localStorage может быть недоступен) ---------- */

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Прогресс живёт в localStorage. В приватном окне или при отключённых
  // данных сайтов он недоступен — тогда занятия работают, но не запоминаются,
  // и об этом честнее предупредить сразу.
  function storageWorks() {
    try {
      localStorage.setItem('sasmo.probe', '1');
      localStorage.removeItem('sasmo.probe');
      return true;
    } catch (e) {
      return false;
    }
  }

  function getProgress()      { return load(PROGRESS_KEY, {}); }
  function getErrors()        { return load(ERRORS_KEY, []); }
  function saveProgress(p)    { return save(PROGRESS_KEY, p); }
  function saveErrors(e)      { return save(ERRORS_KEY, e); }

  /* ---------- прогресс внутри набора ----------

     Сохраняется каждый ответ по отдельности, а не только пройденный целиком
     день: ребёнок может решить половину задач, закрыть вкладку и вернуться
     к остальным вечером. Запись одного набора выглядит так:

       { answers: { "0": {g: 2, ok: true} }, ok, no, total, date,
         done: true, score: 78,            // после завершения
         exam: { given: […], left: 3540 }  // незаконченная попытка экзамена
       }                                                                      */

  function getRecord(setId) {
    var rec = getProgress()[setId];
    return rec && typeof rec === 'object' ? rec : null;
  }

  function recFor(setId) {
    var rec = getRecord(setId) || {};
    if (!rec.answers || typeof rec.answers !== 'object') rec.answers = {};
    return rec;
  }

  function putRecord(setId, rec) {
    var p = getProgress();
    p[setId] = rec;
    return saveProgress(p);
  }

  function answeredCount(rec) {
    return rec && rec.answers ? Object.keys(rec.answers).length : 0;
  }

  /* Сколько задач набора уже тронуто — и в занятии, и в незаконченном экзамене. */
  function startedCount(rec) {
    if (!rec) return 0;
    if (rec.exam && Array.isArray(rec.exam.given)) {
      return rec.exam.given.filter(function (g) {
        return g !== null && g !== undefined && String(g).trim() !== '';
      }).length;
    }
    return answeredCount(rec);
  }

  /* Сброс одного дня: и его результат, и его задачи в журнале ошибок. */
  function resetDay(setId) {
    var p = getProgress();
    delete p[setId];
    saveProgress(p);
    saveErrors(getErrors().filter(function (e) { return e.setId !== setId; }));
  }

  function mmss(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' +
           String(sec % 60).padStart(2, '0');
  }

  /* Сброс — действие необратимое, поэтому просим нажать дважды.
     confirm() не годится: модальные окна пугают ребёнка и ломают автоматизацию. */
  function armReset(btn, done) {
    if (btn.dataset.armed === '1') {
      btn.dataset.armed = '0';
      done();
      return;
    }
    var was = btn.innerHTML;
    btn.dataset.armed = '1';
    btn.innerHTML = btn.getAttribute('data-armed-text') || 'Нажми ещё раз';
    btn.classList.add('armed');
    setTimeout(function () {
      if (!btn.isConnected || btn.dataset.armed !== '1') return;
      btn.dataset.armed = '0';
      btn.innerHTML = was;
      btn.classList.remove('armed');
    }, 4000);
  }

  function today() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return day + '.' + m;
  }

  /* ---------- журнал ошибок ---------- */

  function rememberError(setId, idx, q) {
    var errs = getErrors();
    var key = setId + '#' + idx;
    for (var i = 0; i < errs.length; i++) {
      if (errs[i].key === key) return;      // уже записана — не дублируем
    }
    errs.push({
      key: key, setId: setId, idx: idx, ts: Date.now(),
      type: q.type, q: q.q, opts: q.opts, ans: q.ans,
      hint: q.hint, ex: q.ex, topic: q.topic,
      fig: q.fig, exfig: q.exfig, img: q.img
    });
    saveErrors(errs);
  }

  function forgetError(key) {
    var errs = getErrors().filter(function (e) { return e.key !== key; });
    saveErrors(errs);
  }

  /* ---------- разбор ответа ---------- */

  // Ответ в секции B — целое неотрицательное число. Принимаем запятую как
  // десятичный разделитель: ребёнок пишет «44,5», а не «44.5».
  function parseNum(raw) {
    if (raw === null || raw === undefined) return null;
    var s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
    if (s === '' || !/^-?\d+(\.\d+)?$/.test(s)) return null;
    return parseFloat(s);
  }

  function isCorrect(q, given) {
    if (q.type === 'open') {
      var n = parseNum(given);
      return n !== null && Math.abs(n - q.ans) < 1e-9;
    }
    return given === q.ans;
  }

  /* Рисунки к задачам живут в assets/fig.js; без него страница просто без картинок. */
  var FIG = window.SASMO_FIG || { forQuestion: function () { return ''; },
                                  forExplain: function () { return ''; } };

  /* ---------- отрисовка ---------- */

  function questionHTML(q, i, cfg) {
    var n = i + 1;
    var body = '';

    if (q.type === 'open') {
      body =
        '<div class="open-row">' +
          '<input class="open-in" id="in' + i + '" type="text" inputmode="decimal" ' +
                 'autocomplete="off" placeholder="ответ">' +
          (cfg.mode === 'exam'
            ? '<span class="hintmsg">пустых ответов быть не должно</span>'
            : '<button class="mini" data-act="check" data-i="' + i + '">Проверить</button>') +
        '</div>';
    } else {
      body = '<div class="opts">' + q.opts.map(function (o, j) {
        return '<div class="opt" data-act="pick" data-i="' + i + '" data-j="' + j + '" id="o' + i + '_' + j + '">' +
                 '<span class="lt">' + 'ABCD'[j] + ')</span><span>' + o + '</span>' +
               '</div>';
      }).join('') + '</div>';
    }

    var actions = '';
    if (cfg.mode === 'practice' && q.hint) {
      actions = '<div class="qactions">' +
                  '<button class="mini ghost" data-act="hint" data-i="' + i + '">💡 Подсказка</button>' +
                '</div>';
    }

    return '<div class="qcard" id="c' + i + '" data-i="' + i + '">' +
             '<div class="q-left">' +
               '<div class="qh"><span class="qn">' + n + '.</span><span class="qt">' + q.q + '</span></div>' +
               FIG.forQuestion(q) +
               body +
               actions +
               (q.hint ? '<div class="hint" id="h' + i + '">💡 ' + q.hint + '</div>' : '') +
               '<div class="expl" id="e' + i + '">' + (q.ex || '') + FIG.forExplain(q) + '</div>' +
             '</div>' +
             (q.img ? '<div class="q-right"><img src="' + q.img + '" alt="Задача ' + n + '" loading="lazy"></div>' : '') +
           '</div>';
  }

  /* ---------- правила счёта на экзамене ----------

     Разные олимпиады считают баллы по-разному, и подгонять движок под каждую
     руками — верный способ однажды показать ребёнку чужой счёт. Поэтому
     правила приходят данными: набор задач кладёт их в поле `rules`, а без
     этого поля работают правила SASMO — такие же, как были до появления
     второго формата.

       split — сколько задач в первой секции (дальше идёт вторая)
       start — стартовые баллы, которые дают до первой задачи
       a, b  — сколько прибавить за верный (ok) и за неверный (no) в секции
       max   — максимум; если не указан, считается сам
       tiers — пороги наград: [балл, подпись], сверху вниз                    */

  var SASMO_RULES = {
    split: 15,
    start: 15,
    a: { ok: 2, no: -1 },
    b: { ok: 4, no: 0 },
    aName: 'Секция A',
    bName: 'Секция B',
    aHead: 'СЕКЦИЯ A · задачи 1–15 · выбор ответа',
    aNote: '+2 за верный · −1 за неверный · 0 за пропуск. ' +
           'Не смог вычеркнуть хотя бы два варианта — пропускай.',
    bHead: 'СЕКЦИЯ B · задачи 16–25 · открытый ответ',
    bNote: '+4 за верный · 0 за неверный. За ошибку не снимают — ' +
           'пиши число даже когда не уверен.',
    tiers: [[70, '🥇 Уровень золота'], [60, '🥈 Уровень серебра'],
            [50, '🥉 Уровень бронзы'], [40, '🎖 Уровень похвального отзыва']]
  };

  function rulesFor(cfg) {
    var src = cfg.rules || SASMO_RULES;
    var n = cfg.questions.length;
    var r = {
      split: src.split == null ? n : src.split,
      start: src.start || 0,
      a: { ok: (src.a && src.a.ok) || 0, no: (src.a && src.a.no) || 0 },
      b: { ok: (src.b && src.b.ok) || 0, no: (src.b && src.b.no) || 0 },
      aName: src.aName || 'Секция A',
      bName: src.bName || 'Секция B',
      aHead: src.aHead || '', aNote: src.aNote || '',
      bHead: src.bHead || '', bNote: src.bNote || '',
      tiers: src.tiers || []
    };
    r.max = src.max == null
      ? r.start + r.split * r.a.ok + (n - r.split) * r.b.ok
      : src.max;
    return r;
  }

  /* ---------- основной класс набора ---------- */

  function Quiz(cfg) {
    this.cfg = cfg;                       // {mount, questions, mode, setId, rules, onFinish}
    this.rules = rulesFor(cfg);
    this.Q = cfg.questions;
    this.given = new Array(this.Q.length).fill(null);
    this.checked = new Array(this.Q.length).fill(false);
    this.ok = 0;
    this.no = 0;
    this.answered = 0;
    this.finished = false;
    this.mount = cfg.mount;
  }

  Quiz.prototype.render = function () {
    var self = this;
    var html = '';

    if (this.cfg.mode === 'exam' && this.rules.aHead) {
      html += '<div class="sect">' + this.rules.aHead +
              '<small>' + this.rules.aNote + '</small></div>';
    }

    this.Q.forEach(function (q, i) {
      if (self.cfg.mode === 'exam' && i === self.rules.split && self.rules.bHead) {
        html += '<div class="sect">' + self.rules.bHead +
                '<small>' + self.rules.bNote + '</small></div>';
      }
      html += questionHTML(q, i, self.cfg);
    });

    html += '<div style="text-align:center;margin-top:1.2rem">' +
              '<button class="btn" id="finishBtn">' +
                (this.cfg.mode === 'exam' ? '🏁 Завершить экзамен' : '✅ Показать итог') +
              '</button>' +
            '</div>';

    html += '<div class="rp" id="res">' +
              '<h2>🏆 Результат</h2>' +
              '<div class="fs" id="fs"></div>' +
              '<div class="fd" id="fd"></div>' +
              '<div id="bd"></div>' +
              '<div id="resActions"></div>' +
            '</div>';

    this.mount.innerHTML = html;
    this.bind();
    this.updateHeader();
    this.restore();
    this.setupStep();
  };

  /* ==========================================================================
     Режим «одна задача на экран»

     Задачи по-прежнему рисуются все и разом: те же id, те же обработчики,
     та же запись ответов. Режим только прячет лишние карточки и добавляет
     навигацию — поэтому проверка, подсказки, таймер, счёт и журнал ошибок
     работают в нём ровно так же, как в списке.
     ========================================================================== */

  Quiz.prototype.setupStep = function () {
    var self = this;

    this.cards = [].slice.call(this.mount.querySelectorAll('.qcard'));
    if (!this.cards.length) return;

    // Набор уже доведён до конца (день открыли заново) — листать нечего,
    // на экране разбор всех задач. Переключатель здесь был бы мёртвой кнопкой.
    if (this.finished) return;

    var fin = document.getElementById('finishBtn');
    this.finWrap = fin ? fin.parentNode : null;
    this.stepAt = 0;
    this.stepOn = false;

    /* Переключатель вида — над задачами, чтобы его было видно сразу. */
    var tg = document.createElement('div');
    tg.className = 'viewtoggle';
    tg.innerHTML =
      '<button class="vbtn" type="button" data-view="step">По одной</button>' +
      '<button class="vbtn" type="button" data-view="list">Списком</button>';
    this.mount.insertBefore(tg, this.mount.firstChild);
    this.toggle = tg;

    tg.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-view]');
      if (!b) return;
      var step = b.getAttribute('data-view') === 'step';
      rememberView(step);
      self.setStepMode(step);
    });

    /* Панель навигации живёт в body: на телефоне она прижата к низу экрана,
       и внутри прокручиваемого контейнера ей не место. */
    var stale = document.getElementById('stepnav');
    if (stale) stale.remove();
    stale = document.getElementById('stepmap');
    if (stale) stale.remove();

    var nav = document.createElement('div');
    nav.id = 'stepnav';
    nav.className = 'stepnav';
    nav.innerHTML =
      '<button class="snav" type="button" id="stepPrev" aria-label="Предыдущая задача">&#8592;</button>' +
      '<button class="snum" type="button" id="stepNum" aria-label="Все задачи"></button>' +
      '<button class="snav" type="button" id="stepNext" aria-label="Следующая задача">&#8594;</button>';
    document.body.appendChild(nav);
    this.nav = nav;

    document.getElementById('stepPrev').addEventListener('click', function () {
      self.goStep(self.stepAt - 1);
    });
    document.getElementById('stepNext').addEventListener('click', function () {
      self.goStep(self.stepAt + 1);
    });
    document.getElementById('stepNum').addEventListener('click', function () {
      self.openMap();
    });

    /* Карта задач: по ней возвращаются к пропущенным на втором проходе. */
    var map = document.createElement('div');
    map.id = 'stepmap';
    map.className = 'stepmap';
    map.innerHTML =
      '<div class="sheet">' +
        '<h3>Все задачи<button class="mapx" type="button" id="stepMapClose" ' +
             'aria-label="Закрыть">&times;</button></h3>' +
        '<div class="grid" id="stepGrid"></div>' +
        '<div class="mapfoot" id="stepMapFoot"></div>' +
      '</div>';
    document.body.appendChild(map);
    this.map = map;

    map.addEventListener('click', function (ev) {
      var cell = ev.target.closest('[data-go]');
      if (cell) {
        self.closeMap();
        self.goStep(parseInt(cell.getAttribute('data-go'), 10));
        return;
      }
      if (ev.target.closest('#stepMapFinish')) {
        self.closeMap();
        self.finish(false);
        return;
      }
      if (ev.target.closest('#stepMapClose') || !ev.target.closest('.sheet')) self.closeMap();
    });

    /* Свайп по карточке — привычный на телефоне способ листать. */
    var x0 = null, y0 = null;
    this.mount.addEventListener('touchstart', function (ev) {
      if (!self.stepOn || ev.touches.length !== 1) { x0 = null; return; }
      x0 = ev.touches[0].clientX;
      y0 = ev.touches[0].clientY;
    }, { passive: true });

    this.mount.addEventListener('touchend', function (ev) {
      if (x0 === null || !ev.changedTouches.length) return;
      var dx = ev.changedTouches[0].clientX - x0;
      var dy = ev.changedTouches[0].clientY - y0;
      x0 = null;
      // горизонталь должна явно перевешивать вертикаль, иначе это прокрутка
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      self.goStep(self.stepAt + (dx < 0 ? 1 : -1));
    }, { passive: true });

    /* Стрелки на клавиатуре — для планшета с клавиатурой. */
    document.addEventListener('keydown', function (ev) {
      if (!self.stepOn || ev.altKey || ev.ctrlKey || ev.metaKey) return;
      if (ev.target && ev.target.closest && ev.target.closest('input, textarea')) return;
      if (ev.key === 'ArrowLeft') self.goStep(self.stepAt - 1);
      else if (ev.key === 'ArrowRight') self.goStep(self.stepAt + 1);
      else if (ev.key === 'Escape') self.closeMap();
    });

    /* Повернули телефон или открыли на другом экране — умолчание пересчитываем,
       но только пока ребёнок не выбрал вид сам. */
    if (window.matchMedia) {
      var mq = window.matchMedia(PHONE);
      var onChange = function () {
        if (savedView()) return;
        self.setStepMode(mq.matches);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    this.setStepMode(prefersStep());
  };

  Quiz.prototype.setStepMode = function (on) {
    if (!this.cards) return;
    // после подведения итога листать нечего: там разбор всех задач разом
    this.stepOn = !!on && !this.finished;

    this.mount.classList.toggle('stepped', this.stepOn);
    document.body.classList.toggle('has-stepnav', this.stepOn);
    if (this.nav) this.nav.classList.toggle('vis', this.stepOn);

    var view = this.stepOn ? 'step' : 'list';
    [].forEach.call(this.toggle.querySelectorAll('[data-view]'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-view') === view);
    });

    if (!this.stepOn) {
      this.cards.forEach(function (c) { c.classList.remove('cur'); });
      [].forEach.call(this.mount.querySelectorAll('.sect'), function (x) {
        x.classList.remove('cur');
      });
      if (this.finWrap) this.finWrap.classList.remove('hid');
      this.closeMap();
      return;
    }
    this.showStep();
  };

  /* Перейти к задаче с номером i (счёт с нуля). */
  Quiz.prototype.goStep = function (i) {
    if (!this.stepOn) return;
    i = Math.max(0, Math.min(this.cards.length - 1, i));
    var moved = i !== this.stepAt;
    this.stepAt = i;
    this.showStep();
    if (moved) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  Quiz.prototype.showStep = function () {
    var at = this.stepAt;

    this.cards.forEach(function (c, i) { c.classList.toggle('cur', i === at); });

    /* Заголовок секции показываем на её первой задаче: правила должны
       попасться ребёнку до того, как он начнёт в секции отвечать. */
    [].forEach.call(this.mount.querySelectorAll('.sect'), function (x) {
      x.classList.remove('cur');
    });
    var prev = this.cards[at].previousElementSibling;
    if (prev && prev.classList.contains('sect')) prev.classList.add('cur');

    // «Завершить» — под последней задачей и в карте задач
    if (this.finWrap) this.finWrap.classList.toggle('hid', at !== this.cards.length - 1);

    var prevBtn = document.getElementById('stepPrev');
    var nextBtn = document.getElementById('stepNext');
    if (prevBtn) prevBtn.disabled = at === 0;
    if (nextBtn) {
      nextBtn.disabled = at === this.cards.length - 1;
      // задача разобрана — подсвечиваем «дальше», чтобы не искать кнопку
      nextBtn.classList.toggle('ready', !!this.checked[at] && at < this.cards.length - 1);
    }

    this.stepSync();
    if (this.map.classList.contains('vis')) this.fillMap();
  };

  /* Что известно про задачу: решена верно, неверно, тронута или пуста. */
  Quiz.prototype.stepState = function (i) {
    if (this.checked[i]) {
      return this.cards[i].classList.contains('ok') ? 'ok' : 'no';
    }
    var q = this.Q[i], filled;
    if (q.type === 'open') {
      var inp = document.getElementById('in' + i);
      filled = !!(inp && String(inp.value).trim() !== '');
    } else {
      filled = this.given[i] !== null && this.given[i] !== undefined;
    }
    return filled ? 'seen' : '';
  };

  /* Счётчик на панели: «Часть 1 · 7 / 25». */
  Quiz.prototype.stepSync = function () {
    var num = document.getElementById('stepNum');
    if (!num || !this.stepOn) return;

    var label = '', el = this.cards[this.stepAt];
    while (el) {
      if (el.classList && el.classList.contains('sect')) {
        label = (el.firstChild.textContent || '').split('\u00b7')[0].trim();
        break;
      }
      el = el.previousElementSibling;
    }
    num.innerHTML = (label ? '<b>' + label + '</b> &middot; ' : '') +
                    (this.stepAt + 1) + ' / ' + this.cards.length;
  };

  Quiz.prototype.fillMap = function () {
    var self = this;

    document.getElementById('stepGrid').innerHTML = this.Q.map(function (q, i) {
      return '<button class="cell ' + self.stepState(i) + (i === self.stepAt ? ' at' : '') +
             '" type="button" data-go="' + i + '">' + (i + 1) + '</button>';
    }).join('');

    var left = 0;
    this.Q.forEach(function (q, i) { if (!self.stepState(i)) left++; });

    document.getElementById('stepMapFoot').innerHTML = this.finished ? '' :
      '<div class="mapleft">' +
        (left ? 'Без ответа: <b>' + left + '</b>' : 'Отвечено всё') +
      '</div>' +
      '<button class="btn" type="button" id="stepMapFinish">' +
        (this.cfg.mode === 'exam' ? 'Завершить' : 'Показать итог') +
      '</button>';
  };

  Quiz.prototype.openMap = function () {
    if (!this.stepOn) return;
    this.fillMap();
    this.map.classList.add('vis');
  };

  Quiz.prototype.closeMap = function () {
    if (this.map) this.map.classList.remove('vis');
  };

  /* --- возвращаем набор в том виде, в каком его бросили --- */
  Quiz.prototype.restore = function () {
    var self = this;
    var setId = this.cfg.setId;
    if (!setId || setId === 'errors') return;     // журнал перетасовывается, номера не совпадут

    var rec = getRecord(setId);
    if (!rec) return;

    if (this.cfg.mode === 'exam') {
      var att = rec.exam;                  // при завершении экзамена это поле удаляется,
      if (!att || !Array.isArray(att.given)) return;   // значит здесь всегда живая попытка
      if (typeof att.left === 'number') this.left = att.left;

      att.given.forEach(function (g, i) {
        if (g === null || g === undefined || g === '' || i >= self.Q.length) return;
        self.given[i] = g;
        if (self.Q[i].type === 'open') {
          var inp = document.getElementById('in' + i);
          if (inp) inp.value = g;
        } else {
          var opt = document.getElementById('o' + i + '_' + g);
          if (opt) opt.classList.add('cok');
        }
      });
      this.recount();
      return;
    }

    Object.keys(rec.answers || {})
      .map(function (k) { return parseInt(k, 10); })
      .filter(function (i) { return i >= 0 && i < self.Q.length; })
      .sort(function (a, b) { return a - b; })
      .forEach(function (i) {
        var a = rec.answers[i];
        self.given[i] = a.g;
        if (self.Q[i].type === 'open') {
          var inp = document.getElementById('in' + i);
          if (inp) inp.value = a.g === null ? '' : a.g;
        }
        self.reveal(i, true);
      });

    // день был доведён до конца — сразу показываем итог, как его и оставили
    if (this.answered === this.Q.length && this.answered > 0) this.finish(false);
  };

  /* --- записываем один ответ сразу, не дожидаясь конца занятия --- */
  Quiz.prototype.noteAnswer = function (i, given, good) {
    var setId = this.cfg.setId;
    if (!setId || setId === 'errors') return;

    var rec = recFor(setId);
    rec.answers[i] = { g: given === undefined ? null : given, ok: !!good };
    rec.total = this.Q.length;
    rec.ok = 0;
    rec.no = 0;
    Object.keys(rec.answers).forEach(function (k) {
      if (rec.answers[k].ok) rec.ok++; else rec.no++;
    });
    rec.date = today();
    putRecord(setId, rec);
  };

  /* --- незаконченная попытка экзамена: ответы и остаток времени --- */
  Quiz.prototype.saveExam = function () {
    var self = this;
    if (this.cfg.mode !== 'exam' || this.finished || !this.cfg.setId) return;

    var rec = recFor(this.cfg.setId);
    rec.exam = {
      given: this.Q.map(function (q, i) {
        if (q.type !== 'open') return self.given[i];
        var inp = document.getElementById('in' + i);
        return inp ? inp.value : null;
      }),
      left: this.left,
      at: Date.now()
    };
    rec.total = this.Q.length;
    putRecord(this.cfg.setId, rec);
  };

  Quiz.prototype.bind = function () {
    var self = this;

    this.mount.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-act]');
      if (!el) return;
      var act = el.getAttribute('data-act');
      var i = parseInt(el.getAttribute('data-i'), 10);

      if (act === 'pick') {
        self.pick(i, parseInt(el.getAttribute('data-j'), 10));
      } else if (act === 'check') {
        self.checkOpen(i);
      } else if (act === 'hint') {
        var h = document.getElementById('h' + i);
        if (h) h.classList.add('vis');
        el.remove();
      }
    });

    // на экзамене счётчик «отвечено» должен реагировать и на ввод чисел
    if (this.cfg.mode === 'exam') {
      this.mount.addEventListener('input', function (ev) {
        if (!ev.target.closest('.open-in')) return;
        self.recount();
        self.saveExam();
      });
    }

    // Enter в поле открытого ответа — как нажатие «Проверить»
    this.mount.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter') return;
      var inp = ev.target.closest('.open-in');
      if (!inp) return;
      ev.preventDefault();
      var i = parseInt(inp.id.slice(2), 10);
      if (self.cfg.mode === 'practice') {
        self.checkOpen(i);
      } else {
        var next = document.getElementById('in' + (i + 1));
        if (next) next.focus();
      }
    });

    var fin = document.getElementById('finishBtn');
    if (fin) fin.addEventListener('click', function () { self.finish(false); });
  };

  /* --- выбор варианта (mcq) --- */
  Quiz.prototype.pick = function (i, j) {
    if (this.finished) return;

    if (this.cfg.mode === 'exam') {
      // в экзамене ответ можно менять и он не подсвечивается как верный/неверный
      var prev = this.given[i];
      if (prev !== null) {
        var pe = document.getElementById('o' + i + '_' + prev);
        if (pe) pe.classList.remove('cok');
      }
      // Класс done здесь не ставим: он глушит клики через
      // `.qcard.done .opt { pointer-events:none }`, а на экзамене
      // ответ должно быть можно поменять до самого конца.
      if (prev === j) {                       // повторный клик — снять ответ
        this.given[i] = null;
      } else {
        this.given[i] = j;
        document.getElementById('o' + i + '_' + j).classList.add('cok');
      }
      this.recount();
      this.saveExam();
      return;
    }

    // тренировочный режим: сразу показываем правду
    if (this.checked[i]) return;
    this.given[i] = j;
    this.reveal(i);
  };

  /* --- проверка открытого ответа --- */
  Quiz.prototype.checkOpen = function (i) {
    if (this.finished || this.checked[i]) return;
    var inp = document.getElementById('in' + i);
    if (!inp) return;
    if (parseNum(inp.value) === null) {
      inp.focus();
      return;                                  // пустое или не число — не засчитываем
    }
    this.given[i] = inp.value;
    this.reveal(i);
  };

  /* --- показать правильный ответ по одной задаче --- */
  Quiz.prototype.reveal = function (i, restoring) {
    if (this.checked[i]) return;
    var q = this.Q[i];
    var card = document.getElementById('c' + i);
    var good = isCorrect(q, this.given[i]);

    this.checked[i] = true;
    card.classList.add('done', good ? 'ok' : 'no');

    if (q.type === 'open') {
      var inp = document.getElementById('in' + i);
      if (inp) {
        inp.classList.add(good ? 'cok' : 'cno');
        inp.readOnly = true;
      }
      var btn = card.querySelector('[data-act="check"]');
      if (btn) btn.remove();
      if (!good) {
        var e = document.getElementById('e' + i);
        e.innerHTML = '<b>Правильный ответ: ' + q.ans + '.</b> ' + e.innerHTML;
      }
    } else {
      var chosen = document.getElementById('o' + i + '_' + this.given[i]);
      if (chosen) chosen.classList.add(good ? 'cok' : 'cno');
      if (!good) {
        var right = document.getElementById('o' + i + '_' + q.ans);
        if (right) right.classList.add('cok');
      }
    }

    var hintBtn = card.querySelector('[data-act="hint"]');
    if (hintBtn) hintBtn.remove();

    if (good) {
      this.ok++;
      if (this.cfg.setId === 'errors' && q.key) forgetError(q.key);
    } else {
      this.no++;
      if (!restoring) rememberError(this.cfg.setId, i, q);
    }
    this.answered++;
    if (!restoring) this.noteAnswer(i, this.given[i], good);
    this.updateHeader();
    if (this.stepOn) this.showStep();

    if (!restoring && this.answered === this.Q.length) this.finish(false);
  };

  /* --- пересчёт заполненности в экзамене --- */
  Quiz.prototype.recount = function () {
    var filled = 0;
    for (var i = 0; i < this.Q.length; i++) {
      if (this.Q[i].type === 'open') {
        var inp = document.getElementById('in' + i);
        if (inp && parseNum(inp.value) !== null) filled++;
      } else if (this.given[i] !== null) {
        filled++;
      }
    }
    this.answered = filled;
    this.updateHeader();
    if (this.stepOn) this.showStep();
  };

  Quiz.prototype.updateHeader = function () {
    var pf = document.getElementById('pf');
    if (pf) pf.style.width = (this.answered / this.Q.length * 100) + '%';

    var cO = document.getElementById('cO');
    var cN = document.getElementById('cN');
    var cP = document.getElementById('cP');

    if (this.cfg.mode === 'exam') {
      if (cO) cO.textContent = 'Отвечено: ' + this.answered + ' из ' + this.Q.length;
      if (cN) cN.textContent = 'Пропущено: ' + (this.Q.length - this.answered);
      if (cP) cP.textContent = '';
    } else {
      if (cO) cO.textContent = this.ok + ' верно';
      if (cN) cN.textContent = this.no + ' неверно';
      if (cP) cP.textContent = 'Решено: ' + this.answered + ' из ' + this.Q.length;
    }
  };

  /* --- завершение --- */
  Quiz.prototype.finish = function (byTimer) {
    if (this.finished) return;
    this.finished = true;

    var i, q, good;

    // в экзамене снимаем показания полей и раскрываем всё разом
    if (this.cfg.mode === 'exam') {
      this.ok = 0; this.no = 0;
      var blank = 0, aOk = 0, aNo = 0, bOk = 0, bNo = 0, results = [];

      for (i = 0; i < this.Q.length; i++) {
        q = this.Q[i];
        if (q.type === 'open') {
          var inp = document.getElementById('in' + i);
          this.given[i] = inp ? inp.value : null;
          if (inp) inp.readOnly = true;
        }
        var empty = (q.type === 'open')
          ? parseNum(this.given[i]) === null
          : this.given[i] === null;

        good = !empty && isCorrect(q, this.given[i]);
        var card = document.getElementById('c' + i);
        card.classList.add('done', good ? 'ok' : 'no');

        if (q.type === 'open') {
          var el = document.getElementById('in' + i);
          if (el) el.classList.add(good ? 'cok' : 'cno');
          if (!good) {
            var ex = document.getElementById('e' + i);
            ex.innerHTML = '<b>Правильный ответ: ' + q.ans + '.</b> ' + ex.innerHTML;
          }
        } else {
          if (this.given[i] !== null) {
            var ch = document.getElementById('o' + i + '_' + this.given[i]);
            if (ch) { ch.classList.remove('cok'); ch.classList.add(good ? 'cok' : 'cno'); }
          }
          if (!good) {
            var rt = document.getElementById('o' + i + '_' + q.ans);
            if (rt) rt.classList.add('cok');
          }
        }

        results.push({ g: this.given[i], ok: !empty && good });

        if (empty) {
          blank++;
        } else if (good) {
          this.ok++;
          if (i < this.rules.split) aOk++; else bOk++;
        } else {
          this.no++;
          if (i < this.rules.split) aNo++; else bNo++;
          rememberError(this.cfg.setId, i, q);
        }
      }

      // Счёт по правилам набора (по умолчанию — SASMO, см. SASMO_RULES)
      var R = this.rules;
      var score = R.start + (aOk * R.a.ok + aNo * R.a.no) + (bOk * R.b.ok + bNo * R.b.no);
      // сохраняем раньше отрисовки: результат важнее анимации
      this.storeDone(score, results);
      this.showExamResult(score, aOk, aNo, bOk, bNo, blank, byTimer);
      return;
    }

    // тренировочный режим: раскрываем всё, что осталось не отвеченным
    for (i = 0; i < this.Q.length; i++) {
      if (!this.checked[i]) {
        q = this.Q[i];
        var c = document.getElementById('c' + i);
        c.classList.add('done', 'no');
        if (q.type === 'open') {
          var oi = document.getElementById('in' + i);
          if (oi) { oi.readOnly = true; oi.classList.add('cno'); }
          var b = c.querySelector('[data-act="check"]');
          if (b) b.remove();
          var e2 = document.getElementById('e' + i);
          e2.innerHTML = '<b>Правильный ответ: ' + q.ans + '.</b> ' + e2.innerHTML;
        } else {
          var r2 = document.getElementById('o' + i + '_' + q.ans);
          if (r2) r2.classList.add('cok');
        }
        var hb = c.querySelector('[data-act="hint"]');
        if (hb) hb.remove();
        this.no++;
        rememberError(this.cfg.setId, i, q);
      }
    }
    this.answered = this.Q.length;
    this.updateHeader();
    this.storeDone();
    this.showPracticeResult();
  };

  /* Набор доведён до конца. Ответы по задачам остаются в записи: открыв день
     заново, ребёнок увидит его ровно таким, каким оставил. */
  Quiz.prototype.storeDone = function (score, results) {
    var self = this;
    var setId = this.cfg.setId;
    if (!setId || setId === 'errors') return;

    var rec = recFor(setId);
    rec.done = true;
    rec.ok = this.ok;
    rec.no = this.no;
    rec.total = this.Q.length;
    rec.date = today();
    if (typeof score === 'number') rec.score = score;
    delete rec.exam;                       // попытка доведена до конца, продолжать нечего

    this.Q.forEach(function (q, i) {
      if (results) {
        rec.answers[i] = { g: results[i].g === undefined ? null : results[i].g, ok: results[i].ok };
      } else if (!rec.answers[i]) {
        // задачи, до которых ребёнок не дошёл, тоже фиксируем — как неверные
        rec.answers[i] = { g: self.given[i] === undefined ? null : self.given[i], ok: false };
      }
    });
    putRecord(setId, rec);
  };

  Quiz.prototype.showPracticeResult = function () {
    var pct = Math.round(this.ok / this.Q.length * 100);
    var grade = pct >= 90 ? '🌟 Отлично!'
              : pct >= 70 ? '👍 Хорошо!'
              : pct >= 50 ? '💬 Неплохо, разбери ошибки.'
              : '💪 Тема ещё не села — вернись к ней завтра.';

    document.getElementById('fs').textContent = this.ok + ' / ' + this.Q.length;
    document.getElementById('fd').innerHTML = grade + '<br>Верных: ' + this.ok + ' · Неверных: ' + this.no;
    document.getElementById('bd').innerHTML = this.no > 0
      ? '<div class="breakdown">Ошибки записаны в журнал. Разбери их сейчас, ' +
        'а через пару дней прорешай заново на странице «Работа над ошибками».</div>'
      : '';
    document.getElementById('resActions').innerHTML =
      '<a class="btn" href="' + HUB_HREF + '">← К плану</a>' +
      (this.no > 0 ? '<a class="btn sec" href="' + ERRORS_HREF + '">Журнал ошибок</a>' : '');
    this.showPanel();
  };

  Quiz.prototype.showExamResult = function (score, aOk, aNo, bOk, bNo, blank, byTimer) {
    var R = this.rules;

    // Пороги приблизительные: награды раздают по процентилям,
    // и реальные границы меняются от года к году.
    var grade = '💪 Продолжаем работать';
    for (var t = 0; t < R.tiers.length; t++) {
      if (score >= R.tiers[t][0]) { grade = R.tiers[t][1]; break; }
    }

    /* «+2» и «−1» — как правила выглядят в подписи к секции.
       Минус берём типографский, а не дефис: так он написан и в правилах. */
    function sign(n) { return n < 0 ? '−' + (-n) : '+' + n; }

    function line(name, ok, no, rule) {
      return '<div>' + name + ': ' + ok + ' верно (' + sign(ok * rule.ok) + ')' +
             (rule.no ? ', ' + no + ' неверно (' + sign(no * rule.no) + ')'
                      : ', ' + no + ' неверно (0)') +
             ' → <b>' + (ok * rule.ok + no * rule.no) + '</b></div>';
    }

    var bTotal = this.Q.length - R.split;
    var bBlank = bTotal - bOk - bNo;

    document.getElementById('fs').textContent = score + ' / ' + R.max;
    document.getElementById('fd').innerHTML =
      grade + ' <small>(ориентир — пороги зависят от года)</small><br>' +
      (byTimer ? '<b>Время вышло.</b> ' : '') +
      'Верных: ' + this.ok + ' · Неверных: ' + this.no + ' · Пропущено: ' + blank;

    document.getElementById('bd').innerHTML =
      '<div class="breakdown">' +
        (R.start ? '<div>Стартовые баллы: <b>+' + R.start + '</b></div>' : '') +
        line(R.aName || 'Секция A', aOk, aNo, R.a) +
        line(R.bName || 'Секция B', bOk, bNo, R.b) +
        '<div style="border-top:1px solid #ccc;margin-top:.35rem;padding-top:.35rem">' +
             'Итого: <b>' + score + '</b> из ' + R.max + '</div>' +
        (bBlank > 0 && R.b.no === 0
          ? '<div style="color:#b9770e;margin-top:.35rem">⚠️ В открытых задачах ' +
            (bBlank === 1 ? 'осталась <b>1</b> пустая'
                          : 'осталось <b>' + bBlank + '</b> пустых') +
            '. За неверный ответ там не снимают — пиши число всегда.</div>'
          : '') +
      '</div>';

    document.getElementById('resActions').innerHTML =
      '<a class="btn" href="' + HUB_HREF + '">← К плану</a>' +
      '<a class="btn sec" href="' + ERRORS_HREF + '">Разобрать ошибки</a>';
    this.showPanel();
  };

  Quiz.prototype.showPanel = function () {
    // Разбор смотрят целиком: и свои ответы, и объяснения ко всем задачам.
    // Поэтому итог выключает постраничный режим, не трогая выбор ребёнка.
    if (this.stepOn) this.setStepMode(false);
    if (this.nav) this.nav.classList.remove('vis');
    document.body.classList.remove('has-stepnav');

    var p = document.getElementById('res');
    p.classList.add('vis');
    var fin = document.getElementById('finishBtn');
    if (fin) fin.remove();
    if (typeof p.scrollIntoView === 'function') p.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- таймер ---------- */

  function startTimer(quiz, minutes, elId, onEnd) {
    var el = document.getElementById(elId);
    if (!el) return null;
    // остаток мог прийти из незаконченной попытки — тогда продолжаем с него
    if (typeof quiz.left !== 'number' || quiz.left <= 0) quiz.left = minutes * 60;

    function tick() {
      var m = Math.floor(quiz.left / 60);
      var s = quiz.left % 60;
      el.textContent = '⏱ ' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      el.classList.toggle('warn', quiz.left <= 15 * 60 && quiz.left > 5 * 60);
      el.classList.toggle('crit', quiz.left <= 5 * 60);
      if (quiz.left <= 0) {
        clearInterval(id);
        onEnd();
        return;
      }
      quiz.left--;
      // раз в четверть минуты кладём остаток в память: вкладку могут закрыть
      if (quiz.left % 15 === 0) quiz.saveExam();
    }

    tick();
    var id = setInterval(tick, 1000);
    return id;
  }

  /* ---------- публичный вход ---------- */

  function run(cfg) {
    var quiz = new Quiz(cfg);
    quiz.render();

    if (cfg.mode === 'exam') {
      // вкладку закрывают, а на планшете чаще сворачивают — и там и там сохраняем
      window.addEventListener('beforeunload', function () { quiz.saveExam(); });
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') quiz.saveExam();
      });
      if (cfg.minutes) {
        quiz.timerId = startTimer(quiz, cfg.minutes, 'timer', function () { quiz.finish(true); });
      }
      quiz.saveExam();      // после таймера: в записи уже есть остаток времени
    }
    return quiz;
  }

  return {
    run: run,
    usePlan: usePlan,
    storageWorks: storageWorks,
    getProgress: getProgress,
    saveProgress: saveProgress,
    getErrors: getErrors,
    saveErrors: saveErrors,
    forgetError: forgetError,
    parseNum: parseNum,
    getRecord: getRecord,
    answeredCount: answeredCount,
    startedCount: startedCount,
    resetDay: resetDay,
    armReset: armReset,
    mmss: mmss
  };
})();
