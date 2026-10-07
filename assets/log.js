/* ==========================================================================
   Журнал прогресса: каждый законченный набор — строка в Google Таблице

   Прогресс детей живёт в localStorage своего устройства. Чтобы взрослый
   видел его со своего, движок (SASMO storeDone) после каждого законченного
   набора — день программы, экзамен, замер, олимпиада — зовёт
   SASMO_LOG.done(...), и строка уходит в веб-приложение Apps Script
   (tools/progress-sheet/Code.gs), а оттуда — в таблицу и в отчёт.

   Без адреса в assets/log-config.js модуль молчит: enabled() — false.

   Кто решает:
     • на странице работы (paper.html?who=dima) — тот, кто выбран там;
     • в программе — имя этого устройства, выбранное один раз на хабе
       (ключ log.who). Не выбрано — в журнал пишется «?».

   Нет сети — строка ждёт в очереди (log.queue) и уходит при следующем
   открытии любой страницы. Ответ Apps Script прочитать нельзя (no-cors),
   поэтому «отправлено» = запрос дошёл до сети; повтор той же строки
   таблица отбрасывает по id.
   ========================================================================== */

window.SASMO_LOG = (function () {
  'use strict';

  var CFG = window.SASMO_LOG_CONFIG || {};
  var URL_ = String(CFG.url || '').trim();
  var WHO_KEY = 'log.who';
  var DEVICE_KEY = 'log.device';
  var QUEUE_KEY = 'log.queue';
  var MAX_QUEUE = 200;

  var pageWho = null;          // решающий, выбранный на странице работы
  var sending = false;

  function get(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function put(k, v) {
    try {
      if (v === null || v === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (e) { /* пусто */ }
  }

  function enabled() { return !!URL_ && typeof fetch === 'function'; }

  function deviceWho() { return get(WHO_KEY) || ''; }
  function setDeviceWho(name) { put(WHO_KEY, name ? String(name).slice(0, 40) : null); }
  function setWho(name) { pageWho = name || null; }

  // Короткий код устройства — различать планшет и компьютер одного ребёнка
  function device() {
    var d = get(DEVICE_KEY);
    if (!d) {
      d = Math.random().toString(36).slice(2, 8);
      put(DEVICE_KEY, d);
    }
    return d;
  }

  function queue() {
    try { return JSON.parse(get(QUEUE_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveQueue(q) {
    put(QUEUE_KEY, q.length ? JSON.stringify(q.slice(-MAX_QUEUE)) : null);
  }

  function flush() {
    if (!enabled() || sending) return;
    var q = queue();
    if (!q.length) return;
    sending = true;
    var row = q[0];
    fetch(URL_, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row)
    }).then(function () {
      saveQueue(queue().filter(function (r) { return r.id !== row.id; }));
      sending = false;
      flush();
    }, function () {
      sending = false;           // нет сети — попробуем при следующем открытии
    });
  }

  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* Строка о наборе. status: 'partial' — набор ещё идёт (таблица обновит
     строку с тем же id), 'done' — набор закончен. Поля — из движка
     (Quiz logRow в assets/quiz.js). */
  function done(info) {
    if (!enabled()) return;
    var row = {
      id: info.id || newId(),
      status: info.status || 'done',
      ts: new Date().toISOString(),
      who: pageWho || deviceWho() || '?',
      device: device(),
      grade: info.grade || '',
      set: info.setId,
      title: info.title || '',
      mode: info.mode || '',
      ok: info.ok, no: info.no, total: info.total,
      score: typeof info.score === 'number' ? info.score : '',
      max: typeof info.max === 'number' ? info.max : '',
      spent: typeof info.spent === 'number' ? Math.round(info.spent) : '',
      wrong: info.wrong || []
    };
    // В очереди нужна только последняя версия строки: старую выкидываем
    var q = queue().filter(function (r) { return r.id !== row.id; });
    q.push(row);
    saveQueue(q);
    flush();
  }

  if (enabled()) setTimeout(flush, 1500);

  return {
    enabled: enabled,
    done: done,
    newId: newId,
    flush: flush,
    setWho: setWho,
    deviceWho: deviceWho,
    setDeviceWho: setDeviceWho,
    pending: function () { return queue().length; }
  };
})();
