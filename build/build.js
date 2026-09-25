/* Сборка одностраничной версии тренажёра.

   Своего движка и своих страниц у сборки нет: она берёт настоящие
   index.html, day.html, exam.html и errors.html, общий движок и стили из
   assets/ и задачи из data/ — и складывает всё в один файл. Страницы в нём
   переключает build/router.js. Так одна страница не может разойтись с
   многостраничной: код у них буквально один.

   Запуск:  node build/build.js          — оба класса
            node build/build.js 2        — только второй

   Результат: sasmo-month.html (3 класс) и sasmo-month-2.html (2 класс). */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* --- загружаем программы обоих классов в песочницу --- */
global.window = {};
require(path.join(ROOT, 'assets', 'plan.js'));
require(path.join(ROOT, 'assets', 'plan2.js'));

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml'
};

/* Скрипты в том порядке, в каком их подключают страницы. */
const ASSETS = ['i18n.js', 'plan.js', 'plan2.js', 'fig.js', 'theory.js',
                'quiz.js', 'paper.js', 'demo.js'];

/* Страницы, которые живут в сборке. Остальные (paper.html, mult.html) —
   только на сайте: хаб в сборке их не показывает. */
const PAGES = ['index', 'day', 'exam', 'errors'];

// Git на Windows может отдать файлы с CRLF — приводим к LF
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
}

// "</script>" внутри данных закрыл бы тег раньше времени
function js(value) {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}

/* «</script>» в комментарии или строке закрыл бы тег; «<\/script>» для JS —
   та же строка, а для HTML-разбора уже не конец тега. */
function script(code) {
  return '<script>\n' + code.replace(/<\/(script)/gi, '<\\/$1') + '\n</script>\n';
}

/* Страница = заголовок + разметка тела + её собственный скрипт.
   Подключения assets/*.js пропускаем: в сборке они уже есть. */
function page(name) {
  const html = read(name + '.html');
  const title = (/<title>([\s\S]*?)<\/title>/.exec(html) || [])[1] || '';
  const body = (/<body[^>]*>([\s\S]*?)<\/body>/.exec(html) || [])[1];
  if (!body) throw new Error(`${name}.html: нет <body>`);

  const scripts = [...body.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  if (scripts.length !== 1) throw new Error(`${name}.html: ждали один встроенный скрипт, а их ${scripts.length}`);

  const markup = body.replace(/<script[\s\S]*?<\/script>\s*/g, '').trim();
  return { title: title.trim(), body: markup, code: scripts[0] };
}

function noFunctions(obj, where) {
  JSON.stringify(obj, (k, v) => {
    if (typeof v === 'function') throw new Error(`${where}: в наборе функция (${k}) — в сборку не попадёт`);
    return v;
  });
}

function build(grade) {
  const PLAN = global.window.PLANS[grade];
  const out = path.join(ROOT, grade === 3 ? 'sasmo-month.html' : `sasmo-month-${grade}.html`);

  const sets = {};
  let totalQuestions = 0;

  for (const day of PLAN.days) {
    if (day.kind === 'review' || !PLAN.ready.includes(day.id)) continue;

    require(path.join(ROOT, PLAN.dir, day.id + '.js'));
    const data = global.window[day.v];
    if (!data || !Array.isArray(data.questions)) {
      throw new Error(`${PLAN.label}: нет задач для ${day.id}`);
    }
    if (data.questions.length !== day.n) {
      throw new Error(`${PLAN.label} / ${day.id}: задач ${data.questions.length}, ` +
                      `а в плане ${day.n}`);
    }
    noFunctions(data, `${PLAN.label} / ${day.id}`);

    // копия: картинки вклеиваются в неё, а не в общий объект из require
    sets[day.v] = JSON.parse(JSON.stringify(data));
    totalQuestions += data.questions.length;
  }

  /* --- растровые картинки вклеиваем прямо в страницу ---
     Одностраничная версия должна оставаться одним файлом: ссылка на img/…
     сломается, стоит отправить её кому-нибудь одним файлом. */
  let inlined = 0;
  const missing = [];

  function inline(q) {
    if (!q || !q.img || /^data:/.test(q.img)) return;
    const file = path.join(ROOT, q.img);
    const mime = MIME[path.extname(file).toLowerCase()];
    if (!mime || !fs.existsSync(file)) { missing.push(q.img); return; }
    q.img = 'data:' + mime + ';base64,' + fs.readFileSync(file).toString('base64');
    inlined++;
  }

  for (const set of Object.values(sets)) {
    for (const q of set.questions) {
      inline(q);
      inline(q.en);
    }
  }

  const pages = PAGES.map(page);
  const hub = pages[0];

  let html = '<!DOCTYPE html>\n<html lang="ru">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '<title>' + hub.title + '</title>\n' +
    '<!-- Собрано build/build.js из index/day/exam/errors.html, assets/ и data/. Не править руками. -->\n' +
    '<style>\n' + read('assets/quiz.css') + '\n</style>\n</head>\n<body>\n' +
    '<div id="page"></div>\n\n';

  html += script('window.SASMO_BUNDLE = { grade: ' + grade + ', pages: {} };');
  for (const f of ASSETS) html += script(read('assets/' + f));
  html += script(Object.entries(sets).map(([v, data]) => 'window.' + v + ' = ' + js(data) + ';').join('\n'));
  PAGES.forEach((name, i) => {
    const p = pages[i];
    html += script('window.SASMO_BUNDLE.pages.' + name + ' = { title: ' + js(p.title) +
                   ', body: ' + js(p.body) + ', run: function () {\n' + p.code + '\n} };');
  });
  html += script(read('build/router.js'));
  html += '</body>\n</html>\n';

  fs.writeFileSync(out, html, 'utf8');

  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
  console.log(`Собрано: ${path.relative(ROOT, out)}  (${PLAN.label})`);
  console.log(`  дней и экзаменов: ${Object.keys(sets).length}`);
  console.log(`  задач: ${totalQuestions}`);
  console.log(`  размер: ${kb} КБ`);
  if (inlined) console.log(`  картинок вклеено: ${inlined}`);
  if (missing.length) {
    console.log(`  НЕ НАЙДЕНЫ картинки (${missing.length}): ${missing.join(', ')}`);
  }
}

const only = process.argv[2] ? parseInt(process.argv[2], 10) : null;
for (const grade of [3, 2]) {
  if (only && only !== grade) continue;
  build(grade);
}
