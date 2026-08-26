-- 5 na 5: databáza bez plateného AI API.
-- Pred spustením zapnite v Supabase: Authentication > Providers > Anonymous sign-ins.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key,
  owner_id uuid not null default auth.uid() references auth.users(id),
  share_code text not null unique check (share_code ~ '^[A-Z2-9]{6}$'),
  private_state jsonb not null,
  public_state jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.games_public (
  id uuid primary key references public.games(id) on delete cascade,
  share_code text not null unique,
  public_state jsonb not null,
  updated_at timestamptz not null
);

create table if not exists public.pairing_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  claimed_by uuid references auth.users(id),
  claimed_at timestamptz
);

alter table public.admins enable row level security;
alter table public.games enable row level security;
alter table public.games_public enable row level security;
alter table public.pairing_codes enable row level security;

create or replace function public.is_admin(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = check_user);
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

create policy "Admin can see own membership" on public.admins
  for select to authenticated using (user_id = auth.uid());

create policy "Admins manage games" on public.games
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin() and owner_id = auth.uid());

create policy "Anyone can view presentation state" on public.games_public
  for select to anon, authenticated using (true);

create policy "Admins can inspect pairing codes" on public.pairing_codes
  for select to authenticated using (public.is_admin());

create or replace function public.sync_public_game()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.games_public (id, share_code, public_state, updated_at)
  values (new.id, new.share_code, new.public_state, new.updated_at)
  on conflict (id) do update set
    share_code = excluded.share_code,
    public_state = excluded.public_state,
    updated_at = excluded.updated_at;
  return new;
end;
$$;

drop trigger if exists sync_public_game_trigger on public.games;
create trigger sync_public_game_trigger
after insert or update of public_state, share_code, updated_at on public.games
for each row execute function public.sync_public_game();

create or replace function public.create_pairing_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare new_code text;
begin
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  delete from public.pairing_codes where expires_at < now() or claimed_at is not null;
  loop
    new_code := upper(encode(gen_random_bytes(4), 'hex'));
    begin
      insert into public.pairing_codes (code, created_by) values (new_code, auth.uid());
      return new_code;
    exception when unique_violation then null;
    end;
  end loop;
end;
$$;

create or replace function public.claim_pairing_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare target_id uuid;
begin
  if auth.uid() is null then return false; end if;
  select id into target_id from public.pairing_codes
    where code = upper(trim(p_code)) and expires_at > now() and claimed_at is null
    for update skip locked;
  if target_id is null then return false; end if;
  insert into public.admins (user_id) values (auth.uid()) on conflict do nothing;
  update public.pairing_codes set claimed_by = auth.uid(), claimed_at = now() where id = target_id;
  return true;
end;
$$;

revoke all on function public.create_pairing_code() from public;
revoke all on function public.claim_pairing_code(text) from public;
grant execute on function public.create_pairing_code() to authenticated;
grant execute on function public.claim_pairing_code(text) to authenticated;

-- Realtime posiela iba bezpečný verejný stav prezentácie.
alter publication supabase_realtime add table public.games_public;

-- PRVÉ ZARIADENIE (spustite až po prvom otvorení aplikácie):
-- 1. V aplikácii Nastavenia skopírujte ID zariadenia.
-- 2. Odkomentujte a spustite nasledujúci príkaz s týmto UUID:
-- insert into public.admins (user_id) values ('SEM_VLOZTE_UUID_ZARIADENIA');
