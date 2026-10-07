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
            'Ошибки в задачах', 'Устройство', 'id'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold');
  }
  return sh;
}

function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return text_('bad json'); }
  if (!d || !d.id || !d.set) return text_('bad row');

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_();
    // повтор той же строки (сеть оборвалась после записи) — пропускаем
    var last = sh.getLastRow();
    if (last > 1) {
      var from = Math.max(2, last - 500);
      var ids = sh.getRange(from, HEAD.length, last - from + 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) if (ids[i][0] === d.id) return text_('dup');
    }
    sh.appendRow([
      new Date(d.ts || Date.now()), clip_(d.who, 40), d.grade || '', clip_(d.set, 40),
      clip_(d.title, 120), clip_(d.mode, 20),
      num_(d.ok), num_(d.no), num_(d.total), num_(d.score), num_(d.max),
      d.spent === '' || d.spent == null ? '' : Math.round(Number(d.spent) / 6) / 10,
      clip_((d.wrong || []).join('; '), 2000), clip_(d.device, 10), clip_(d.id, 20)
    ]);
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
  var html = report_(p.who || '', key);
  return HtmlService.createHtmlOutput(html)
    .setTitle('Прогресс')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ------------------------------------------------------------- отчёт --- */

function report_(onlyWho, key) {
  var sh = sheet_();
  var n = sh.getLastRow() - 1;
  var rows = n > 0 ? sh.getRange(2, 1, n, HEAD.length).getValues() : [];
  var tz = Session.getScriptTimeZone();

  var byWho = {};
  rows.forEach(function (r) {
    var who = String(r[1] || '?');
    (byWho[who] = byWho[who] || []).push(r);
  });
  var names = Object.keys(byWho).sort();

  var out = [];
  out.push('<style>' +
    'body{font:15px/1.45 system-ui,sans-serif;margin:16px;color:#1d2733;background:#fff}' +
    'h1{font-size:22px;margin:0 0 4px}h2{font-size:18px;margin:28px 0 8px}' +
    '.sub{color:#667;margin-bottom:12px}.tabs a{margin-right:10px}' +
    '.cards{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}' +
    '.card{border:1px solid #dde3ea;border-radius:10px;padding:8px 12px;min-width:110px}' +
    '.card b{display:block;font-size:20px}' +
    'table{border-collapse:collapse;width:100%;font-size:14px}' +
    'td,th{border-bottom:1px solid #eee;padding:5px 6px;text-align:left;vertical-align:top}' +
    'th{color:#667;font-weight:600}.w{color:#a33;font-size:12px}' +
    '.good{color:#1a7f37;font-weight:600}.mid{color:#9a6700;font-weight:600}.bad{color:#cf222e;font-weight:600}' +
    '</style>');
  out.push('<h1>Прогресс</h1><div class="sub">Обновлено ' +
           Utilities.formatDate(new Date(), tz, 'dd.MM.yyyy HH:mm') + '</div>');

  var base = ScriptApp.getService().getUrl() + '?key=' + encodeURIComponent(key);
  out.push('<div class="tabs"><a href="' + base + '" target="_top">Все</a>' +
    names.map(function (w) {
      return '<a href="' + base + '&who=' + encodeURIComponent(w) + '" target="_top">' + esc_(w) + '</a>';
    }).join('') + '</div>');

  if (!names.length) out.push('<p>Пока ни одного законченного набора.</p>');

  names.forEach(function (who) {
    if (onlyWho && who !== onlyWho) return;
    var list = byWho[who].slice().sort(function (a, b) { return b[0] - a[0]; });

    // дни, когда что-то закончено, — для серии и активности за неделю
    var days = {};
    list.forEach(function (r) { days[Utilities.formatDate(new Date(r[0]), tz, 'yyyy-MM-dd')] = true; });
    var streak = 0, d = new Date();
    if (!days[Utilities.formatDate(d, tz, 'yyyy-MM-dd')]) d.setDate(d.getDate() - 1);   // сегодня ещё не занимался
    while (days[Utilities.formatDate(d, tz, 'yyyy-MM-dd')]) { streak++; d.setDate(d.getDate() - 1); }
    var weekAgo = Date.now() - 7 * 864e5;
    var week = list.filter(function (r) { return new Date(r[0]).getTime() >= weekAgo; });
    var okSum = 0, totSum = 0;
    week.forEach(function (r) { okSum += Number(r[6]) || 0; totSum += Number(r[8]) || 0; });

    out.push('<h2>' + esc_(who) + '</h2><div class="cards">' +
      card_('последний раз', Utilities.formatDate(new Date(list[0][0]), tz, 'dd.MM HH:mm')) +
      card_('дней подряд', streak) +
      card_('наборов за 7 дней', week.length) +
      card_('верно за 7 дней', totSum ? Math.round(okSum / totSum * 100) + '%' : '—') +
      card_('всего наборов', list.length) +
      '</div>');

    out.push('<table><tr><th>Когда</th><th>Набор</th><th>Результат</th><th>Мин</th></tr>');
    list.slice(0, onlyWho ? 200 : 30).forEach(function (r) {
      var res = r[9] !== '' && r[10] !== ''
        ? r[9] + ' / ' + r[10] + ' баллов'
        : r[6] + ' из ' + r[8];
      var pct = r[10] ? Number(r[9]) / Number(r[10]) : (Number(r[8]) ? Number(r[6]) / Number(r[8]) : 0);
      var cls = pct >= 0.85 ? 'good' : pct >= 0.6 ? 'mid' : 'bad';
      out.push('<tr><td>' + Utilities.formatDate(new Date(r[0]), tz, 'dd.MM HH:mm') + '</td>' +
        '<td>' + esc_(r[4] || r[3]) + (r[12] ? '<div class="w">Ошибки: ' + esc_(r[12]) + '</div>' : '') + '</td>' +
        '<td class="' + cls + '">' + esc_(res) + '</td>' +
        '<td>' + esc_(r[11]) + '</td></tr>');
    });
    out.push('</table>');
  });

  return out.join('\n');
}

/* ----------------------------------------------------------- мелочи --- */

function card_(label, value) {
  return '<div class="card"><b>' + esc_(value) + '</b>' + esc_(label) + '</div>';
}
function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
function clip_(s, n) { return String(s == null ? '' : s).slice(0, n); }
function num_(x) { return typeof x === 'number' && isFinite(x) ? x : ''; }
function text_(s) { return ContentService.createTextOutput(s); }
