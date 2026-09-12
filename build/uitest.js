/* Проверка страниц тренажёра без браузера.

   Смотрим две вещи, которые ломаются молча:

     • режим «одна задача на экран» — он прячет карточки, а не меняет логику,
       и потому легко испортить соседнее: ответ перестанет записываться,
       счётчик разойдётся с картой задач, кнопка «Завершить» пропадёт;
     • раздельные страницы отдельной работы — прогресс и журнал ошибок одного
       ребёнка не должны попадать другому.

   Наборы прогоняются в jsdom целиком: и списком, и по одной, и сверяется,
   что итог в обоих видах одинаковый. Одностраничная сборка проверяется тоже:
   движок в ней свой.

   Запуск:  node build/uitest.js
   Нужен jsdom:  npm install --no-save jsdom                                  */

const fs = require('fs');
const path = require('path');

let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require('jsdom'));
} catch (e) {
  console.log('jsdom не установлен — пропускаю (npm install --no-save jsdom)');
  process.exit(0);
}

const ROOT = path.resolve(__dirname, '..');
const failures = [];

function ok(cond, what) {
  if (cond) return;
  failures.push(what);
}

/* Страница-заглушка: движку нужны только шапка со счётчиками и место под набор. */
const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body>
  <div class="header">
    <div id="timer" class="timer"></div>
    <div class="pbar"><div class="pfill" id="pf"></div></div>
    <div class="scores"><span id="cO"></span><span id="cN"></span><span id="cP"></span></div>
  </div>
  <div class="container"><div id="box"></div></div>
</body></html>`;

/* Окна приходится закрывать вручную: таймер экзамена — это setInterval,
   и с живым интервалом node не завершится сам. */
const windows = [];

function boot(width) {
  const dom = new JSDOM(PAGE, { url: 'http://localhost/day.html', pretendToBeVisual: true });
  const { window } = dom;
  windows.push(window);

  // jsdom не умеет ни matchMedia, ни плавную прокрутку — подставляем своё
  window.matchMedia = (q) => ({
    matches: /max-width:\s*760px/.test(q) ? width <= 760 : false,
    media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
  });
  window.scrollTo = () => {};

  global.window = window;
  global.document = window.document;
  global.localStorage = window.localStorage;

  for (const f of ['assets/fig.js', 'assets/plan.js', 'assets/plan2.js', 'assets/quiz.js']) {
    window.eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  }
  return window;
}

/* Один прогон набора: отвечаем на всё верно и смотрим, что получилось. */
function run({ width, view, setId, file, varName, mode, minutes }) {
  const window = boot(width);
  const doc = window.document;

  if (view) window.localStorage.setItem('sasmo.view', view);
  window.eval(fs.readFileSync(path.join(ROOT, file), 'utf8'));

  const data = window[varName];
  const quiz = window.SASMO.run({
    mount: doc.getElementById('box'),
    questions: data.questions,
    mode,
    setId,
    rules: data.rules,
    minutes: minutes || 0
  });

  return { window, doc, quiz, data };
}

function visibleCards(doc) {
  // в постраничном режиме «видна» карточка с классом cur
  return [...doc.querySelectorAll('.qcard.cur')];
}

function answerAll(window, doc, quiz) {
  quiz.Q.forEach((q, i) => {
    if (q.type === 'mcq') {
      doc.getElementById('o' + i + '_' + q.ans).click();
    } else {
      const inp = doc.getElementById('in' + i);
      inp.value = String(q.ans);
      inp.dispatchEvent(new window.Event('input', { bubbles: true }));
      const btn = doc.querySelector(`#c${i} [data-act="check"]`);
      if (btn) btn.click();
    }
  });
}

/* ------------------------------------------------- 1. телефон: по одной --- */

