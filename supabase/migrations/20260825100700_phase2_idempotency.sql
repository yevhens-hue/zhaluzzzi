-- Phase 2: Idempotency and Webhook tracking

CREATE TABLE IF NOT EXISTS webhook_events (
  id text PRIMARY KEY,
  event_type text NOT NULL,
  payload jsonb,
  processed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We rely on `created_at` filtering in `leads` and `orders` for idempotency,
-- so no structural changes are strictly needed there, 
-- but you could add a unique constraint on phone+lead_type+date if you wanted stricter DB-level locking.
