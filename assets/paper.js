/* ==========================================================================
   Отдельная работа — общая логика страницы

   Кроме программы на 28 дней в тренажёре живут целые прошлые олимпиады.
   Их решают не по дням, а целиком, и садятся за них разные дети — поэтому
   у каждого решающего своё хранилище: один не должен ни видеть, ни стереть
   результаты другого.

   Страница объявляет только, кто решает и какую работу:

     <script src="assets/paper.js"></script>
     <script>
       SASMO_PAPER.open({ who: 'dima', set: 'mathxcel24',
                          varName: 'MATHXCEL24', minutes: 80 });
     </script>

   Всё остальное — разметка шапки и правил — лежит в самой странице.
   ========================================================================== */

(function () {
  'use strict';

  /* Кто решает. Имя показывается в шапке, чтобы ребёнок не открыл чужую
     страницу; `paper` — куда возвращает журнал ошибок. */
  window.SOLVERS = {
    dima:   { name: 'Дима',   paper: 'mathxcel_dima.html' },
    bogdan: { name: 'Богдан', paper: 'mathxcel_bogdan.html' }
  };

  /* Ключи хранения свои у каждого: и прогресс, и журнал ошибок.
     Это не то же, что ключи классов в plan.js, — работа вне программы. */
  function keys(who) {
    return {
      progress: 'paper.' + who + '.progress',
      errors:   'paper.' + who + '.errors'
    };
  }

  function open(cfg) {
    var who = cfg.who;
    var solver = window.SOLVERS[who];
    if (!solver) throw new Error('Неизвестный решающий: ' + who);

    var setId = cfg.set;
    var minutes = cfg.minutes || 80;
    var box = document.getElementById('box');
    var gate = document.getElementById('gate');

    /* Журнал ошибок этой работы — свой, и ссылки в итоговой панели должны
       вести именно в него, а не в общий журнал программы. */
    window.SASMO.usePlan({
      keys: keys(who),
      hubHref: 'index.html',
      errorsHref: 'errors.html?who=' + who
    });

    var whoTag = document.getElementById('who');
    if (whoTag) whoTag.textContent = solver.name;

    var timer = document.getElementById('timer');
    if (timer) timer.textContent = '⏱ ' + window.SASMO.mmss(minutes * 60);

    var s = document.createElement('script');
    s.src = 'data/' + setId + '.js';

    s.onerror = function () {
      gate.innerHTML = '<div class="empty">Не удалось загрузить <code>data/' + setId + '.js</code>.' +
                       '<br><a href="index.html">К плану</a>.</div>';
    };

    s.onload = function () {
      var data = window[cfg.varName];
      if (!data || !Array.isArray(data.questions) || !data.questions.length) { s.onerror(); return; }

      var R = data.rules;
      var n = data.questions.length;

      // <title> у страницы свой и короче — «MathXCEL 2024 — Дима»; не трогаем
      document.getElementById('ttl').textContent = data.intro.title;
      document.getElementById('rules').innerHTML =
        '<div class="note warm">' + data.intro.body + '</div>';

      // Незаконченная попытка не пропадает: ответы и остаток времени сохранены.
      var rec = window.SASMO.getRecord(setId);
      var att = rec && rec.exam && Array.isArray(rec.exam.given) ? rec.exam : null;
      var left = att && typeof att.left === 'number' ? att.left : minutes * 60;

      var notes = '';
      if (rec && rec.done) {
        notes += '<div class="resume"><div>Работа уже сдана: <b>' + rec.score + ' из ' + R.max + '</b>' +
                 (rec.date ? ' · ' + rec.date : '') +
                 '. Можно пройти её ещё раз — прошлый результат перезапишется.</div></div>';
      }
      if (att) {
        notes += '<div class="resume"><div>Прошлая попытка не закончена: отвечено <b>' +
                   window.SASMO.startedCount(rec) + ' из ' + n + '</b>, на часах осталось <b>' +
                   window.SASMO.mmss(left) + '</b>.</div>' +
                   '<button class="mini" id="wipeAttempt" ' +
                     'data-armed-text="Нажми ещё раз — попытка сотрётся">Стереть попытку</button>' +
                 '</div>';
        document.getElementById('startBtn').textContent =
          '▶ Продолжить работу (осталось ' + window.SASMO.mmss(left) + ')';
      }
      document.getElementById('attempt').innerHTML = notes;

      var wipe = document.getElementById('wipeAttempt');
      if (wipe) wipe.addEventListener('click', function () {
        var btn = this;
        window.SASMO.armReset(btn, function () {
          window.SASMO.resetDay(setId);
          window.SASMO.resetDay(setId + '.free');   // и разбор без таймера — начисто так начисто
          location.reload();
        });
      });

      function start(mode) {
        gate.style.display = 'none';
        if (mode === 'exam' && timer) timer.style.display = 'inline-block';
        window.SASMO.run({
          mount: box,
          questions: data.questions,
          mode: mode,
          rules: R,
          // Разбор без таймера не должен переписывать результат настоящей попытки.
          setId: mode === 'exam' ? setId : setId + '.free',
          minutes: mode === 'exam' ? minutes : 0
        });
        window.scrollTo({ top: 0 });
      }

      document.getElementById('startBtn')
        .addEventListener('click', function () { start('exam'); });
      document.getElementById('practiceBtn')
        .addEventListener('click', function () { start('practice'); });
    };

    document.head.appendChild(s);
  }

  window.SASMO_PAPER = { open: open, keys: keys };
})();