{
  const { window, doc, quiz } = run({
    width: 400, view: null, setId: 'day02', file: 'data/day02.js',
    varName: 'DAY02', mode: 'practice'
  });

  ok(quiz.stepOn === true, 'на узком экране режим «по одной» должен включиться сам');
  ok(doc.getElementById('box').classList.contains('stepped'), 'контейнеру нужен класс stepped');
  ok(visibleCards(doc).length === 1, `видна должна быть ровно одна задача, а их ${visibleCards(doc).length}`);
  ok(visibleCards(doc)[0].id === 'c0', 'начинать нужно с первой задачи');
  ok(doc.getElementById('stepnav').classList.contains('vis'), 'панель навигации должна быть видна');

  // листаем вперёд и назад
  doc.getElementById('stepNext').click();
  ok(visibleCards(doc)[0].id === 'c1', 'кнопка «вперёд» не перелистнула');
  ok(doc.getElementById('stepNum').textContent.indexOf('2 / 10') >= 0,
     'счётчик должен показывать «2 / 10», а показывает «' + doc.getElementById('stepNum').textContent + '»');

  doc.getElementById('stepPrev').click();
  ok(visibleCards(doc)[0].id === 'c0', 'кнопка «назад» не перелистнула');
  ok(doc.getElementById('stepPrev').disabled, 'на первой задаче «назад» должна быть погашена');

  // карта задач
  doc.getElementById('stepNum').click();
  ok(doc.getElementById('stepmap').classList.contains('vis'), 'карта задач не открылась');
  ok(doc.querySelectorAll('#stepGrid .cell').length === 10, 'в карте должно быть 10 номеров');
  doc.querySelector('[data-go="7"]').click();
  ok(!doc.getElementById('stepmap').classList.contains('vis'), 'карта должна закрыться после перехода');
  ok(visibleCards(doc)[0].id === 'c7', 'переход по карте не сработал');

  // «Завершить» прячется везде, кроме последней задачи
  const finWrap = doc.getElementById('finishBtn').parentNode;
  ok(finWrap.classList.contains('hid'), 'на 8-й из 10 кнопка «Показать итог» должна быть скрыта');
  quiz.goStep(9);
  ok(!finWrap.classList.contains('hid'), 'на последней задаче кнопка «Показать итог» должна быть видна');

  // ответы записываются так же, как в списке
  quiz.goStep(0);
  const q0 = quiz.Q[0];
  if (q0.type === 'mcq') doc.getElementById('o0_' + q0.ans).click();
  ok(quiz.checked[0] === true, 'ответ в постраничном режиме не засчитался');
  ok(quiz.stepState(0) === 'ok', 'карта задач не увидела верный ответ');
  ok(doc.getElementById('stepNext').classList.contains('ready'),
     'после разбора кнопка «вперёд» должна подсветиться');

  const saved = JSON.parse(window.localStorage.getItem('sasmo.progress') || '{}');
  ok(saved.day02 && saved.day02.answers && saved.day02.answers['0'],
     'ответ должен сохраниться в прогресс так же, как в списке');
}

/* ------------------------------------------ 2. монитор: обычный список --- */

{
  const { doc, quiz } = run({
    width: 1400, view: null, setId: 'day03', file: 'data/day03.js',
    varName: 'DAY03', mode: 'practice'
  });

  ok(quiz.stepOn === false, 'на широком экране по умолчанию должен быть список');
  ok(!doc.getElementById('box').classList.contains('stepped'), 'класса stepped быть не должно');
  ok(doc.querySelectorAll('.qcard').length === 10, 'списком должны рисоваться все задачи');
  ok(!doc.getElementById('finishBtn').parentNode.classList.contains('hid'),
     'в списке кнопка итога скрываться не должна');

  // ручное переключение сильнее умолчания
  doc.querySelector('[data-view="step"]').click();
  ok(quiz.stepOn === true, 'переключатель не включил постраничный режим');
  ok(visibleCards(doc).length === 1, 'после переключения должна остаться одна задача');
  doc.querySelector('[data-view="list"]').click();
  ok(quiz.stepOn === false, 'переключатель не вернул список');
}

