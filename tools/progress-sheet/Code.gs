/* ==========================================================================
   Журнал прогресса Olympiad Sprint — веб-приложение Google Apps Script

   Тренажёр (assets/log.js) после каждого законченного набора задач шлёт
   сюда POST со строкой JSON. Строка дописывается на лист «Журнал» этой
   таблицы. GET с секретным ключом отдаёт страницу-отчёт по детям.

   Установка — README.md рядом. Ключ отчёта лежит в свойствах скрипта
   (REPORT_KEY), а не в коде: адрес веб-приложения публичный.
   ========================================================================== */

var SHEET = 'Журнал';
var HEAD = ['Время', 'Ученик', 'Класс', 'Набор', 'Название', 'Режим',
            'Верно', 'Ошибок', 'Всего', 'Баллы', 'Макс', 'Минут',
            'Ошибки в задачах', 'Устройство', 'id', 'Статус'];
var ID_COL = 15;                    // столбец id — в нём ищем строку попытки
var DONE = 'закончен', PARTIAL = 'в процессе';

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
  }
  // таблица со старой шапкой (без «Статус») — дописываем недостающие столбцы
  if (sh.getLastColumn() < HEAD.length) {
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);
  }
  sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
  return sh;
}

/* Строка попытки. Пока набор не закончен, тренажёр шлёт её каждые 5 ответов
   со статусом partial — обновляем ту же строку (по id). Итог (done) —
   последнее обновление; опоздавшая partial после done его не перетирает. */
function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return text_('bad json'); }
  if (!d || !d.id || !d.set) return text_('bad row');
  var status = d.status === 'partial' ? PARTIAL : DONE;

  var row = [
    new Date(d.ts || Date.now()), clip_(d.who, 40), d.grade || '', clip_(d.set, 40),
    clip_(d.title, 120), clip_(d.mode, 20),
    num_(d.ok), num_(d.no), num_(d.total), num_(d.score), num_(d.max),
    d.spent === '' || d.spent == null ? '' : Math.round(Number(d.spent) / 6) / 10,
    clip_((d.wrong || []).join('; '), 2000), clip_(d.device, 10), clip_(d.id, 20), status
  ];

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_();
    var last = sh.getLastRow();
    if (last > 1) {
      var from = Math.max(2, last - 1000);
      var vals = sh.getRange(from, ID_COL, last - from + 1, 2).getValues();
      for (var i = vals.length - 1; i >= 0; i--) {
        if (vals[i][0] !== d.id) continue;
        var was = vals[i][1] || DONE;            // старые строки без статуса — законченные
        if (was === DONE) return text_('dup');
        sh.getRange(from + i, 1, 1, HEAD.length).setValues([row]);
        return text_('updated');
      }
    }
    sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return text_('ok');
}

