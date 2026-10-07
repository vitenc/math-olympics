/* Журнал прогресса в Google Таблицу: адрес веб-приложения Apps Script.

   Пока поле пустое, тренажёр ничего никуда не отправляет.

   Как включить — tools/progress-sheet/README.md. Коротко: создать таблицу,
   вставить tools/progress-sheet/Code.gs в Apps Script, развернуть как
   веб-приложение и вписать сюда его адрес (…/exec).

   Адрес публичный — он виден любому, кто откроет сайт. По нему можно только
   дописать строку в журнал; чтобы смотреть отчёт, нужен ещё секретный
   ключ, а он хранится в свойствах скрипта, не в репозитории. */

window.SASMO_LOG_CONFIG = {
  url: 'https://script.google.com/macros/s/AKfycbxMzCYLviUR6y2JUSlGbN1PCXWKy8N91otep-0FxFXgfr2OfDqYbCPuvTowmIOb4sjSCQ/exec'
};
