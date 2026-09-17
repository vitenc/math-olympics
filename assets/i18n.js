/* ==========================================================================
   Язык интерфейса, бренд и демо-режим

   Русский текст остаётся в разметке и в коде как был — он же служит ключом.
   Английский лежит здесь одним словарём: I18N.t('Проверить') вернёт 'Check',
   когда выбран английский, и 'Проверить' во всех остальных случаях. Строки
   с подстановками пишутся с фигурными скобками: t('Решено: {a} из {n}', {a, n}).

   Длинные куски разметки (плашки хаба) переводятся по ключу:
   элемент с data-i18n="tactics" получает BLOCKS.tactics.

   Контент задач переводится в самих наборах: у задачи, у плашки дня и у дня
   в плане может быть поле `en` с теми же полями на английском. Чего в `en`
   нет — показывается по-русски. I18N.pick(obj, 'title') и I18N.localize(q)
   выбирают нужное.

   Язык выбирается ссылкой ?lang=en и запоминается; переключатель RU / EN
   вставляется в шапку каждой страницы сам.

   Демо-режим (?demo=1) переводит хранилище на отдельные ключи, чтобы образец
   прогресса для показа не трогал настоящие результаты ребёнка. Выход — ?demo=0.
   ========================================================================== */

/* Рабочее название. Поменять — здесь и только здесь. */
window.BRAND = { name: 'Olympiad Sprint', parts: ['Olympiad', 'Sprint'] };

