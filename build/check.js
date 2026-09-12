/* Проверка наборов задач — то, что человек пропустит, а ребёнок найдёт.

   Запуск:  node build/check.js        — оба класса
            node build/check.js 2      — только второй

   Что смотрим:
     • набор есть, задач столько, сколько обещано в программе;
     • у mcq четыре варианта и указатель на верный в пределах списка;
     • у open ответ — число;
     • ответ из разбора совпадает с полем ans (ловит описки в арифметике);
     • спецификации рисунков рисуются;
     • одинаковые формулировки внутри класса.                                */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'assets', 'fig.js'));
require(path.join(ROOT, 'assets', 'plan.js'));
require(path.join(ROOT, 'assets', 'plan2.js'));
const FIG = global.window.SASMO_FIG;

const errors = [];
const warns = [];

/* «Всего 9 + 4 + 1 = <b>14</b>.» → ['14'] */
function bolds(html) {
  const out = [];
  String(html).replace(/<b>([\s\S]*?)<\/b>/g, (_, inner) => {
    out.push(inner.replace(/<[^>]+>/g, '').replace(/&minus;/g, '−').trim());
    return '';
  });
  return out;
}

function stems(s) {
  return String(s).toLowerCase().replace(/ё/g, 'е')
    .split(/[^a-zа-я0-9]+/)
    .filter(w => w.length >= 3)
    .map(w => w.slice(0, 3));
}

function digits(s) {
  const m = String(s).replace(/\s/g, '').match(/-?\d+([.,]\d+)?/);
  return m ? m[0].replace(',', '.') : null;
}

/* Проверка одного набора задач. Вынесена отдельно, потому что кроме дней
   программы в репозитории живут отдельные работы (MathXCEL и прочие прошлые
   олимпиады) — их проверяем теми же правилами. */
function checkSet(where, data, seen) {
  data.questions.forEach((q, i) => {
    const at = `${where} #${i + 1}`;

      if (!q.q || typeof q.q !== 'string') errors.push(`${at}: пустое условие`);
      if (!q.topic) warns.push(`${at}: не указана тема`);
      if (!q.ex) warns.push(`${at}: нет разбора`);
      if (!q.hint) warns.push(`${at}: нет подсказки`);

      const answers = bolds(q.ex);

      if (q.type === 'mcq') {
        if (!Array.isArray(q.opts) || q.opts.length !== 4) {
          errors.push(`${at}: у варианта ответа должно быть 4 опции, а их ${q.opts ? q.opts.length : 0}`);
        } else if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans >= q.opts.length) {
          errors.push(`${at}: ans=${q.ans} вне списка вариантов`);
        } else {
          // разбор должен подтверждать тот же вариант
          const right = String(q.opts[q.ans]).replace(/<[^>]+>/g, '').trim();
          const rightNum = digits(right);
          // словесные ответы в разборе стоят в другом падеже («Круг» → «круга»),
          // поэтому сверяем по трёхбуквенным основам слов, а числа — точно
          const ok = answers.some(b => b === right ||
                                       (rightNum !== null && digits(b) === rightNum) ||
                                       stems(b).some(x => stems(right).includes(x)));
          if (!ok) {
            warns.push(`${at}: в разборе не видно ответа «${right}» (жирным: ${answers.join(' | ') || '—'})`);
          }
        }
      } else if (q.type === 'open') {
        if (typeof q.ans !== 'number' || !isFinite(q.ans)) {
          errors.push(`${at}: ответ открытой задачи должен быть числом, а это ${JSON.stringify(q.ans)}`);
        } else {
          const ok = answers.some(b => digits(b) === String(q.ans));
          if (!ok) {
            warns.push(`${at}: в разборе не видно ответа ${q.ans} (жирным: ${answers.join(' | ') || '—'})`);
          }
        }
      } else {
        errors.push(`${at}: неизвестный тип «${q.type}»`);
      }

      ['fig', 'exfig'].forEach(field => {
        if (!q[field]) return;
        const svg = FIG.build(q[field]);
        if (!svg || svg.indexOf('<svg') < 0) errors.push(`${at}: рисунок «${q[field]}» не рисуется`);
      });

      const key = q.q.replace(/\s+/g, ' ').trim();
      if (seen.has(key)) warns.push(`${at}: дословный повтор задачи из ${seen.get(key)}`);
      else seen.set(key, where.split(' / ').pop() + ` #${i + 1}`);
    });

  return data.questions.length;
}