/* ------------------------- 3. экзамен: счёт одинаковый в обоих режимах --- */

function examScore(width, view) {
  const { window, doc, quiz } = run({
    width, view, setId: 'mx' + width, file: 'data/mathxcel24.js',
    varName: 'MATHXCEL24', mode: 'exam', minutes: 80
  });
  answerAll(window, doc, quiz);
  doc.getElementById('finishBtn').click();
  return {
    score: doc.getElementById('fs').textContent,
    stepOn: quiz.stepOn,
    navVisible: doc.getElementById('stepnav').classList.contains('vis'),
    cards: doc.querySelectorAll('.qcard').length,
    hidden: doc.querySelectorAll('.qcard.cur').length
  };
}

{
  const list = examScore(1400, 'list');
  const step = examScore(400, 'step');

  ok(list.score === '55 / 55', `списком должно быть 55 / 55, а вышло ${list.score}`);
  ok(step.score === '55 / 55', `по одной должно быть 55 / 55, а вышло ${step.score}`);
  ok(list.score === step.score, 'счёт в двух режимах разошёлся');
  ok(step.stepOn === false, 'после итога постраничный режим должен выключиться');
  ok(step.navVisible === false, 'после итога панель навигации должна скрыться');
  ok(step.cards === 25 && step.hidden === 0, 'после итога должны быть видны все 25 задач');
}

/* ------------------------------------------- 4. секции экзамена на месте --- */

{
  const { doc, quiz } = run({
    width: 400, view: 'step', setId: 'mxsect', file: 'data/mathxcel24.js',
    varName: 'MATHXCEL24', mode: 'exam', minutes: 80
  });

  const sects = [...doc.querySelectorAll('.sect')];
  ok(sects.length === 2, 'у экзамена должно быть два заголовка секций');
  ok(sects[0].classList.contains('cur'), 'на первой задаче виден заголовок части 1');
  ok(doc.getElementById('stepNum').textContent.indexOf('ЧАСТЬ 1') >= 0,
     'в счётчике должна быть подписана часть 1');

  quiz.goStep(19);                       // последняя задача части 1
  ok(!sects[0].classList.contains('cur') && !sects[1].classList.contains('cur'),
     'внутри секции её заголовок повторно показывать не нужно');

  quiz.goStep(20);                       // первая задача части 2
  ok(sects[1].classList.contains('cur'), 'на первой задаче части 2 должен появиться её заголовок');
  ok(doc.getElementById('stepNum').textContent.indexOf('ЧАСТЬ 2') >= 0,
     'в счётчике должна быть подписана часть 2');
}

/* ----------------------------- 5. пройденный день открыли заново --- */

/* Такой день восстанавливается сразу с итогом: листать нечего, и переключатель
   вида не должен появляться мёртвой кнопкой. */
{
  const first = run({
    width: 400, view: 'step', setId: 'dayDone', file: 'data/day02.js',
    varName: 'DAY02', mode: 'practice'
  });
  answerAll(first.window, first.doc, first.quiz);
  const progress = first.window.localStorage.getItem('sasmo.progress');
  ok(first.quiz.finished === true, 'день должен завершиться, когда отвечено всё');

  // открываем тот же день заново, с сохранённым прогрессом
  const again = boot(400);
  again.localStorage.setItem('sasmo.progress', progress);
  again.localStorage.setItem('sasmo.view', 'step');
  again.eval(fs.readFileSync(path.join(ROOT, 'data/day02.js'), 'utf8'));
  const q2 = again.SASMO.run({
    mount: again.document.getElementById('box'),
    questions: again.DAY02.questions, mode: 'practice', setId: 'dayDone'
  });

  ok(q2.finished === true, 'пройденный день должен открыться уже с итогом');
  ok(q2.stepOn !== true, 'на пройденном дне постраничный режим включать не нужно');
  ok(again.document.querySelectorAll('.qcard.cur').length === 0,
     'на пройденном дне задачи не прячем — виден разбор целиком');
  ok(!again.document.querySelector('.viewtoggle'),
     'на пройденном дне переключатель вида не нужен');
  ok(!again.document.body.classList.contains('has-stepnav'),
     'на пройденном дне отступ под панель не нужен');
}