window.I18N = (function () {
  'use strict';

  var LANG_KEY = 'sasmo.lang';
  var DEMO_KEY = 'sasmo.demo';

  var params = new URLSearchParams(location.search);

  /* ---- язык ---- */
  var lang = 'ru';
  var asked = params.get('lang');
  if (asked === 'en' || asked === 'ru') {
    lang = asked;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* пусто */ }
  } else {
    try { if (localStorage.getItem(LANG_KEY) === 'en') lang = 'en'; } catch (e) { /* пусто */ }
  }

  /* ---- демо ---- */
  var demoAsked = params.get('demo');
  if (demoAsked === '1') {
    try { localStorage.setItem(DEMO_KEY, '1'); } catch (e) { /* пусто */ }
  } else if (demoAsked === '0') {
    try { localStorage.removeItem(DEMO_KEY); } catch (e) { /* пусто */ }
  }

  function isDemo() {
    try { return localStorage.getItem(DEMO_KEY) === '1'; } catch (e) { return false; }
  }

  document.documentElement.lang = lang;
  if (lang === 'en') document.documentElement.classList.add('lang-en');

  /* ---- словарь коротких строк: русский → английский ---- */
  var EN = {
    /* движок */
    'Нажми ещё раз': 'Tap again',
    'ответ': 'answer',
    'пустых ответов быть не должно': 'never leave a blank',
    'Проверить': 'Check',
    '💡 Подсказка': '💡 Hint',
    'Задача {n}': 'Problem {n}',
    'Секция A': 'Section A',
    'Секция B': 'Section B',
    'СЕКЦИЯ A · задачи 1–15 · выбор ответа': 'SECTION A · problems 1–15 · multiple choice',
    '+2 за верный · −1 за неверный · 0 за пропуск. Не смог вычеркнуть хотя бы два варианта — пропускай.':
      '+2 correct · −1 wrong · 0 blank. Cannot rule out at least two options? Skip it.',
    'СЕКЦИЯ B · задачи 16–25 · открытый ответ': 'SECTION B · problems 16–25 · open answer',
    '+4 за верный · 0 за неверный. За ошибку не снимают — пиши число даже когда не уверен.':
      '+4 correct · 0 wrong. No penalty here: always write a number, even a rough guess.',
    '🥇 Уровень золота': '🥇 Gold level',
    '🥈 Уровень серебра': '🥈 Silver level',
    '🥉 Уровень бронзы': '🥉 Bronze level',
    '🎖 Уровень похвального отзыва': '🎖 Honourable mention level',
    '🏁 Завершить экзамен': '🏁 Finish the exam',
    '✅ Показать итог': '✅ Show results',
    '🏆 Результат': '🏆 Result',
    'По одной': 'One at a time',
    'Списком': 'As a list',
    'Предыдущая задача': 'Previous problem',
    'Следующая задача': 'Next problem',
    'Все задачи': 'All problems',
    'Закрыть': 'Close',
    'Без ответа: <b>{n}</b>': 'Unanswered: <b>{n}</b>',
    'Отвечено всё': 'All answered',
    'Завершить': 'Finish',
    'Показать итог': 'Show results',
    'Правильный ответ: {a}.': 'Correct answer: {a}.',
    'Отвечено: {a} из {n}': 'Answered: {a} of {n}',
    'Пропущено: {n}': 'Skipped: {n}',
    '{n} верно': '{n} correct',
    '{n} неверно': '{n} wrong',
    'Решено: {a} из {n}': 'Solved: {a} of {n}',
    '🌟 Отлично!': '🌟 Excellent!',
    '👍 Хорошо!': '👍 Good!',
    '💬 Неплохо, разбери ошибки.': '💬 Not bad. Go through the mistakes.',
    '💪 Тема ещё не села — вернись к ней завтра.': '💪 Not settled yet. Come back to this topic tomorrow.',
    'Верных: {a} · Неверных: {b}': 'Correct: {a} · Wrong: {b}',
    'Ошибки записаны в журнал. Разбери их сейчас, а через пару дней прорешай заново на странице «Работа над ошибками».':
      'Mistakes are saved to the journal. Go through them now, then solve them again in a couple of days on the Error journal page.',
    '← К плану': '← Back to the plan',
    'Журнал ошибок': 'Error journal',
    'Разобрать ошибки': 'Review mistakes',
    '💪 Продолжаем работать': '💪 Keep going',
    '{name}: {ok} верно ({sok}), {no} неверно ({sno}) → <b>{sum}</b>':
      '{name}: {ok} correct ({sok}), {no} wrong ({sno}) → <b>{sum}</b>',
    '(ориентир — пороги зависят от года)': '(a guide only: thresholds change every year)',
    '<b>Время вышло.</b> ': '<b>Time is up.</b> ',
    'Верных: {a} · Неверных: {b} · Пропущено: {c}': 'Correct: {a} · Wrong: {b} · Blank: {c}',
    'Стартовые баллы: <b>+{n}</b>': 'Starting points: <b>+{n}</b>',
    'Итого: <b>{s}</b> из {m}': 'Total: <b>{s}</b> of {m}',
    '⚠️ В открытых задачах осталась <b>1</b> пустая. За неверный ответ там не снимают — пиши число всегда.':
      '⚠️ One open-answer problem was left blank. There is no penalty there: always write a number.',
    '⚠️ В открытых задачах осталось <b>{n}</b> пустых. За неверный ответ там не снимают — пиши число всегда.':
      '⚠️ {n} open-answer problems were left blank. There is no penalty there: always write a number.',

    /* хаб */
    'План на 28 дней': '28-day plan',
    '2 класс': 'Grade 2',
    '3 класс': 'Grade 3',
    '{n} дней пройдено': '{n} days done',
    'осталось {n}': '{n} left',
    'дней пройдено': 'days done',
    'лучший экзамен': 'best mock exam',
    'задач в журнале ошибок': 'problems in the error journal',
    '📓 Работа над ошибками': '📓 Error journal',
    '⚡ Таблица умножения на скорость': '⚡ Times-table speed drill',
    '🏅 MathXCEL 2024 — Дима': '🏅 MathXCEL 2024 · paper 1 (RU)',
    '🏅 MathXCEL 2024 — Богдан': '🏅 MathXCEL 2024 · paper 2 (RU)',
    '🧮 Тест Коперника (архив)': '🧮 Copernicus test (RU, archive)',
    'Сбросить весь прогресс': 'Reset all progress',
    'Точно сбросить? Нажми ещё раз': 'Really reset? Tap again',
    'Экзамен · день {d}': 'Exam · day {d}',
    'Разбор · день {d}': 'Review · day {d}',
    'День {d}': 'Day {d}',
    'начато: {a} из {n}': 'started: {a} of {n}',
    'стереть?': 'erase?',
    'Сбросить этот день': 'Reset this day',
    'Сбросить прогресс дня {d}': 'Reset progress for day {d}',
    'задачи готовятся': 'problems coming soon',
    'Прогресс не будет сохраняться': 'Progress will not be saved',
    'Браузер не разрешает этой странице хранить данные — так бывает в режиме инкогнито или при запрете данных сайтов. Задачи решать можно, но галочки и журнал ошибок пропадут после закрытия вкладки.':
      'The browser does not let this page store data. That happens in private mode or when site data is blocked. You can still solve problems, but ticks and the error journal will vanish when the tab closes.',
    'Grade 3 • подготовка за месяц': 'Grade 3 • one month to the olympiad',
    'Grade 2 • подготовка за месяц': 'Grade 2 • one month to the olympiad',
    '{brand} {label} — подготовка за месяц': '{brand} {label} — one month to the olympiad',

    /* день */
    'занятие': 'lesson',
    'Загружаем задачи…': 'Loading problems…',
    '← весь план': '← whole plan',
    'Такого занятия нет.': 'There is no such lesson.',
    'Вернуться к плану': 'Back to the plan',
    'К плану': 'To the plan',
    '{label} · день {d} из 28': '{label} · day {d} of 28',
    'День {d} — {title}': 'Day {d} — {title}',
    'Не удалось загрузить <code>{file}</code>.<br>Похоже, задачи для этого дня ещё не готовы.':
      'Could not load <code>{file}</code>.<br>Looks like this day\'s problems are not ready yet.',
    'День уже пройден: <b>{ok} из {n}</b>{date}. Ответы ниже — те же, что и в тот раз.':
      'Day already completed: <b>{ok} of {n}</b>{date}. The answers below are the ones given that time.',
    'Пройти день заново': 'Do the day again',
    'Продолжаем с того места: решено <b>{a} из {n}</b>. Решай оставшиеся — всё, что уже сделано, сохранено.':
      'Picking up where you left off: <b>{a} of {n}</b> solved. Do the rest; everything done so far is saved.',
    'Начать день заново': 'Restart the day',
    'Нажми ещё раз — прогресс дня сотрётся': 'Tap again to erase this day\'s progress',

    /* экзамен */
    'пробный экзамен': 'mock exam',
    'Пробный экзамен': 'Mock exam',
    'Такого экзамена нет.': 'There is no such exam.',
    '{title} — {brand}': '{title} — {brand}',
    'Не удалось загрузить <code>{file}</code>.<br>Похоже, этот экзамен ещё не готов.':
      'Could not load <code>{file}</code>.<br>Looks like this exam is not ready yet.',
    'Экзамен уже сдан: <b>{s} из 85</b>{date}. Можно пройти его ещё раз — прошлый результат перезапишется.':
      'Exam already taken: <b>{s} of 85</b>{date}. You can take it again; the previous result will be overwritten.',
    'Прошлая попытка не закончена: отвечено <b>{a} из 25</b>, на часах осталось <b>{t}</b>.':
      'Last attempt is unfinished: <b>{a} of 25</b> answered, <b>{t}</b> left on the clock.',
    'Стереть попытку': 'Erase the attempt',
    'Нажми ещё раз — попытка сотрётся': 'Tap again to erase the attempt',
    '▶ Начать экзамен (90 минут)': '▶ Start the exam (90 minutes)',
    '▶ Продолжить экзамен (осталось {t})': '▶ Continue the exam ({t} left)',

    /* журнал ошибок */
    'журнал ошибок': 'error journal',
    'Работа над ошибками': 'Error journal',
    '← к работе': '← back to the paper',
    'К работе': 'To the paper',
    'журнал ошибок · {name}': 'error journal · {name}',
    'Работа над ошибками — {name}': 'Error journal — {name}',
    'Журнал пуст — ошибок пока нет.<br>Он заполнится сам, когда ребёнок ошибётся в задаче.':
      'The journal is empty: no mistakes yet.<br>It fills up by itself when a problem is answered wrongly.',
    'Прочее': 'Other',
    'В журнале {n} задач(и)': '{n} problem(s) in the journal',
    'Решённая заново задача уходит из журнала. Ошибка остаётся — значит, тему надо разобрать ещё раз.':
      'A problem solved again leaves the journal. If the mistake stays, the topic needs another look.',
    '<b>Самая слабая тема сверху.</b> Именно ей стоит отдать ближайшие 10 минут занятия.':
      '<b>The weakest topic is on top.</b> Give it the next 10 minutes of the lesson.',

    /* таблица умножения */
    'Grade 2 &bull; тренажёр': 'Grade 2 &bull; drill',
    'Таблица умножения на скорость': 'Times-table speed drill',
    'Таблица умножения на скорость — Grade 2': 'Times-table speed drill — Grade 2',
    'Статистика не будет сохраняться': 'Statistics will not be saved',
    'Браузер не разрешает этой странице хранить данные — так бывает в режиме инкогнито. Тренироваться можно, но карта таблицы пропадёт после закрытия вкладки.':
      'The browser does not let this page store data, which happens in private mode. You can still drill, but the table map will vanish when the tab closes.',
    'спокойно': 'calm',
    'быстро': 'fast',
    'молния': 'lightning',
    'выбери столбики и время': 'choose tables and time',
    '{s} с <small>{name}</small>': '{s} s <small>{name}</small>',
    'Вспоминать, а не считать': 'Recall, not count',
    'Пример и четыре ответа. На каждый пример — несколько секунд: этого хватает, чтобы <b>вспомнить</b>, но мало, чтобы досчитать сложением «7, 14, 21…». Не успел — считается ошибкой, и правильный ответ сразу показывается.':
      'One fact, four answers. A few seconds per fact: enough to <b>recall</b> it, not enough to count up "7, 14, 21…". Too slow counts as a mistake, and the right answer shows at once.',
    'Много «не успел» — лучше убрать часть столбиков, чем добавлять секунды: так ребёнок учит примеры наизусть, а не тренирует счёт.':
      'Lots of "too slow"? Drop some tables rather than adding seconds: that way the child memorises facts instead of practising counting.',
    'Столбики': 'Tables',
    'все': 'all',
    'Время на пример': 'Time per fact',
    'Примеров в раунде': 'Facts per round',
    'Поехали!': 'Go!',
    'на компьютере отвечать можно клавишами 1–4': 'on a computer you can answer with keys 1–4',
    'Карта таблицы': 'Table map',
    'Выучено <b>{good}</b> из {all} примеров': '<b>{good}</b> of {all} facts learned',
    ' · ошибается в <b>{bad}</b>': ' · mistakes in <b>{bad}</b>',
    'выучен — дважды подряд быстрее 3 с': 'learned: twice in a row under 3 s',
    'знает, но вспоминает долго': 'knows it, but recall is slow',
    'недавно ошибся или не успел': 'recent mistake or too slow',
    'ещё не встречался': 'not seen yet',
    '{date} · <b>{ok} из {n}</b> за {limit} с': '{date} · <b>{ok} of {n}</b> at {limit} s',
    ' · в среднем {avg} с': ' · average {avg} s',
    ' · трудные': ' · hard ones',
    'Последние раунды': 'Recent rounds',
    'Стереть статистику таблицы': 'Erase table statistics',
    'Точно стереть? Нажми ещё раз': 'Really erase? Tap again',
    'Закончить раунд': 'End the round',
    'ошибка': 'mistake', 'ошибки': 'mistakes', 'ошибок': 'mistakes',
    '{n} из {m}': '{n} of {m}',
    '{n} с': '{n} s',
    '⚡ Верно!': '⚡ Correct!',
    '✓ Верно': '✓ Correct',
    '⏱ Время вышло: ': '⏱ Time is up: ',
    'Отлично!': 'Excellent!',
    'Хорошо!': 'Good!',
    'Есть над чем поработать': 'Room to improve',
    'Ошибся или не успел': 'Wrong or too slow',
    'Верно, но дольше 3 секунд': 'Correct, but slower than 3 seconds',
    'Проговорите эти примеры вслух пару раз и прорешайте их отдельно. В следующих раундах они будут попадаться чаще.':
      'Say these facts aloud a couple of times and drill them separately. They will come up more often in the next rounds.',
    'верных ответов · по <b>{limit} с</b> на пример': 'correct answers · <b>{limit} s</b> per fact',
    '⚡ быстро, до 3 с: <b>{n}</b>': '⚡ fast, under 3 s: <b>{n}</b>',
    '🐢 верно, но дольше 3 с: <b>{n}</b>': '🐢 correct, but over 3 s: <b>{n}</b>',
    '✗ неверно: <b>{n}</b>': '✗ wrong: <b>{n}</b>',
    '⏱ не успел: <b>{n}</b>': '⏱ too slow: <b>{n}</b>',
    'среднее время верного ответа: <b>{avg} с</b>': 'average time per correct answer: <b>{avg} s</b>',
    'Прорешать трудные ({n})': 'Drill the hard ones ({n})',
    'Прорешать медленные ({n})': 'Drill the slow ones ({n})',
    'Новый раунд': 'New round',
    'Настройки и карта таблицы': 'Settings and table map',
    'раунд окончен': 'round over',

    /* демо */
    'Демо-режим: показан образец прогресса, настоящие результаты не затронуты.':
      'Demo mode: sample progress is shown, real results are untouched.',
    'Выйти из демо': 'Exit demo'
  };

  /* ---- длинные плашки хаба: по ключу ---- */
  var BLOCKS = {
    motto:
      '<em>“Hard work beats talent when talent doesn’t work hard.”</em>' +
      '<strong>25 problems · 90 minutes · no calculator</strong>',

    tactics:
      '<h3>Two tactics worth more points than one extra topic</h3>' +
      '<ul>' +
        '<li><b>Section A (problems 1–15).</b> A wrong answer costs 1 point, a blank costs nothing. ' +
            'Guessing among four options is worth <b>minus a quarter of a point</b> on average. ' +
            'Rule: <i>cannot rule out at least two options? Skip it.</i></li>' +
        '<li><b>Section B (problems 16–25).</b> No penalty for a wrong answer. ' +
            'Rule: <i>never leave a blank</i>. Always write a number, even a rough estimate.</li>' +
        '<li><b>Time.</b> 90 minutes for 25 problems is about 3.5 minutes each. Two passes: ' +
            'first collect every problem you can do at once, then return to the hard ones.</li>' +
      '</ul>',

    lesson:
      '<h3>What one lesson looks like (about 50 minutes)</h3>' +
      '<ul>' +
        '<li><b>5 min — warm-up.</b> 20 timed mental-arithmetic drills.</li>' +
        '<li><b>10 min — technique of the day.</b> Two model problems, worked together.</li>' +
        '<li><b>25 min — practice.</b> Problems in rising difficulty; a hint only after an honest attempt.</li>' +
        '<li><b>10 min — mistakes.</b> Go through the wrong ones; they are saved to the journal ' +
            'and come back in a couple of days.</li>' +
      '</ul>',

    hintline:
      'A single day can be reset right on its card: the circled arrow in the corner. ' +
      'It clears the day\'s result and removes its problems from the error journal.',

    examgate:
      '<h3>Read the rules together, then press “Start”</h3>' +
      '<ul>' +
        '<li><b>25 problems, 90 minutes, no calculator.</b> Rough work on plain paper.</li>' +
        '<li><b>Section A, problems 1–15.</b> Four options. +2 for correct, <b>−1</b> for wrong, ' +
            '0 for blank. Guessing does not pay: skip unless you can rule out at least two options.</li>' +
        '<li><b>Section B, problems 16–25.</b> The answer is a number. +4 for correct, 0 for wrong. ' +
            '<b>No blanks</b>: write at least an estimate.</li>' +
        '<li><b>Start: 15 points.</b> Maximum: 85.</li>' +
        '<li><b>Two passes.</b> First 45 minutes: collect every problem that solves at once. ' +
            'Remaining time: return to the hard ones.</li>' +
        '<li>Answers are hidden until the end, exactly like the real exam.</li>' +
      '</ul>'
  };

  /* ---- подстановки ---- */
  function fmt(s, vars) {
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : m;
    });
  }

  function t(ru, vars) {
    var s = (lang === 'en' && Object.prototype.hasOwnProperty.call(EN, ru)) ? EN[ru] : ru;
    return fmt(s, vars);
  }

  /* Поле объекта на текущем языке: obj.en.field, если оно есть. */
  function pick(obj, field) {
    if (!obj) return '';
    if (lang === 'en' && obj.en && obj.en[field] !== undefined) return obj.en[field];
    return obj[field];
  }

  /* Задача с подставленными английскими полями. Исходный объект не трогаем:
     в журнал ошибок и в прогресс должна попадать задача как она есть. */
  function localize(q) {
    if (lang !== 'en' || !q || !q.en) return q;
    var c = {}, k;
    for (k in q) if (Object.prototype.hasOwnProperty.call(q, k)) c[k] = q[k];
    for (k in q.en) if (Object.prototype.hasOwnProperty.call(q.en, k)) c[k] = q.en[k];
    return c;
  }

  /* Перевести разметку: элементы с data-i18n. Ключ — либо имя блока,
     либо сама русская строка. */
  function apply(root) {
    if (lang !== 'en') return;
    root = root || document;
    var els = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute('data-i18n');
      if (BLOCKS[k] !== undefined) els[i].innerHTML = BLOCKS[k];
      else if (EN[k] !== undefined) els[i].innerHTML = EN[k];
    }
  }

  /* Текущий адрес с изменённым параметром. */
  function link(name, value) {
    var p = new URLSearchParams(location.search);
    ['lang', 'demo'].forEach(function (k) { p.delete(k); });
    if (value !== null && value !== undefined) p.set(name, value);
    var qs = p.toString();
    return location.pathname.split('/').pop() + (qs ? '?' + qs : '');
  }

  /* ---- шапка: бренд, переключатель языка, плашка демо ---- */
  function mountBrand() {
    var logos = document.querySelectorAll('.logo.brand');
    for (var i = 0; i < logos.length; i++) {
      logos[i].innerHTML = '<span class="b1">' + BRAND.parts[0] + '</span>' +
                           '<span class="b2">' + BRAND.parts[1] + '</span>';
    }
  }

  function mountSwitch() {
    var header = document.querySelector('.header');
    if (!header || header.querySelector('.langsw')) return;
    var sw = document.createElement('div');
    sw.className = 'langsw';
    sw.setAttribute('aria-label', 'Language');
    sw.innerHTML =
      '<a href="' + link('lang', 'ru') + '" class="' + (lang === 'ru' ? 'on' : '') + '">RU</a>' +
      '<a href="' + link('lang', 'en') + '" class="' + (lang === 'en' ? 'on' : '') + '">EN</a>';
    header.appendChild(sw);
  }

  function mountDemo() {
    if (!isDemo()) return;
    var bar = document.createElement('div');
    bar.className = 'demobar';
    bar.innerHTML = t('Демо-режим: показан образец прогресса, настоящие результаты не затронуты.') +
                    ' <a href="' + link('demo', '0') + '">' + t('Выйти из демо') + '</a>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* Служебные параметры из адреса убираем: они уже сделали своё дело,
     а по F5 демо-прогресс не должен засеиваться заново. */
  function cleanUrl() {
    if (!asked && !demoAsked) return;
    try { history.replaceState(null, '', link('', null)); } catch (e) { /* file:// может не дать */ }
  }

  function boot() {
    mountBrand();
    mountSwitch();
    apply(document);
    mountDemo();
    cleanUrl();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  return {
    lang: lang,
    t: t,
    pick: pick,
    localize: localize,
    apply: apply,
    link: link,
    isDemo: isDemo,
    demoRequested: demoAsked === '1'
  };
})();
