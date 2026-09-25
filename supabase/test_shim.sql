-- Имитация окружения Supabase для локальной проверки schema.sql на чистом
-- PostgreSQL: роли anon/authenticated, схема auth и auth.uid(), который
-- читает «вошедшего пользователя» из настройки request.jwt.claim.sub —
-- так же, как это делает PostgREST в Supabase.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key, email text);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth, public to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
