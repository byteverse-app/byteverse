-- NPS feedback: widen rating scale and add cooldown tracking

alter table public.product_feedback
  drop constraint if exists product_feedback_rating_check;

alter table public.product_feedback
  add constraint product_feedback_rating_check
  check (rating is null or (rating >= 0 and rating <= 10));

alter table public.profiles
  add column if not exists last_nps_at timestamptz;

create index if not exists product_feedback_context_created_idx
  on public.product_feedback(context, created_at desc);
