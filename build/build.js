/* Сборка одностраничной версии тренажёра.
   Берёт программу и задачи из assets/plan*.js и data/, чтобы одна страница
   не расходилась с многостраничной, и вклеивает их в build/template.html.

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

// Git на Windows может отдать шаблон с CRLF, а метка вставки ищется с LF
const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8').replace(/\r\n/g, '\n');
const marker = '<script>\n/* eslint-disable */';
if (!template.includes(marker)) {
  throw new Error('В шаблоне не найдено место для вставки данных');
}

// Движок рисунков общий с многостраничной версией — вклеиваем его целиком.
const fig = fs.readFileSync(path.join(ROOT, 'assets', 'fig.js'), 'utf8');

// Теория к задачам («Мне непонятно — объясни») — тоже общая.
const theory = fs.readFileSync(path.join(ROOT, 'assets', 'theory.js'), 'utf8');

/* В одной странице нет errors.html: правим ссылки на внутренний маршрут. */
function relink(html) {
  return String(html).replace(/href="errors\.html(\?g=\d)?"/g, 'href="#/errors"');
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

    sets[day.id] = data;
    totalQuestions += data.questions.length;
  }

  for (const set of Object.values(sets)) {
    if (set.intro) set.intro.body = relink(set.intro.body);
  }

  /* --- растровые картинки вклеиваем прямо в страницу ---
     Одностраничная версия должна оставаться одним файлом: ссылка на img/…
     сломается, стоит отправить её кому-нибудь одним файлом. */
  let inlined = 0;
  const missing = [];

  for (const set of Object.values(sets)) {
    for (const q of set.questions) {
      if (!q.img || /^data:/.test(q.img)) continue;
      const file = path.join(ROOT, q.img);
      const mime = MIME[path.extname(file).toLowerCase()];
      if (!mime || !fs.existsSync(file)) { missing.push(q.img); continue; }
      q.img = 'data:' + mime + ';base64,' + fs.readFileSync(file).toString('base64');
      inlined++;
    }
  }

  /* --- то, что нужно странице: программа без служебных методов --- */
  const payload = {
    grade: PLAN.grade,
    label: PLAN.label,
    key: PLAN.keys.single,
    weeks: PLAN.weeks,
    days: PLAN.days
      .filter(d => d.kind === 'review' || sets[d.id])
      .map(d => ({ d: d.d, kind: d.kind, id: d.id, title: d.title, skill: d.skill, n: d.n })),
    sets
  };

  // "</script>" внутри данных закрыл бы тег раньше времени
  const json = JSON.stringify(payload).replace(/<\//g, '<\\/');

  const html = template.replace(
    marker,
    '<script>window.SASMO_DATA = ' + json + ';</script>\n\n'
    + '<script>\n/* eslint-disable */\n' + fig + '</script>\n\n'
    + '<script>\n/* eslint-disable */\n' + theory + '</script>\n\n'
    + marker
  );

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
