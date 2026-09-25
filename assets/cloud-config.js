/* Облако (Supabase): адрес проекта и публичный ключ.

   Пока поля пустые, тренажёр работает как раньше — только в этом браузере,
   без аккаунтов, и никуда ничего не отправляет.

   Как включить — supabase/README.md. Коротко: создать проект Supabase,
   выполнить supabase/schema.sql, вписать сюда Project URL и anon (public) key.

   anon key — публичный: он и так виден любому, кто откроет сайт, а доступ
   к данным держат правила RLS из schema.sql. Ключ service_role сюда (и
   вообще в репозиторий) класть нельзя никогда: он обходит все правила. */

window.SASMO_CLOUD_CONFIG = {
  url: '',          // https://<project>.supabase.co
  anonKey: ''       // Project Settings → API → anon public
};
