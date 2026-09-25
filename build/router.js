/* ==========================================================================
   Маршрутизатор одностраничной сборки (sasmo-month.html)

   Сборка не несёт своей копии страниц и движка: build/build.js кладёт в неё
   разметку и скрипты настоящих index.html, day.html, exam.html и errors.html,
   а этот файл показывает их по очереди, без перезагрузки:

     #/index.html            хаб
     #/day.html?d=04         занятие
     #/exam.html?e=1         пробный экзамен
     #/errors.html           журнал ошибок

   Старые адреса сборки (#/, #/day/4, #/exam/1, #/errors) понимаются тоже.

   Страница читает адрес через SASMO.params() и перезагружается через
   SASMO.reload() — оба смотрят в window.SASMO_ROUTE, который кладётся здесь.
   Ссылки вида day.html?d=04 внутри страниц перехватываются и становятся
   переходом по хешу.
   ========================================================================== */

(function () {
  'use strict';

  var B = window.SASMO_BUNDLE;
  var mount = document.getElementById('page');
  var current = { name: 'index', search: '' };

  var PAGE_LINK = /^(index|day|exam|errors)\.html(\?[^#]*)?(#.*)?$/;

  /* Класс сборки зашит: второй класс получает ?g=2 в каждый адрес, чтобы
     страницы брали свою программу и свои ключи хранения. */
  function withGrade(search) {
    var p = new URLSearchParams(search);
    if (B.grade !== 3) p.set('g', String(B.grade));
    else p.delete('g');
    var s = p.toString();
    return s ? '?' + s : '';
  }

  function parse(hash) {
    var h = String(hash || '').replace(/^#\/?/, '');
    var m;
    if (!h) return { name: 'index', search: '' };
    if ((m = /^day\/(\d+)$/.exec(h))) return { name: 'day', search: '?d=' + m[1] };
    if ((m = /^exam\/(\d+)$/.exec(h))) return { name: 'exam', search: '?e=' + m[1] };
    if (h === 'errors') return { name: 'errors', search: '' };
    if ((m = PAGE_LINK.exec(h))) return { name: m[1], search: m[2] || '' };
    return { name: 'index', search: '' };
  }

  window.SASMO_ROUTE = {
    search: function () { return withGrade(current.search); },
    reload: function () { show(); }
  };

  /* Прогресс прежней сборки лежал одним объектом под своим ключом
     (keys.single). Теперь сборка пишет туда же, куда и отдельные страницы, —
     переносим старое один раз, если на новом месте пусто. */
  function migrate() {
    var plan = window.PLANS[B.grade];
    if (!plan || !plan.keys || !plan.keys.single) return;
    try {
      var old = JSON.parse(localStorage.getItem(plan.keys.single) || 'null');
      if (!old || typeof old !== 'object') return;
      if (localStorage.getItem(plan.keys.progress) || localStorage.getItem(plan.keys.errors)) return;
      if (old.days && typeof old.days === 'object') {
        localStorage.setItem(plan.keys.progress, JSON.stringify(old.days));
      }
      if (Array.isArray(old.errors)) {
        localStorage.setItem(plan.keys.errors, JSON.stringify(old.errors));
      }
    } catch (e) { /* хранилище недоступно — переносить некуда */ }
  }

  function show() {
    current = parse(location.hash);
    var page = B.pages[current.name] || B.pages.index;

    window.SASMO.stop();                 // гасим прежний набор: таймер, панель, слушатели
    document.body.className = '';
    document.title = page.title;
    mount.innerHTML = page.body;
    window.I18N.decorate(mount);         // шапка и переводы — до скрипта страницы, как на сайте
    page.run();
    if (typeof window.scrollTo === 'function') {
      try { window.scrollTo(0, 0); } catch (e) { /* jsdom */ }
    }
  }

  document.addEventListener('click', function (ev) {
    if (ev.defaultPrevented || ev.button > 0 || ev.metaKey || ev.ctrlKey) return;
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    var m = PAGE_LINK.exec(a.getAttribute('href'));
    if (!m) return;
    ev.preventDefault();
    var next = '#/' + m[1] + '.html' + (m[2] || '');
    if (location.hash === next) show();
    else location.hash = next;
  });

  window.addEventListener('hashchange', show);

  migrate();
  show();
})();