function checkGrade(grade) {
  const PLAN = global.window.PLANS[grade];
  const seen = new Map();
  let total = 0;

  for (const day of PLAN.days) {
    if (day.kind === 'review' || !PLAN.ready.includes(day.id)) continue;
    const where = `${PLAN.label} / ${day.id}`;
    const file = path.join(ROOT, PLAN.dir, day.id + '.js');

    if (!fs.existsSync(file)) { errors.push(`${where}: нет файла ${path.relative(ROOT, file)}`); continue; }
    require(file);
    const data = global.window[day.v];
    if (!data || !Array.isArray(data.questions)) { errors.push(`${where}: нет window.${day.v}.questions`); continue; }
    if (data.questions.length !== day.n) {
      errors.push(`${where}: задач ${data.questions.length}, а в программе ${day.n}`);
    }

    total += checkSet(where, data, seen);
  }

  console.log(`${PLAN.label}: наборов ${PLAN.ready.filter(id => !/^rev/.test(id)).length}, задач ${total}`);
}

/* Отдельные работы: не дни программы, а целые прошлые олимпиады.
   У каждой свой счёт, поэтому сверяем ещё и правила из поля `rules`. */
const PAPERS = [
  { id: 'mathxcel24', v: 'MATHXCEL24', n: 25, label: 'MathXCEL 2024 / 3 класс' }
];

function checkPapers() {
  const seen = new Map();

  for (const paper of PAPERS) {
    const where = paper.label;
    const file = path.join(ROOT, 'data', paper.id + '.js');

    if (!fs.existsSync(file)) { errors.push(`${where}: нет файла data/${paper.id}.js`); continue; }
    require(file);
    const data = global.window[paper.v];
    if (!data || !Array.isArray(data.questions)) { errors.push(`${where}: нет window.${paper.v}.questions`); continue; }
    if (data.questions.length !== paper.n) {
      errors.push(`${where}: задач ${data.questions.length}, а должно быть ${paper.n}`);
    }

    const R = data.rules;
    if (!R) {
      warns.push(`${where}: нет правил счёта — будут применены правила SASMO`);
    } else {
      // Максимум должен сходиться с ценой задач: иначе ребёнку покажут «60 из 55»
      const calc = (R.start || 0) + R.split * R.a.ok + (data.questions.length - R.split) * R.b.ok;
      if (R.max !== calc) {
        errors.push(`${where}: максимум ${R.max}, а по ценам задач выходит ${calc}`);
      }
      // Первая часть — выбор ответа, вторая — открытый: перепутанный split
      // молча сдвинул бы и счёт, и заголовки секций
      data.questions.forEach((q, i) => {
        const want = i < R.split ? 'mcq' : 'open';
        if (q.type !== want) {
          errors.push(`${where} #${i + 1}: тип «${q.type}», а по правилам должен быть «${want}»`);
        }
      });
    }

    const total = checkSet(where, data, seen);
    console.log(`${where}: задач ${total}` + (R ? `, максимум ${R.max} баллов` : ''));
  }
}

/* Второй класс не должен получать те же задачи, что и третий: одинаковая
   формулировка с одинаковыми числами означает одинаковую сложность. */
function crossGrades() {
  const texts = new Map();
  for (const grade of [3, 2]) {
    const PLAN = global.window.PLANS[grade];
    for (const day of PLAN.days) {
      if (day.kind === 'review' || !PLAN.ready.includes(day.id)) continue;
      const data = global.window[day.v];
      if (!data) continue;
      data.questions.forEach((q, i) => {
        const key = q.q.replace(/\s+/g, ' ').trim().toLowerCase();
        const at = `${PLAN.label} / ${day.id} #${i + 1}`;
        if (texts.has(key) && texts.get(key).grade !== grade) {
          warns.push(`${at}: та же формулировка, что и в ${texts.get(key).at} — ` +
                     `у классов должны быть задачи разной сложности`);
        } else {
          texts.set(key, { grade, at });
        }
      });
    }
  }
}

const only = process.argv[2] ? parseInt(process.argv[2], 10) : null;
for (const grade of [3, 2]) {
  if (only && only !== grade) continue;
  checkGrade(grade);
}
if (!only) { crossGrades(); checkPapers(); }

if (warns.length) {
  console.log(`\nЗамечания (${warns.length}):`);
  warns.forEach(w => console.log('  • ' + w));
}
if (errors.length) {
  console.log(`\nОШИБКИ (${errors.length}):`);
  errors.forEach(e => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\nОшибок нет.');
