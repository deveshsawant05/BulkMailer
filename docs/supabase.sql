create extension if not exists pgcrypto;

-- ==========================================
-- ENUMS
-- ==========================================

create type public.campaign_status as enum (
  'DRAFT',
  'QUEUED',
  'PROCESSING',
  'PAUSED',
  'COMPLETED',
  'FAILED'
);

create type public.job_status as enum (
  'PENDING',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
  'RETRY'
);

-- ==========================================
-- TEMPLATES
-- ==========================================

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  subject_template text not null,
  body_template text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_templates_user_updated
on public.templates(user_id, updated_at desc);

-- ==========================================
-- GMAIL CONNECTIONS
-- ==========================================

create table public.gmail_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  gmail_email text not null,
  encrypted_access_token text not null,
  encrypted_refresh_token text not null,
  token_expires_at timestamptz,
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==========================================
-- CAMPAIGNS
-- ==========================================

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  gmail_connection_id uuid not null references public.gmail_connections(id) on delete cascade,
  name text not null,
  subject_template text not null,
  body_template text not null,
  status public.campaign_status not null default 'DRAFT',
  total_recipients integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  scheduled_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_campaigns_user_status
on public.campaigns(user_id, status, created_at desc);

-- ==========================================
-- CAMPAIGN ATTACHMENTS
-- ==========================================

create table public.campaign_attachments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  checksum text,
  created_at timestamptz not null default now(),
  unique(campaign_id, filename)
);

-- ==========================================
-- CAMPAIGN RECIPIENTS
-- ==========================================

create table public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  row_index integer not null,
  recipient_email text not null,
  variables jsonb not null default '{}'::jsonb,
  attachment_id uuid references public.campaign_attachments(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(campaign_id, row_index),
  unique(campaign_id, recipient_email)
);

create index idx_campaign_recipients_campaign
on public.campaign_recipients(campaign_id);

create index idx_campaign_recipients_email
on public.campaign_recipients(campaign_id, recipient_email);

-- ==========================================
-- CAMPAIGN JOBS
-- ==========================================

create table public.campaign_jobs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  recipient_id uuid not null references public.campaign_recipients(id) on delete cascade,
  status public.job_status not null default 'PENDING',
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  last_error text,
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  next_attempt_at timestamptz,
  gmail_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(campaign_id, recipient_id)
);

create index idx_campaign_jobs_worker
on public.campaign_jobs(status, next_attempt_at);

-- ==========================================
-- EMAIL LOGS
-- ==========================================

create table public.email_logs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  job_id uuid not null references public.campaign_jobs(id) on delete cascade,
  recipient_id uuid not null references public.campaign_recipients(id) on delete cascade,
  status text not null,
  attempt integer not null default 1,
  error_message text,
  gmail_message_id text,
  latency_ms integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_email_logs_campaign_created
on public.email_logs(campaign_id, created_at desc);

-- ==========================================
-- UPDATED_AT FUNCTION
-- ==========================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_templates_updated_at
before update on public.templates
for each row
execute function public.set_updated_at();

create trigger trg_gmail_connections_updated_at
before update on public.gmail_connections
for each row
execute function public.set_updated_at();

create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

create trigger trg_campaign_jobs_updated_at
before update on public.campaign_jobs
for each row
execute function public.set_updated_at();

-- ==========================================
-- RLS
-- ==========================================

alter table public.templates enable row level security;
alter table public.gmail_connections enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_attachments enable row level security;
alter table public.campaign_recipients enable row level security;
alter table public.campaign_jobs enable row level security;
alter table public.email_logs enable row level security;

create policy "templates_policy"
on public.templates
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "gmail_policy"
on public.gmail_connections
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "campaigns_policy"
on public.campaigns
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "attachments_policy"
on public.campaign_attachments
for all
using (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
);

create policy "recipients_policy"
on public.campaign_recipients
for all
using (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
);

create policy "jobs_policy"
on public.campaign_jobs
for all
using (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
);

create policy "logs_policy"
on public.email_logs
for all
using (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_id
    and c.user_id = auth.uid()
  )
);