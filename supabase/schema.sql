-- ============================================================================
-- Olympiad Sprint — схема облака (Supabase / PostgreSQL)
--
-- Кто есть кто:
--   взрослый (родитель или учитель) — пользователь Supabase Auth, входит по
--   коду из письма. У ребёнка аккаунта и почты нет: это «профиль ученика»
--   с псевдонимом, который принадлежит взрослому.
--
-- Что хранится о ребёнке: псевдоним, класс (2 или 3), когда и кем дано
-- согласие, и прогресс тренажёра как есть (ответы, время, журнал ошибок) —
-- таблица kv, ключ = ключ localStorage без приставки профиля.
-- Ни имени, ни даты рождения, ни почты ребёнка здесь нет — и не должно быть.
--
-- Доступ (RLS):
--   * взрослый видит и меняет только своих учеников и их прогресс;
--   * учитель видит учеников своих классов и их прогресс — только чтение;
--   * войти в класс можно только по коду класса (функция join_class);
--   * удаление ученика удаляет и весь его прогресс (on delete cascade).
--
-- Применить: Supabase → SQL Editor → вставить файл целиком → Run.
-- Файл можно запускать повторно: всё создаётся через if not exists / or replace.
-- ============================================================================


-- ---------------------------------------------------------------- таблицы ---

create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  role            text not null default 'parent' check (role in ('parent', 'teacher')),
  display_name    text check (char_length(display_name) <= 60),
  consent_version text,                 -- какую редакцию условий принял взрослый
  consent_at      timestamptz,
  created_at      timestamptz not null default now()
);

create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nickname    text not null check (char_length(nickname) between 1 and 40),
  grade       int  not null check (grade in (2, 3)),
  consent_by  text not null check (consent_by in ('parent', 'school')),
  consent_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index if not exists students_owner on public.students (owner_id);

-- Код класса: шесть знаков без похожих друг на друга (0/O, 1/I/L)
create or replace function public.new_join_code() returns text
language sql volatile as $$
  select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789',
                           1 + floor(random() * 31)::int, 1), '')
  from generate_series(1, 6)
$$;

create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 60),
  grade       int  check (grade in (2, 3)),
  join_code   text not null unique default public.new_join_code(),
  created_at  timestamptz not null default now()
);
create index if not exists classes_teacher on public.classes (teacher_id);

create table if not exists public.class_members (
  class_id    uuid not null references public.classes (id) on delete cascade,
  student_id  uuid not null references public.students (id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (class_id, student_id)
);
create index if not exists class_members_student on public.class_members (student_id);

create table if not exists public.kv (
  student_id  uuid not null references public.students (id) on delete cascade,
  key         text not null check (char_length(key) <= 80),
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (student_id, key)
);

-- Время записи ставит сервер: часы планшета в классе могут врать
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists kv_touch on public.kv;
create trigger kv_touch before insert or update on public.kv
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------ проверки доступа ---
-- security definer: иначе проверка внутри политики сама упрётся в RLS
-- соседней таблицы и уйдёт в рекурсию.

create or replace function public.owns_student(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from students where id = s and owner_id = auth.uid())
$$;

create or replace function public.teaches_student(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from class_members m join classes c on c.id = m.class_id
    where m.student_id = s and c.teacher_id = auth.uid())
$$;

create or replace function public.owns_class(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from classes where id = c and teacher_id = auth.uid())
$$;

-- ------------------------------------------------------------------- RLS ---

alter table public.profiles      enable row level security;
alter table public.students      enable row level security;
alter table public.classes       enable row level security;
alter table public.class_members enable row level security;
alter table public.kv            enable row level security;

-- профиль взрослого: только свой
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- ученики: свои — полностью, ученики своих классов — только чтение
drop policy if exists students_owner on public.students;
create policy students_owner on public.students
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists students_teacher_read on public.students;
create policy students_teacher_read on public.students
  for select using (public.teaches_student(id));

-- классы: учитель — полностью свои
drop policy if exists classes_teacher on public.classes;
create policy classes_teacher on public.classes
  for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- состав класса: видят учитель и владелец ученика; добавить напрямую может
-- учитель, если и класс, и ученик его (школа завела ученика сама); родитель
-- входит в класс только через join_class; выйти могут оба
drop policy if exists members_read on public.class_members;
create policy members_read on public.class_members
  for select using (public.owns_class(class_id) or public.owns_student(student_id));
drop policy if exists members_teacher_add on public.class_members;
create policy members_teacher_add on public.class_members
  for insert with check (public.owns_class(class_id) and public.owns_student(student_id));
drop policy if exists members_leave on public.class_members;
create policy members_leave on public.class_members
  for delete using (public.owns_class(class_id) or public.owns_student(student_id));

-- прогресс: владелец — полностью, учитель класса — только чтение
drop policy if exists kv_owner on public.kv;
create policy kv_owner on public.kv
  for all using (public.owns_student(student_id)) with check (public.owns_student(student_id));
drop policy if exists kv_teacher_read on public.kv;
create policy kv_teacher_read on public.kv
  for select using (public.teaches_student(student_id));

-- ------------------------------------------------------ вход в класс ------

-- Родитель вводит код, который дал учитель. Возвращает название класса.
create or replace function public.join_class(code text, student uuid) returns text
language plpgsql security definer set search_path = public as $$
declare
  c classes%rowtype;
begin
  if not public.owns_student(student) then
    raise exception 'not your student' using errcode = '42501';
  end if;
  select * into c from classes where join_code = upper(trim(code));
  if not found then
    raise exception 'no such class' using errcode = 'P0002';
  end if;
  insert into class_members (class_id, student_id) values (c.id, student)
    on conflict do nothing;
  return c.name;
end $$;

-- Классы ученика — родителю, чтобы видеть, куда ребёнок записан
create or replace function public.student_classes(student uuid)
returns table (class_id uuid, name text)
language sql stable security definer set search_path = public as $$
  select c.id, c.name from class_members m join classes c on c.id = m.class_id
  where m.student_id = student and public.owns_student(student)
$$;

revoke all on function public.join_class(text, uuid) from public, anon;
grant execute on function public.join_class(text, uuid) to authenticated;
revoke all on function public.student_classes(uuid) from public, anon;
grant execute on function public.student_classes(uuid) to authenticated;

grant select, insert, update, delete on public.profiles, public.students, public.classes,
  public.class_members, public.kv to authenticated;
revoke all on public.profiles, public.students, public.classes,
  public.class_members, public.kv from anon;
