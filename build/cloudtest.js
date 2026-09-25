/* Проверка облака без облака: assets/cloud.js и страницы против имитации
   Supabase в памяти.

   Имитация отвечает на те же адреса, что и настоящий Supabase (Auth и
   PostgREST), и держит те же правила доступа, что и supabase/schema.sql:
   взрослый видит своих учеников, учитель — учеников своих классов и только
   читает. Сами правила RLS проверяются на настоящем PostgreSQL отдельно —
   tools/test_rls.sh; здесь проверяется клиент: вход, профили, приставка
   ключей, отправка и приём прогресса, слияние при конфликте, класс по коду,
   панель учителя и отчёт по ученику.

   Запуск:  node build/cloudtest.js      (нужен jsdom, как для uitest.js)   */

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
const windows = [];
function ok(cond, what) { if (!cond) failures.push(what); }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const mock = require('./cloudmock');
const DB = mock.DB;
const mockFetch = mock.fetch;

/* ================================================================ стенд === */

const inline = (code) => '<script>' + code.replace(/<\/script/gi, '<\\/script') + '</script>';

/* Страница со своими скриптами, вклеенными в HTML; облако «настроено». */
function page(file, query, storage) {
  const quiet = new VirtualConsole();
  quiet.on('jsdomError', (e) => { if (!/scrollTo|Not implemented/.test(e.message)) failures.push(file + ': ' + e.message); });
  const forms = ['g3a', 'g3b', 'g2a', 'g2b']
    .map(f => inline(fs.readFileSync(path.join(ROOT, 'data', 'assess-' + f + '.js'), 'utf8'))).join('\n');
  const sets = ['day02', 'day03', 'day04'].map(d => inline(fs.readFileSync(path.join(ROOT, 'data', d + '.js'), 'utf8'))).join('\n');
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8')
    .replace(/<script src="([^"?]+)(\?[^"]*)?"><\/script>/g, (m, src) => {
      if (src === 'assets/cloud-config.js') {
        return inline("window.SASMO_CLOUD_CONFIG = { url: 'https://mock.supabase.co', anonKey: 'anon-key' };");
      }
      return inline(fs.readFileSync(path.join(ROOT, src), 'utf8'));
    });
  // наборы задач — перед скриптом страницы, чтобы SASMO.loadSet нашёл их готовыми
  const withData = html.replace(/(<script>\r?\n(\/\* =|\(function))/, forms + sets + '\n$1');
  const dom = new JSDOM(withData, {
    url: 'http://localhost/' + file + (query || ''),
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: quiet,
    beforeParse(w) {
      w.fetch = mockFetch;
      w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      w.scrollTo = () => {};
      w.prompt = () => w.__prompt;
      w.confirm = () => true;
      w.URL.createObjectURL = () => 'blob:x';
      for (const [k, v] of Object.entries(storage || {})) w.localStorage.setItem(k, v);
    }
  });
  windows.push(dom.window);
  return dom.window;
}

function dump(w, only) {
  const out = {};
  for (let i = 0; i < w.localStorage.length; i++) {
    const k = w.localStorage.key(i);
    if (!only || only.test(k)) out[k] = w.localStorage.getItem(k);
  }
  return out;
}

function answerFirst(w, set, n) {
  const d = w.document;
  const data = w[set.toUpperCase()];
  for (let i = 0; i < n; i++) {
    const q = data.questions[i];
    if (q.type === 'mcq') d.getElementById('o' + i + '_' + q.ans).click();
    else {
      const inp = d.getElementById('in' + i);
      inp.value = String(q.ans);
      d.querySelector('#c' + i + ' [data-act="check"]').click();
    }
  }
}

/* ============================================================ сценарии === */

async function main() {
  /* --- родитель входит, принимает условия, заводит ребёнка --- */
  const a1 = page('account.html', '', { 'sasmo.view': 'list' });
  const C = a1.SASMO_CLOUD;
  ok(C.enabled(), 'облако с настройкой должно быть включено');
  ok(a1.document.getElementById('email'), 'без входа на странице аккаунта должна быть форма входа');
  ok(C.prefix() === '', 'до входа приставки нет');

  await C.sendCode('parent@example.com');
  let bad = null;
  try { await C.verify('parent@example.com', '000000'); } catch (e) { bad = e; }
  ok(bad && bad.status === 403, 'неверный код не должен пускать');
  await C.verify('parent@example.com', '123 456');
  ok(!!C.session() && C.me().email === 'parent@example.com', 'после кода есть сессия');
  await C.saveProfile({ role: 'parent', display_name: 'Мама' });
  const kid = await C.createStudent({ nickname: 'Сокол', grade: 3, consent_by: 'parent' });
  ok(kid && kid.id && kid.consent_by === 'parent', 'ученик создаётся с отметкой согласия');
  C.useStudent(kid);
  ok(C.prefix() === 'st.' + kid.id + '.', 'выбранный ученик задаёт приставку ключей');

  // в этом браузере был прогресс до входа — переносим в профиль
  a1.localStorage.setItem('sasmo.progress', JSON.stringify({ day03: { done: true, ok: 9, no: 1, total: 10, answers: {}, ts: 1 } }));
  const moved = C.importLocal(3);
  ok(moved.includes('sasmo.progress'), 'прогресс до входа переносится в профиль');
  await C.push();
  ok(DB.kv[kid.id + '|sasmo.progress'] && DB.kv[kid.id + '|sasmo.progress'].value.day03, 'перенесённый прогресс уходит в облако');

  /* --- занятие на первом устройстве пишется в профиль и уходит в облако --- */
  const d1 = page('day.html', '?d=02', dump(a1));
  await sleep(10);
  answerFirst(d1, 'day02', 2);
  const local = JSON.parse(d1.localStorage.getItem('st.' + kid.id + '.sasmo.progress') || '{}');
  ok(local.day02 && Object.keys(local.day02.answers).length === 2, 'ответы пишутся под приставкой ученика');
  ok(!d1.localStorage.getItem('sasmo.progress') || !JSON.parse(d1.localStorage.getItem('sasmo.progress')).day02,
     'ответы ученика не должны попадать в общий прогресс без приставки');
  await sleep(1700);                      // отправка — через полторы секунды после записи
  const remote = DB.kv[kid.id + '|sasmo.progress'];
  ok(remote && remote.value.day02 && remote.value.day03, 'облако должно получить и новый день, и перенесённый');
  ok(/сохранено/.test(d1.document.querySelector('.cloudline').textContent), 'строка облака должна показать «сохранено»');

  /* --- второе устройство: тот же взрослый, тот же ученик --- */
  const creds = dump(a1, /^cloud\./);
  const d2 = page('index.html', '', creds);
  await sleep(50);
  const got = JSON.parse(d2.localStorage.getItem('st.' + kid.id + '.sasmo.progress') || '{}');
  ok(got.day02 && got.day03, 'второе устройство должно подтянуть прогресс из облака');

  /* --- конфликт: оба устройства меняли, одно без связи --- */
  mock.setOffline(true);
  const d1b = page('day.html', '?d=03', dump(d1));
  await sleep(10);
  // день 3 уже «пройден» из переноса — берём день 4 на первом устройстве
  const d1c = page('day.html', '?d=04', dump(d1b));
  await sleep(10);
  answerFirst(d1c, 'day04', 1);
  await sleep(1700);
  ok(/нет связи/.test(d1c.document.querySelector('.cloudline').textContent), 'без связи строка облака должна это сказать');
  mock.setOffline(false);
  // тем временем второе устройство решило задачу дня 2 дальше
  const d2b = page('day.html', '?d=02', dump(d2));
  await sleep(50);
  answerFirst(d2b, 'day02', 4);
  await d2b.SASMO_CLOUD.push();
  // первое устройство снова в сети: забирает и сводит, а не затирает
  const d1d = page('index.html', '', dump(d1c));
  await sleep(80);
  const merged = DB.kv[kid.id + '|sasmo.progress'].value;
  ok(merged.day04 && merged.day02 && Object.keys(merged.day02.answers).length === 4 && merged.day03,
     'после конфликта в облаке должны быть и день 4 с первого устройства, и 4 ответа дня 2 со второго');
  ok(!!JSON.parse(d1d.localStorage.getItem('st.' + kid.id + '.sasmo.progress')).day02.answers[3],
     'первое устройство должно получить ответы второго');

  /* --- учитель: класс, код, родитель записывает ребёнка --- */
  const t1 = page('account.html', '', {});
  const T = t1.SASMO_CLOUD;
  await T.sendCode('teacher@example.com');
  await T.verify('teacher@example.com', '123456');
  await T.saveProfile({ role: 'teacher' });
  const cls = await T.createClass({ name: '3А', grade: 3 });
  ok(cls && cls.join_code, 'у класса должен быть код');
  ok((await T.readKv([kid.id])).length === 0, 'учитель не должен видеть ученика до входа в класс');

  const name = await C.joinClass(cls.join_code.toLowerCase(), kid.id);
  ok(name === '3А', 'вход в класс по коду возвращает название класса');
  const seen = await T.readKv([kid.id], ['sasmo.progress']);
  ok(seen.length === 1 && seen[0].value.day02, 'после входа в класс учитель видит прогресс');
  let denied = null;
  try { await T.api('POST', '/rest/v1/kv?on_conflict=student_id,key', [{ student_id: kid.id, key: 'x', value: 1 }]); } catch (e) { denied = e; }
  ok(denied && denied.status === 403, 'учитель не может менять прогресс ученика');

  // чужой родитель не может записать нашего ребёнка в класс
  const o = page('account.html', '', {});
  await o.SASMO_CLOUD.sendCode('other@example.com');
  await o.SASMO_CLOUD.verify('other@example.com', '123456');
  let foreign = null;
  try { await o.SASMO_CLOUD.joinClass(cls.join_code, kid.id); } catch (e) { foreign = e; }
  ok(foreign && foreign.status === 403, 'чужой родитель не может записать ребёнка в класс');
  ok((await o.SASMO_CLOUD.listStudents()).length === 0, 'чужой родитель не видит наших детей');

  /* --- панель учителя и отчёт по ученику --- */
  // итоговый и входной тесты — чтобы в панели был прирост
  const prog = DB.kv[kid.id + '|sasmo.progress'].value;
  prog.pre = { done: true, score: 11, max: 20, answers: {}, meta: { form: 'A' } };
  prog.post = { done: true, score: 16, max: 20, answers: {}, meta: { form: 'B' } };
  const tp = page('teacher.html', '', dump(t1, /^cloud\./));
  await sleep(80);
  const row = [...tp.document.querySelectorAll('.roster tr')].find(tr => /Сокол/.test(tr.textContent));
  ok(!!row, 'в панели учителя должен быть ученик класса');
  ok(row && /\+5/.test(row.textContent), 'в панели учителя виден прирост +5');
  ok(!!tp.document.querySelector('.code'), 'в панели виден код класса');
  tp.__prompt = 'Орикс';
  tp.document.querySelector('[data-newkid]').click();
  await sleep(80);
  ok(Object.values(DB.students).some(s => s.nickname === 'Орикс' && s.consent_by === 'school'),
     'учитель может завести ученика с согласием школы');
  ok(DB.members.some(m => m.class_id === cls.id && DB.students[m.student_id] && DB.students[m.student_id].nickname === 'Орикс'),
     'заведённый учителем ученик попадает в его класс');

  const rp = page('report.html', '?student=' + kid.id, dump(t1, /^cloud\./));
  await sleep(80);
  const tiles = [...rp.document.querySelectorAll('.tile .v')].map(x => x.textContent);
  ok(tiles[0] === '11 / 20' && tiles[1] === '16 / 20', 'отчёт по ученику из облака: 11 → 16, а показано ' + tiles.slice(0, 2).join(', '));
  ok(/Сокол/.test(rp.document.getElementById('sub').textContent), 'в отчёте учителя — псевдоним ученика');

  /* --- удаление: профиль, прогресс и членство уходят --- */
  const a2 = page('account.html', '', dump(d1d, /^cloud\.|^st\./));
  await a2.SASMO_CLOUD.deleteStudent(kid.id);
  ok(!DB.students[kid.id] && !DB.kv[kid.id + '|sasmo.progress'], 'удаление ученика стирает и его прогресс');
  ok(!DB.members.some(m => m.student_id === kid.id), 'удалённый ученик уходит из класса');
  ok(!Object.keys(dump(a2)).some(k => k.startsWith('st.' + kid.id)), 'на устройстве не остаётся ключей удалённого ученика');
  ok(a2.SASMO_CLOUD.prefix() === '', 'после удаления активного ученика приставки нет');

  /* --- выход: сессия забыта, прогресс без облака работает как раньше --- */
  a2.SASMO_CLOUD.signOut();
  ok(!a2.SASMO_CLOUD.session() && a2.SASMO_CLOUD.prefix() === '', 'после выхода сессии и приставки нет');
}

main().catch(e => failures.push('исключение: ' + e.stack)).then(() => {
  windows.forEach(w => w.close());
  if (failures.length) {
    console.log(`ОШИБКИ (${failures.length}):`);
    failures.forEach(f => console.log('  ✗ ' + f));
    process.exit(1);
  }
  console.log('Облако: проверки пройдены.');
  process.exit(0);
});
