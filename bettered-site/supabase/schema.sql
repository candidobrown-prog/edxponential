-- BetterEd School Health Index: database schema (Supabase / Postgres 17).
-- Accounts come from Supabase Auth. A trigger copies the sign-up form (sent as user metadata)
-- into public.profiles. Each person gets one School Health Index (public.shi_submissions).
-- Row-level security: people can read and edit only their own rows; staff use the dashboard.

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  phone text check (phone is null or char_length(phone) <= 40),
  best_time text check (best_time is null or char_length(best_time) <= 60),
  role text not null check (char_length(role) between 1 and 80),
  role_other text check (role_other is null or char_length(role_other) <= 120),
  heard_from text not null check (char_length(heard_from) between 1 and 80),
  heard_other text check (heard_other is null or char_length(heard_other) <= 200),
  state text not null check (state ~ '^[A-Z]{2}$'),
  city text not null check (char_length(city) between 1 and 120),
  school_nces_id text check (school_nces_id is null or school_nces_id ~ '^[0-9]{12}$'),
  school_name text not null check (char_length(school_name) between 1 and 200),
  school_listed boolean not null default true,
  budget text not null check (budget in ('$5,000–$10,000', '$10,000–$25,000', '$25,000–$50,000', '$50,000–$75,000', '$75,000–$100,000', 'Over $100,000')),
  interest text check (interest is null or char_length(interest) <= 80),
  terms_version text not null,
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles: read own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (first_name, last_name, phone, best_time, role, role_other, city, school_nces_id, school_name, school_listed, budget, interest) on public.profiles to authenticated;

-- Copy the sign-up form into profiles. Only for School Health Index sign-ups (meta.shi_signup = true).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare m jsonb := new.raw_user_meta_data;
begin
  if coalesce((m ->> 'shi_signup')::boolean, false) then
    insert into public.profiles (id, email, first_name, last_name, phone, best_time, role, role_other, heard_from, heard_other,
      state, city, school_nces_id, school_name, school_listed, budget, interest, terms_version)
    values (new.id, new.email, trim(m ->> 'first_name'), trim(m ->> 'last_name'), nullif(trim(m ->> 'phone'), ''), nullif(m ->> 'best_time', ''),
      m ->> 'role', nullif(trim(m ->> 'role_other'), ''), m ->> 'heard_from', nullif(trim(m ->> 'heard_other'), ''),
      upper(m ->> 'state'), trim(m ->> 'city'), nullif(m ->> 'school_nces_id', ''), trim(m ->> 'school_name'),
      coalesce((m ->> 'school_listed')::boolean, true), m ->> 'budget', nullif(m ->> 'interest', ''), m ->> 'terms_version');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- School Health Index submissions (one per person) ----------
create table public.shi_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'in_review', 'report_sent')),
  answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) < 100000),
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  reviewed_by text,
  report_sent_at timestamptz,
  staff_notes text
);
alter table public.shi_submissions enable row level security;
create policy "shi: read own" on public.shi_submissions for select to authenticated using ((select auth.uid()) = user_id);
create policy "shi: start own" on public.shi_submissions for insert to authenticated with check ((select auth.uid()) = user_id and status = 'draft');
create policy "shi: edit own draft" on public.shi_submissions for update to authenticated
  using ((select auth.uid()) = user_id and status = 'draft')
  with check ((select auth.uid()) = user_id and status in ('draft', 'submitted'));
revoke insert, update, delete on public.shi_submissions from anon, authenticated;
grant select on public.shi_submissions to authenticated;
grant insert (user_id, answers) on public.shi_submissions to authenticated;
grant update (answers, status) on public.shi_submissions to authenticated;

-- Timestamps, and a completeness check when a draft is submitted.
create or replace function public.shi_before_update() returns trigger
language plpgsql set search_path = '' as $$
declare missing int;
begin
  new.updated_at := now();
  if new.status = 'submitted' and old.status = 'draft' then
    select count(*) into missing from (
      select k from unnest(array['c_type','c_grades','c_enroll','c_tenure','c_status','c_urgency','o_keeping','o_first']) k
      where coalesce(new.answers ->> k, '') = ''
    ) x;
    if missing > 0 then raise exception 'School Health Index is incomplete' using errcode = 'check_violation'; end if;
    new.submitted_at := now();
  end if;
  return new;
end $$;
create trigger shi_before_update before update on public.shi_submissions for each row execute function public.shi_before_update();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- ---------- Scores (for staff review) ----------
-- Agreement answers are stored as 1-5 (0 = don't know, excluded). Domain score = mean mapped to 0-100.
create view public.shi_domain_scores with (security_invoker = true) as
select s.id as submission_id, s.user_id, substring(a.key from 2 for 2) as domain,
       round(avg((a.value::int - 1) * 25.0)) as score, count(*) as answered
from public.shi_submissions s, jsonb_each_text(s.answers) a
where a.key ~ '^d[0-9]{2}_[0-9]$' and a.value ~ '^[1-5]$'
group by s.id, s.user_id, substring(a.key from 2 for 2);

create view public.shi_scores with (security_invoker = true) as
select d.submission_id, d.user_id, round(avg(d.score)) as overall,
       case when avg(d.score) >= 85 then 'Thriving' when avg(d.score) >= 70 then 'Stable'
            when avg(d.score) >= 55 then 'At risk' when avg(d.score) >= 40 then 'Critical'
            else 'Intervention required' end as band,
       count(*) as domains_scored
from public.shi_domain_scores d group by d.submission_id, d.user_id;

-- Staff inbox: one row per submitted index with the contact details and scores.
create view public.shi_inbox with (security_invoker = true) as
select s.id, s.status, s.submitted_at, p.first_name, p.last_name, p.email, p.phone, p.best_time, p.role,
       p.school_name, p.city, p.state, p.budget, p.interest, p.heard_from, sc.overall, sc.band,
       s.answers ->> 'o_keeping' as in_their_words
from public.shi_submissions s join public.profiles p on p.id = s.user_id
left join public.shi_scores sc on sc.submission_id = s.id
where s.status <> 'draft';
revoke all on public.shi_inbox from anon, authenticated;
