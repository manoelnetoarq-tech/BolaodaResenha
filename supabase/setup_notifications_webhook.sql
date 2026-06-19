-- Habilita a extensão pg_net necessária para webhooks HTTP
create extension if not exists "pg_net";

-- Cria a tabela de notificações
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  body text not null,
  icon text,
  url text,
  user_id uuid references auth.users(id) on delete set null
);

-- Configura segurança básica (Apenas usuários autenticados podem inserir, qualquer um pode ler)
alter table public.notifications enable row level security;

-- Política de inserção (apenas quem está logado)
drop policy if exists "Autenticados podem inserir notificacoes" on public.notifications;
create policy "Autenticados podem inserir notificacoes"
  on public.notifications for insert
  to authenticated
  with check (true);

-- Política de leitura (qualquer um)
drop policy if exists "Qualquer um pode ver notificacoes" on public.notifications;
create policy "Qualquer um pode ver notificacoes"
  on public.notifications for select
  to anon, authenticated
  using (true);

-- Cria a função que usará o pg_net para fazer o disparo HTTP
create or replace function public.handle_new_notification()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://avjcjgsosfewukkdsgri.supabase.co/functions/v1/send-push',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2amNqZ3Nvc2Zld3Vra2RzZ3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzY0NzQsImV4cCI6MjA5NzMxMjQ3NH0.WZAtYIWfIRqgkqgI4FgxQ6Zjiwj6j2asTez5GRWYxII"}'::jsonb,
    body := json_build_object(
      'type', 'INSERT',
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )::jsonb
  );
  return NEW;
end;
$$ language plpgsql security definer;

-- Cria o Gatilho/Webhook vinculando a função à tabela
drop trigger if exists "send_push_on_notification" on "public"."notifications";
create trigger "send_push_on_notification"
  after insert on "public"."notifications"
  for each row
  execute function public.handle_new_notification();
