-- Run after schema.sql, once the shi-notify edge function is deployed and its secrets are set.
-- Replace PROJECT_REF with the project's reference and SECRET with the same value as the
-- function's WEBHOOK_SECRET. The secret is kept in Supabase Vault, not in this file.
create extension if not exists pg_net;
select vault.create_secret('SECRET', 'shi_webhook_secret');

create or replace function public.shi_notify() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'submitted' and old.status = 'draft' then
    perform net.http_post(
      url := 'https://PROJECT_REF.supabase.co/functions/v1/shi-notify',
      headers := jsonb_build_object('Content-Type', 'application/json',
        'x-webhook-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'shi_webhook_secret')),
      body := jsonb_build_object('submission_id', new.id));
  end if;
  return new;
end $$;
create trigger shi_after_submit after update on public.shi_submissions for each row execute function public.shi_notify();
