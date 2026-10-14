-- Käivita see Supabase'i SQL Editoris (Dashboard → SQL Editor → New query)

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 1000),
  priority    text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date    date,
  completed   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- updated_at uueneb automaatselt iga muudatusega
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Row Level Security sisse, aga poliitikaid ei lisata:
-- avaliku (anon) võtmega ei pääse tabelile keegi ligi.
-- Ligipääs käib ainult Next.js backendi kaudu service_role võtmega.
alter table public.tasks enable row level security;

-- Näidisandmed (valikuline)
insert into public.tasks (title, description, priority, due_date) values
  ('Seadista Supabase projekt', 'Loo tabel ja lisa võtmed .env.local faili', 'high', current_date),
  ('Kirjuta README', null, 'medium', current_date + 2),
  ('Esita kodutöö', 'Lisa GitHubi link', 'high', current_date + 5);