/* ------------------ 6. одностраничная сборка: движок там отдельный --- */

/* sasmo-month.html несёт собственную копию движка — значит, режим в ней
   может разойтись с многостраничной версией молча. Проверяем и её. */
{
  const file = path.join(ROOT, 'sasmo-month.html');
  if (!fs.existsSync(file)) {
    failures.push('нет sasmo-month.html — сначала node build/build.js');
  } else {
    // jsdom ругается на scrollTo, которого у него нет; в отчёте это лишний шум
    const quiet = new VirtualConsole();
    quiet.on('jsdomError', () => {});
    const dom = new JSDOM(fs.readFileSync(file, 'utf8'), {
      url: 'http://localhost/sasmo-month.html#/day/2',
      runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: quiet
    });
    const w = dom.window;
    windows.push(w);
    w.matchMedia = (q) => ({
      matches: /max-width:\s*760px/.test(q), media: q,
      addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
    });
    w.scrollTo = () => {};

    const d = w.document;
    w.localStorage.setItem('sasmo.view', 'step');
    w.location.hash = '#/day/2';
    w.dispatchEvent(new w.Event('hashchange'));

    const cards = [...d.querySelectorAll('.q')];
    const cur = [...d.querySelectorAll('.q.cur')];
    ok(cards.length === 10, `в сборке должно быть 10 задач дня, а их ${cards.length}`);
    ok(cur.length === 1, `в сборке видна должна быть одна задача, а их ${cur.length}`);
    ok(!!d.getElementById('stepnav'), 'в сборке нет панели навигации');
    ok(d.getElementById('stepnav').classList.contains('vis'), 'панель в сборке должна быть видна');
    ok(d.getElementById('stepNum').textContent.indexOf('1 / 10') >= 0,
       'счётчик в сборке должен показывать «1 / 10», а показывает «' +
       d.getElementById('stepNum').textContent + '»');

    d.getElementById('stepNext').click();
    ok(d.querySelector('.q.cur').id === 'q1', 'в сборке не листается вперёд');

    // уходим на другую страницу — панель не должна остаться висеть
    w.location.hash = '#/';
    w.dispatchEvent(new w.Event('hashchange'));
    ok(!d.getElementById('stepnav'), 'при уходе с набора панель должна убираться');
    ok(!d.body.classList.contains('has-stepnav'), 'класс has-stepnav должен сниматься с body');
  }
}

/* ------------------- 7. две страницы работы: прогресс раздельный --- */