function doGet(e) {
  var key = PropertiesService.getScriptProperties().getProperty('REPORT_KEY');
  var p = (e && e.parameter) || {};
  if (!key || p.key !== key) {
    return HtmlService.createHtmlOutput('<p style="font:16px sans-serif">Нет доступа.</p>');
  }
  return HtmlService.createHtmlOutput(report_(p.who || ''))
    .setTitle('Прогресс учеников')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ------------------------------------------------------------- отчёт ---

   Сервер только читает лист и кладёт строки в страницу JSON-ом. Всё
   остальное — переключение учеников и периода, календарь, графики, темы
   ошибок, журнал с фильтром — считает и рисует сама страница (reportApp_),
   без перезагрузок. Даты показываются во времени того, кто смотрит. */

function report_(who) {
  var sh = sheet_();
  var n = sh.getLastRow() - 1;
  var raw = n > 0 ? sh.getRange(2, 1, n, HEAD.length).getValues() : [];
  var rows = raw.filter(function (r) { return r[0] && r[3]; }).map(function (r) {
    return {
      t: new Date(r[0]).getTime(), who: String(r[1] || '?'), grade: r[2], set: String(r[3]),
      title: String(r[4] || ''), mode: String(r[5] || ''),
      ok: num_(r[6]), no: num_(r[7]), total: num_(r[8]), score: num_(r[9]), max: num_(r[10]),
      min: num_(r[11]), wrong: String(r[12] || '').split('; ').filter(String), device: String(r[13] || ''),
      partial: r[15] === PARTIAL
    };
  });
  var data = JSON.stringify({ rows: rows, who: who, now: Date.now() }).replace(/</g, '\\u003c');

  return '<!doctype html><html lang="ru"><head><meta charset="utf-8">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">' +
    '<style>' + REPORT_CSS_.join('\n') + '</style></head><body>' +
    '<div id="app"></div>' +
    '<script>(' + reportApp_.toString() + ')(' + data + ');</script>' +
    '</body></html>';
}

var REPORT_CSS_ = [
  ':root{--bg:#f6f7f9;--card:#fff;--ink:#16202b;--muted:#6b7684;--line:#e6e9ee;--soft:#f0f2f5;',
  '--accent:#3b5bdb;--accent-soft:#e8edff;--good:#2f9e44;--good-soft:#e6f6ea;--mid:#e8890c;--mid-soft:#fff3e0;',
  '--bad:#e03131;--bad-soft:#ffe9e9;--h0:#ebedf0;--h1:#c5d3ff;--h2:#8ba4f9;--h3:#4c6ef5;--h4:#2b46c4;',
  '--shadow:0 1px 2px rgba(16,24,40,.04),0 1px 3px rgba(16,24,40,.06)}',
  '@media (prefers-color-scheme:dark){:root{--bg:#0f1217;--card:#171b22;--ink:#e7ebf0;--muted:#8d97a5;--line:#262c36;',
  '--soft:#1e232c;--accent:#7b93ff;--accent-soft:#1f2747;--good:#51cf66;--good-soft:#16301d;--mid:#ffa94d;--mid-soft:#352614;',
  '--bad:#ff6b6b;--bad-soft:#3a1a1c;--h0:#232933;--h1:#26346b;--h2:#3651b0;--h3:#5873f0;--h4:#8ea2ff;--shadow:none}}',
  '*{box-sizing:border-box}',
  'body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 Manrope,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;',
  '-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}',
  '.wrap{max-width:1080px;margin:0 auto;padding:20px 16px 48px}',
  '.top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:18px}',
  'h1{font-size:24px;font-weight:800;letter-spacing:-.02em;margin:0}',
  '.upd{color:var(--muted);font-size:13px;margin-top:2px}',
  '.seg{display:inline-flex;background:var(--soft);border-radius:12px;padding:3px;gap:2px;flex-wrap:wrap}',
  '.seg button{border:0;background:transparent;color:var(--muted);font:inherit;font-weight:600;font-size:14px;',
  'padding:7px 14px;border-radius:9px;cursor:pointer;white-space:nowrap}',
  '.seg button.on{background:var(--card);color:var(--ink);box-shadow:var(--shadow)}',
  '.seg button:hover:not(.on){color:var(--ink)}',
  '.bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin:0 0 16px}',
  '.grid{display:grid;gap:14px}',
  '.g2{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}',
  '.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;box-shadow:var(--shadow);min-width:0}',
  '.card h3{margin:0 0 12px;font-size:15px;font-weight:700;display:flex;justify-content:space-between;align-items:baseline;gap:8px}',
  '.card h3 small{color:var(--muted);font-weight:500;font-size:12.5px}',
  '.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}',
  '.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px;box-shadow:var(--shadow)}',
  '.kpi .v{font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.15}',
  '.kpi .l{color:var(--muted);font-size:12.5px;margin-top:2px}',
  '.kpi .s{font-size:12px;margin-top:4px;color:var(--muted)}',
  '.good{color:var(--good)}.mid{color:var(--mid)}.bad{color:var(--bad)}',
  '.kid{cursor:pointer;transition:border-color .15s,transform .15s}',
  '.kid:hover{border-color:var(--accent);transform:translateY(-1px)}',
  '.kid .head{display:flex;align-items:center;gap:12px;margin-bottom:14px}',
  '.ava{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:18px;',
  'background:var(--accent-soft);color:var(--accent);flex:none}',
  '.kid .name{font-weight:800;font-size:18px}.kid .seen{font-size:13px;color:var(--muted)}',
  '.mini{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
  '.mini div{background:var(--soft);border-radius:10px;padding:8px 10px}',
  '.mini b{display:block;font-size:18px}.mini span{font-size:12px;color:var(--muted)}',
  '.heat{display:grid;gap:3px;width:100%}',
  '.heat i{aspect-ratio:1;border-radius:3px;background:var(--h0);display:block}',
  '.heat i.l1{background:var(--h1)}.heat i.l2{background:var(--h2)}.heat i.l3{background:var(--h3)}.heat i.l4{background:var(--h4)}',
  '.heat i.fut{visibility:hidden}.heat i.today{outline:2px solid var(--ink);outline-offset:-2px}',
  '.heat .lb{font-size:10px;color:var(--muted);line-height:1;align-self:center;white-space:nowrap;overflow:visible}',
  '.legend{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted);margin-top:8px;justify-content:flex-end}',
  '.legend i{width:11px;height:11px;border-radius:3px;display:inline-block}',
  'svg text{fill:var(--muted);font:10px Manrope,system-ui,sans-serif}',
  '.topic{display:grid;grid-template-columns:minmax(90px,170px) 1fr 34px;gap:10px;align-items:center;margin:7px 0;font-size:13.5px}',
  '.topic .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.track{height:8px;background:var(--soft);border-radius:99px;overflow:hidden}',
  '.track b{display:block;height:100%;border-radius:99px;background:var(--bad)}',
  '.topic .n{text-align:right;color:var(--muted);font-weight:600}',
  '.empty{color:var(--muted);font-size:13.5px;padding:6px 0}',
  'table{width:100%;border-collapse:collapse;font-size:13.5px}',
  'th{text-align:left;color:var(--muted);font-weight:600;font-size:12px;padding:0 8px 8px;border-bottom:1px solid var(--line)}',
  'td{padding:9px 8px;border-bottom:1px solid var(--line);vertical-align:middle}',
  'tr:last-child td{border-bottom:0}',
  '.pill{display:inline-block;padding:2px 8px;border-radius:99px;font-size:12px;font-weight:700}',
  '.p-good{background:var(--good-soft);color:var(--good)}.p-mid{background:var(--mid-soft);color:var(--mid)}.p-bad{background:var(--bad-soft);color:var(--bad)}',
  '.day{margin-top:18px}.day:first-child{margin-top:4px}',
  '.dayh{display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:var(--muted);',
  'text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}',
  '.row{display:grid;grid-template-columns:48px 1fr 150px 56px;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}',
  '.row:first-of-type{border-top:0}',
  '.row .tm{color:var(--muted);font-size:13px}',
  '.row .tt{font-weight:600;overflow:hidden;text-overflow:ellipsis}',
  '.kind{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:6px;margin-right:6px;vertical-align:1px}',
  '.k-day{background:var(--accent-soft);color:var(--accent)}.k-exam{background:var(--mid-soft);color:var(--mid)}',
  '.k-mult{background:#e0f7f5;color:#0c8599}.k-paper{background:#f3e8ff;color:#7c3aed}.k-assess{background:var(--good-soft);color:var(--good)}.k-other{background:var(--soft);color:var(--muted)}',
  '@media (prefers-color-scheme:dark){.k-paper{background:#2a1d40;color:#c4a2ff}.k-mult{background:#12302e;color:#63e6be}}',
  '.res{display:flex;flex-direction:column;gap:4px}',
  '.res .txt{font-size:13px;display:flex;justify-content:space-between;gap:6px}',
  '.res .txt b{font-weight:700}',
  '.track.res-t b{background:var(--accent)}',
  '.track.res-t b.good{background:var(--good)}.track.res-t b.mid{background:var(--mid)}.track.res-t b.bad{background:var(--bad)}',
  '.row .mn{text-align:right;color:var(--muted);font-size:13px}',
  '.open{display:inline-block;margin-top:4px;font-size:11.5px;font-weight:700;color:var(--mid);background:var(--mid-soft);',
  'padding:1px 7px;border-radius:6px}',
  '.track.res-t.part b{background:repeating-linear-gradient(45deg,var(--mid) 0 6px,transparent 6px 9px)!important}',
  '.errs{margin-top:5px;display:flex;flex-wrap:wrap;gap:4px}',
  '.chip{font-size:11.5px;background:var(--bad-soft);color:var(--bad);padding:1px 7px;border-radius:6px;white-space:nowrap}',
  '.more{border:0;background:none;color:var(--accent);font:inherit;font-size:12px;cursor:pointer;padding:0 2px}',
  '.foot{color:var(--muted);font-size:12px;margin-top:22px;text-align:center}',
  '@media (max-width:640px){.row{grid-template-columns:42px 1fr 70px}.row .mn{display:none}',
  '.res .track{display:none}.res .txt{flex-direction:column;align-items:flex-end;gap:0}h1{font-size:21px}',
  '.kpi .v{font-size:20px}}'
];

/* Страница отчёта целиком. Функция переносится в браузер как текст
   (toString), поэтому снаружи она ничего не видит — только DATA. */
function reportApp_(DATA) {
  var KIND = { day: 'Программа', exam: 'Экзамен', paper: 'Олимпиада', assess: 'Замер',
              mult: 'Умножение', other: 'Другое' };
  var MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа',
             'сентября', 'октября', 'ноября', 'декабря'];
  var MON_S = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  var WD = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  var DAY = 864e5;

  var rows = DATA.rows.map(function (r) {
    r.kind = /^(day|rev)\d/.test(r.set) ? 'day' : /^exam\d/.test(r.set) ? 'exam'
           : (r.set === 'pre' || r.set === 'post') ? 'assess' : r.set === 'mult' ? 'mult'
           : r.set === 'test' ? 'other' : 'paper';
    r.name = (r.title || r.set).replace(/\s+—\s+Olympiad Sprint$/, '');
    // у трёх пробных экзаменов заголовок страницы одинаковый — нужен номер
    if (r.kind === 'exam') r.name = 'Пробный экзамен ' + r.set.replace(/\D/g, '');
    // одна олимпиада бывает для разных классов (GJMAT 3 и 4)
    if (r.kind === 'paper' && r.grade) r.name += ' · ' + r.grade + ' кл.';
    r.done = (r.ok || 0) + (r.no || 0);           // сколько задач решено
    // незаконченный набор: доля верных среди решённых, итог — по всему набору
    r.base = r.partial ? r.done : r.total;
    r.pct = r.partial ? (r.done ? r.ok / r.done : null)
          : r.max ? r.score / r.max : (r.total ? r.ok / r.total : null);
    r.key = dkey(new Date(r.t));
    return r;
  }).sort(function (a, b) { return b.t - a.t; });

  var names = [];
  rows.forEach(function (r) { if (names.indexOf(r.who) < 0) names.push(r.who); });
  names.sort(function (a, b) { return a === '?' ? 1 : b === '?' ? -1 : a.localeCompare(b, 'ru'); });

  var S = { who: names.indexOf(DATA.who) >= 0 ? DATA.who : '', period: 30, kind: 'all', open: {} };
  var app = document.getElementById('app');

  /* --------------------------------------------------------- даты --- */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dkey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function hm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function daysAgo(t) { return Math.round((startOfDay(new Date()) - startOfDay(new Date(t))) / DAY); }
  function rel(t) {
    var d = new Date(t), n = daysAgo(t);
    if (n === 0) return 'сегодня, ' + hm(d);
    if (n === 1) return 'вчера, ' + hm(d);
    if (n < 7) return n + ' ' + plural(n, 'день', 'дня', 'дней') + ' назад';
    return d.getDate() + ' ' + MON[d.getMonth()];
  }
  function dayTitle(key) {
    var d = new Date(key + 'T12:00:00'), n = daysAgo(d.getTime());
    var base = d.getDate() + ' ' + MON[d.getMonth()] + ', ' + WD[d.getDay()];
    return n === 0 ? 'Сегодня · ' + base : n === 1 ? 'Вчера · ' + base : base;
  }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }

  /* ------------------------------------------------------- расчёты --- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function lvl(p) { return p == null ? '' : p >= 0.85 ? 'good' : p >= 0.6 ? 'mid' : 'bad'; }
  function pctTxt(p) { return p == null ? '—' : Math.round(p * 100) + '%'; }
  function of(who) { return rows.filter(function (r) { return r.who === who; }); }
  function inPeriod(list) {
    if (!S.period) return list;
    var from = startOfDay(new Date()).getTime() - (S.period - 1) * DAY;
    return list.filter(function (r) { return r.t >= from; });
  }
  function streak(list) {
    var days = {};
    list.forEach(function (r) { days[r.key] = 1; });
    var d = startOfDay(new Date()), n = 0;
    if (!days[dkey(d)]) d = new Date(d.getTime() - DAY);
    while (days[dkey(d)]) { n++; d = new Date(d.getTime() - DAY); }
    return n;
  }
  function stats(list) {
    var ok = 0, tot = 0, min = 0, days = {}, sets = 0, open = 0;
    list.forEach(function (r) {
      if (r.base) { ok += r.ok || 0; tot += r.base; }
      min += r.min || 0;
      days[r.key] = 1;
      if (r.partial) open++; else sets++;
    });
    return { sets: sets, open: open, acc: tot ? ok / tot : null, min: min, days: Object.keys(days).length };
  }
  function dur(min) {
    min = Math.round(min);
    if (min < 60) return min + ' мин';
    return Math.floor(min / 60) + ' ч ' + (min % 60 ? min % 60 + ' мин' : '');
  }
  function periodWord() {
    return S.period === 7 ? 'за 7 дней' : S.period === 30 ? 'за 30 дней' : 'за всё время';
  }

  /* -------------------------------------------------------- куски --- */

  function seg(name, items, cur) {
    return '<div class="seg">' + items.map(function (it) {
      return '<button data-' + name + '="' + esc(it[0]) + '"' + (String(cur) === String(it[0]) ? ' class="on"' : '') +
             '>' + esc(it[1]) + '</button>';
    }).join('') + '</div>';
  }

  function kpi(v, l, s, cls) {
    return '<div class="kpi"><div class="v ' + (cls || '') + '">' + v + '</div><div class="l">' + l + '</div>' +
           (s ? '<div class="s">' + s + '</div>' : '') + '</div>';
  }

  // Календарь занятий: неделя — столбец, понедельник сверху. Сетка резиновая:
  // клетки растягиваются на ширину карточки, но не больше ~22px
  function heatmap(list, weeks) {
    var count = {};
    list.forEach(function (r) { count[r.key] = (count[r.key] || 0) + 1; });
    var today = startOfDay(new Date());
    var dow = (today.getDay() + 6) % 7;
    var start = new Date(today.getTime() - (dow + 7 * (weeks - 1)) * DAY);
    var WDL = ['пн', '', 'ср', '', 'пт', '', 'вс'];
    var html = '<span></span>', lastM = -1;
    for (var w = 0; w < weeks; w++) {
      var first = new Date(start.getTime() + w * 7 * DAY);
      html += '<span class="lb">' + (first.getMonth() !== lastM && w < weeks - 1 ? MON_S[first.getMonth()] : '') + '</span>';
      lastM = first.getMonth();
    }
    for (var k = 0; k < 7; k++) {
      html += '<span class="lb">' + WDL[k] + '</span>';
      for (w = 0; w < weeks; w++) {
        var d = new Date(start.getTime() + (w * 7 + k) * DAY);
        var key = dkey(d), c = count[key] || 0;
        var cls = d > today ? 'fut' : c >= 4 ? 'l4' : c === 3 ? 'l3' : c === 2 ? 'l2' : c === 1 ? 'l1' : '';
        if (key === dkey(today)) cls += ' today';
        html += '<i class="' + cls + '" title="' + d.getDate() + ' ' + MON[d.getMonth()] + ': ' +
                (c ? c + ' ' + plural(c, 'набор', 'набора', 'наборов') : 'не занимался') + '"></i>';
      }
    }
    return '<div class="heat" style="grid-template-columns:18px repeat(' + weeks + ',1fr);max-width:' +
           (weeks * 25 + 21) + 'px">' + html + '</div>' +
           '<div class="legend">меньше <i style="background:var(--h0)"></i><i style="background:var(--h1)"></i>' +
           '<i style="background:var(--h2)"></i><i style="background:var(--h3)"></i><i style="background:var(--h4)"></i> больше</div>';
  }

  // Точность по дням: столбик = доля верных за день, пустой день — точка
  function accChart(list) {
    var n = S.period || 60;
    if (n > 60) n = 60;
    var today = startOfDay(new Date());
    var by = {};
    list.forEach(function (r) {
      if (!r.base) return;
      var b = by[r.key] || (by[r.key] = { ok: 0, tot: 0, sets: 0 });
      b.ok += r.ok || 0; b.tot += r.base; b.sets++;
    });
    var W = 640, H = 170, L = 30, B = 22, T = 8, bw = (W - L) / n;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Точность по дням">';
    [0, 50, 100].forEach(function (v) {
      var y = T + (H - B - T) * (1 - v / 100);
      svg += '<line x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)" ' +
             (v === 0 ? '' : 'stroke-dasharray="3 4"') + '/><text x="' + (L - 6) + '" y="' + (y + 3) +
             '" text-anchor="end">' + v + '%</text>';
    });
    var any = false;
    for (var i = 0; i < n; i++) {
      var d = new Date(today.getTime() - (n - 1 - i) * DAY);
      var key = dkey(d), b = by[key], x = L + i * bw;
      if (b) {
        any = true;
        var p = b.ok / b.tot, h = Math.max(2, (H - B - T) * p);
        var col = p >= 0.85 ? 'var(--good)' : p >= 0.6 ? 'var(--mid)' : 'var(--bad)';
        svg += '<rect x="' + (x + bw * 0.18) + '" y="' + (H - B - h) + '" width="' + (bw * 0.64) + '" height="' + h +
               '" rx="' + Math.min(4, bw * 0.25) + '" fill="' + col + '"><title>' + d.getDate() + ' ' + MON[d.getMonth()] +
               ': ' + Math.round(p * 100) + '% верно, ' + b.sets + ' ' + plural(b.sets, 'набор', 'набора', 'наборов') +
               '</title></rect>';
      } else {
        svg += '<circle cx="' + (x + bw / 2) + '" cy="' + (H - B) + '" r="1.5" fill="var(--line)"/>';
      }
      var every = n <= 7 ? 1 : n <= 31 ? 5 : 10;
      if ((n - 1 - i) % every === 0) {
        svg += '<text x="' + (x + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + d.getDate() + '.' + pad(d.getMonth() + 1) + '</text>';
      }
    }
    svg += '</svg>';
    return any ? svg : '<div class="empty">Нет законченных наборов ' + periodWord() + '.</div>';
  }

  function topics(list) {
    var c = {};
    list.forEach(function (r) {
      if (r.kind === 'mult') return;
      r.wrong.forEach(function (w) {
        var tp = w.replace(/^№\d+\s*/, '').trim();
        if (tp) c[tp] = (c[tp] || 0) + 1;
      });
    });
    var arr = Object.keys(c).map(function (k) { return [k, c[k]]; })
      .sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0], 'ru'); }).slice(0, 8);
    if (!arr.length) return '<div class="empty">Ошибок ' + periodWord() + ' нет — или наборов ещё не было.</div>';
    var max = arr[0][1];
    return arr.map(function (a) {
      return '<div class="topic"><span class="nm" title="' + esc(a[0]) + '">' + esc(a[0]) + '</span>' +
             '<span class="track"><b style="width:' + Math.round(a[1] / max * 100) + '%"></b></span>' +
             '<span class="n">' + a[1] + '</span></div>';
    }).join('');
  }

  // Таблица умножения: какие примеры чаще всего не вспоминаются
  function multFacts(list) {
    var c = {};
    list.forEach(function (r) {
      if (r.kind !== 'mult') return;
      r.wrong.forEach(function (w) {
        var f = w.replace(/\s*\(.*\)$/, '').trim();
        if (f) c[f] = (c[f] || 0) + 1;
      });
    });
    var arr = Object.keys(c).map(function (k) { return [k, c[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; }).slice(0, 12);
    if (!arr.length) return '';
    return '<div class="card" style="margin-bottom:14px"><h3>Трудные примеры таблицы умножения <small>' +
      periodWord() + '</small></h3><div class="errs">' + arr.map(function (a) {
        return '<span class="chip" style="font-size:13px;padding:3px 9px">' + esc(a[0]) +
               (a[1] > 1 ? ' · ' + a[1] : '') + '</span>';
      }).join('') + '</div></div>';
  }

  function papers(list) {
    var by = {};
    list.filter(function (r) { return !r.partial && (r.kind === 'paper' || r.kind === 'exam' || r.kind === 'assess'); })
      .forEach(function (r) {
        var b = by[r.set] || (by[r.set] = { name: r.name, kind: r.kind, tries: 0, best: null, last: r });
        b.tries++;
        if (!b.best || (r.pct || 0) > (b.best.pct || 0)) b.best = r;
      });
    var arr = Object.keys(by).map(function (k) { return by[k]; })
      .sort(function (a, b) { return b.last.t - a.last.t; });
    if (!arr.length) return '<div class="empty">Олимпиад и экзаменов пока не было.</div>';
    return '<table><tr><th>Работа</th><th>Лучший</th><th>Попыток</th><th>Последний раз</th></tr>' +
      arr.map(function (b) {
        var r = b.best;
        var res = r.max ? r.score + ' / ' + r.max : r.ok + ' / ' + r.total;
        return '<tr><td><span class="kind k-' + b.kind + '">' + KIND[b.kind] + '</span>' + esc(b.name) + '</td>' +
               '<td><span class="pill p-' + lvl(r.pct) + '">' + res + '</span></td>' +
               '<td>' + b.tries + '</td><td>' + rel(b.last.t) + '</td></tr>';
      }).join('') + '</table>';
  }

  function journal(list) {
    var f = S.kind === 'all' ? list : list.filter(function (r) { return r.kind === S.kind; });
    if (!f.length) return '<div class="empty">Ничего не найдено ' + periodWord() + '.</div>';
    var groups = [], cur = null;
    f.forEach(function (r) {
      if (!cur || cur.key !== r.key) { cur = { key: r.key, list: [] }; groups.push(cur); }
      cur.list.push(r);
    });
    return groups.map(function (g) {
      var st = stats(g.list);
      return '<div class="day"><div class="dayh"><span>' + dayTitle(g.key) + '</span><span>' +
             g.list.length + ' ' + plural(g.list.length, 'набор', 'набора', 'наборов') +
             (st.acc != null ? ' · ' + pctTxt(st.acc) : '') + '</span></div>' +
             g.list.map(row).join('') + '</div>';
    }).join('');
  }

  function row(r) {
    var id = r.t + r.set;
    var res = r.partial ? 'верно <b>' + r.ok + '</b> из ' + r.done
            : r.max ? '<b>' + r.score + '</b> / ' + r.max + ' б.' : '<b>' + r.ok + '</b> из ' + r.total;
    var unfinished = r.partial ? '<span class="open">не закончен · решено ' + r.done + ' из ' + r.total + '</span>' : '';
    var errs = '';
    if (r.wrong.length) {
      var open = S.open[id], shown = open ? r.wrong : r.wrong.slice(0, 4);
      errs = '<div class="errs">' + shown.map(function (w) { return '<span class="chip">' + esc(w) + '</span>'; }).join('') +
             (r.wrong.length > 4 ? '<button class="more" data-more="' + esc(id) + '">' +
               (open ? 'свернуть' : 'ещё ' + (r.wrong.length - 4)) + '</button>' : '') + '</div>';
    }
    return '<div class="row"><span class="tm">' + hm(new Date(r.t)) + '</span>' +
      '<div style="min-width:0"><div class="tt"><span class="kind k-' + r.kind + '">' + KIND[r.kind] + '</span>' +
      esc(r.name) + '</div>' + unfinished + errs + '</div>' +
      '<div class="res"><div class="txt"><span>' + res + '</span><span class="' + lvl(r.pct) + '">' + pctTxt(r.pct) + '</span></div>' +
      '<div class="track res-t' + (r.partial ? ' part' : '') + '"><b class="' + lvl(r.pct) + '" style="width:' +
        Math.round((r.partial ? (r.total ? r.done / r.total : 0) : (r.pct || 0)) * 100) + '%"></b></div></div>' +
      '<span class="mn">' + (r.min ? Math.round(r.min) + ' мин' : '') + '</span></div>';
  }

  /* -------------------------------------------------------- экраны --- */

  function overview() {
    if (!names.length) {
      return '<div class="card"><div class="empty">Пока ни одного законченного набора. Как только ребёнок ' +
             'закончит день программы или олимпиаду, он появится здесь.</div></div>';
    }
    return '<div class="grid g2">' + names.map(function (who) {
      var all = of(who), list = inPeriod(all), st = stats(list), sk = streak(all);
      var last = all[0], gap = daysAgo(last.t);
      return '<div class="card kid" data-who="' + esc(who) + '"><div class="head"><div class="ava">' +
        esc(who === '?' ? '?' : who.charAt(0)) + '</div><div><div class="name">' + esc(who === '?' ? 'Без имени' : who) +
        '</div><div class="seen ' + (gap >= 3 ? 'bad' : gap === 2 ? 'mid' : '') + '">' + rel(last.t) + '</div></div></div>' +
        '<div class="mini"><div><b>' + (sk ? sk + ' 🔥' : '0') + '</b><span>дней подряд</span></div>' +
        '<div><b>' + st.sets + '</b><span>наборов ' + (S.period ? 'за ' + S.period + ' дн.' : 'всего') + '</span></div>' +
        '<div><b class="' + lvl(st.acc) + '">' + pctTxt(st.acc) + '</b><span>верно</span></div></div>' +
        heatmap(all, 12) + '</div>';
    }).join('') + '</div>';
  }

  function child(who) {
    var all = of(who), list = inPeriod(all), st = stats(list), sk = streak(all);
    var best = 0, run = 0, days = {};
    all.forEach(function (r) { days[r.key] = 1; });
    Object.keys(days).sort().forEach(function (k, i, arr) {
      var prev = i ? new Date(arr[i - 1] + 'T12:00:00') : null;
      run = prev && Math.round((new Date(k + 'T12:00:00') - prev) / DAY) === 1 ? run + 1 : 1;
      if (run > best) best = run;
    });
    var gap = all.length ? daysAgo(all[0].t) : null;
    return '<div class="kpis">' +
      kpi(all.length ? (gap === 0 ? 'сегодня' : gap === 1 ? 'вчера' : rel(all[0].t)) : '—', 'последнее занятие',
          all.length ? (gap >= 3 ? 'перерыв ' + gap + ' дн. · ' : '') + 'в ' + hm(new Date(all[0].t)) : '', gap >= 3 ? 'bad' : '') +
      kpi(sk + (sk ? ' 🔥' : ''), 'дней подряд', 'рекорд — ' + best) +
      kpi(st.sets, 'наборов закончено ' + periodWord(), st.days + ' ' + plural(st.days, 'день', 'дня', 'дней') + ' с занятиями' +
          (st.open ? ' · ещё ' + st.open + ' не ' + plural(st.open, 'закончен', 'закончены', 'закончены') : '')) +
      kpi(pctTxt(st.acc), 'верных ответов', periodWord(), lvl(st.acc)) +
      kpi(st.min ? dur(st.min) : '—', 'время с таймером', 'экзамены, олимпиады, таблица умножения') +
      '</div>' +
      '<div class="grid g2" style="margin-bottom:14px">' +
        '<div class="card"><h3>Календарь занятий <small>16 недель</small></h3>' + heatmap(all, 16) + '</div>' +
        '<div class="card"><h3>Точность по дням <small>' + periodWord() + '</small></h3>' + accChart(list) + '</div>' +
      '</div>' +
      '<div class="grid g2" style="margin-bottom:14px">' +
        '<div class="card"><h3>Где ошибается <small>темы ' + periodWord() + '</small></h3>' + topics(list) + '</div>' +
        '<div class="card"><h3>Олимпиады и экзамены <small>лучший результат</small></h3>' + papers(all) + '</div>' +
      '</div>' +
      multFacts(list) +
      '<div class="card"><h3>Журнал <small>' + periodWord() + '</small></h3>' +
        '<div style="margin:-2px 0 10px">' + seg('kind', [['all', 'Все'], ['day', 'Программа'], ['exam', 'Экзамены'],
          ['paper', 'Олимпиады'], ['assess', 'Замер'], ['mult', 'Умножение']].filter(function (k) {
            return k[0] === 'all' || k[0] === S.kind || all.some(function (r) { return r.kind === k[0]; });
          }), S.kind) + '</div>' + journal(list) + '</div>';
  }

  function render() {
    var upd = new Date(DATA.now);
    app.innerHTML = '<div class="wrap"><div class="top"><div><h1>' +
      (S.who ? esc(S.who === '?' ? 'Без имени' : S.who) : 'Прогресс учеников') + '</h1>' +
      '<div class="upd">Данные на ' + upd.getDate() + ' ' + MON[upd.getMonth()] + ', ' + hm(upd) +
      ' · обновите страницу, чтобы увидеть новые</div></div>' +
      seg('who', [['', 'Все']].concat(names.map(function (n) { return [n, n === '?' ? 'Без имени' : n]; })), S.who) +
      '</div><div class="bar"><span></span>' +
      seg('period', [[7, '7 дней'], [30, '30 дней'], [0, 'Всё время']], S.period) + '</div>' +
      (S.who ? child(S.who) : overview()) +
      '<div class="foot">Строка в журнале — один законченный набор задач. ' +
      'Данные — лист «Журнал» в Google Таблице.</div></div>';
  }

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-who],[data-period],[data-kind],[data-more]');
    if (!el) return;
    if (el.hasAttribute('data-who')) { S.who = el.getAttribute('data-who'); S.kind = 'all'; window.scrollTo(0, 0); }
    else if (el.hasAttribute('data-period')) S.period = +el.getAttribute('data-period');
    else if (el.hasAttribute('data-kind')) S.kind = el.getAttribute('data-kind');
    else { var id = el.getAttribute('data-more'); S.open[id] = !S.open[id]; }
    render();
  });

  render();
}

/* ----------------------------------------------------------- мелочи --- */

function clip_(s, n) { return String(s == null ? '' : s).slice(0, n); }
function num_(x) { return typeof x === 'number' && isFinite(x) ? x : ''; }
function text_(s) { return ContentService.createTextOutput(s); }