/* Дима и Богдан решают одну и ту же работу, но результат одного не должен
   ни попадаться, ни стираться другому — ни в прогрессе, ни в журнале ошибок. */
{
  const dimaPage = fs.readFileSync(path.join(ROOT, 'mathxcel_dima.html'), 'utf8');
  const bogdanPage = fs.readFileSync(path.join(ROOT, 'mathxcel_bogdan.html'), 'utf8');

  ok(!fs.existsSync(path.join(ROOT, 'mathxcel.html')),
     'mathxcel.html заменён двумя страницами и остаться не должен');
  ok(/who: 'dima'/.test(dimaPage), 'страница Димы должна объявлять who: dima');
  ok(/who: 'bogdan'/.test(bogdanPage), 'страница Богдана должна объявлять who: bogdan');

  // страницы обязаны отличаться только именем: иначе они разъедутся при правке
  const norm = (t) => t.replace(/dima|bogdan/g, '@').replace(/Дима|Богдан/g, '@');
  ok(norm(dimaPage) === norm(bogdanPage),
     'страницы должны отличаться только именем решающего');

  // обе берут задачи из одного файла — дублировать 25 задач нельзя
  ok(/varName: 'MATHXCEL24'/.test(dimaPage) && /varName: 'MATHXCEL24'/.test(bogdanPage),
     'обе страницы должны брать задачи из data/mathxcel24.js');

  /* Ключи хранения и запись ответов — на настоящем движке. */
  function solve(who, howMany) {
    const w = boot(400);
    w.eval(fs.readFileSync(path.join(ROOT, 'assets/paper.js'), 'utf8'));
    w.eval(fs.readFileSync(path.join(ROOT, 'data/mathxcel24.js'), 'utf8'));

    const keys = w.SASMO_PAPER.keys(who);
    w.SASMO.usePlan({ keys, hubHref: 'index.html', errorsHref: 'errors.html?who=' + who });

    const questions = w.MATHXCEL24.questions.slice(0, howMany);
    w.SASMO.run({
      mount: w.document.getElementById('box'),
      questions, mode: 'practice', setId: 'mathxcel24'
    });
    // отвечаем неверно — так проверяется заодно и журнал ошибок
    questions.forEach((q, i) => w.document.getElementById('o' + i + '_' + ((q.ans + 1) % 4)).click());
    return { w, keys };
  }

  const d = solve('dima', 3);
  const b = solve('bogdan', 5);

  ok(d.keys.progress === 'paper.dima.progress', 'у Димы свой ключ прогресса');
  ok(b.keys.progress === 'paper.bogdan.progress', 'у Богдана свой ключ прогресса');
  ok(d.keys.errors !== b.keys.errors, 'журналы ошибок должны лежать под разными ключами');

  const dRec = JSON.parse(d.w.localStorage.getItem(d.keys.progress) || '{}');
  const bRec = JSON.parse(b.w.localStorage.getItem(b.keys.progress) || '{}');
  ok(dRec.mathxcel24 && Object.keys(dRec.mathxcel24.answers).length === 3,
     'у Димы должно быть записано 3 ответа');
  ok(bRec.mathxcel24 && Object.keys(bRec.mathxcel24.answers).length === 5,
     'у Богдана должно быть записано 5 ответов');

  const dErr = JSON.parse(d.w.localStorage.getItem(d.keys.errors) || '[]');
  const bErr = JSON.parse(b.w.localStorage.getItem(b.keys.errors) || '[]');
  ok(dErr.length === 3 && bErr.length === 5, 'ошибки должны попасть каждому в свой журнал');

  ok(d.w.localStorage.getItem('paper.bogdan.progress') === null,
     'страница Димы не должна писать в хранилище Богдана');
  ok(d.w.localStorage.getItem('sasmo.progress') === null,
     'работа не должна писать в прогресс 28-дневной программы');
  ok(d.w.localStorage.getItem('sasmo.errors') === null,
     'ошибки работы не должны попадать в журнал 28-дневной программы');

  /* Журнал ошибок должен уметь открыться «чей» — иначе ссылка из итога
     приведёт ребёнка в чужой или пустой журнал. */
  const errPage = fs.readFileSync(path.join(ROOT, 'errors.html'), 'utf8');
  ok(/params\.get\('who'\)/.test(errPage), 'errors.html должен читать ?who=');
  ok(/SASMO_PAPER\.keys\(who\)/.test(errPage), 'errors.html должен брать ключи решающего');
  ok(/assets\/paper\.js/.test(errPage), 'errors.html должен подключать paper.js');
}

/* --------------------------------------------------------------- итог --- */

windows.forEach(w => w.close());

if (failures.length) {
  console.log(`ОШИБКИ (${failures.length}):`);
  failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('Страницы тренажёра: проверки пройдены.');
process.exit(0);
