/**
 * SQL table definition for the newsletter_subscribers table
 * @see {@link NewsletterSubscriber} for the TypeScript type definition
 */
// create table public.newsletter_subscribers (
//   id uuid not null default gen_random_uuid(),
//   email text not null,
//   created_at timestamp with time zone not null default timezone('utc'::text, now()),
//   updated_at timestamp with time zone not null default timezone('utc'::text, now()),
//   status text not null default 'active',
//   constraint newsletter_subscribers_pkey primary key (id),
//   constraint newsletter_subscribers_email_key unique (email),
//   constraint newsletter_subscribers_status_check check (status in ('active', 'unsubscribed'))
// ) tablespace pg_default;
//
// create index if not exists idx_newsletter_subscribers_email on public.newsletter_subscribers using btree (email) tablespace pg_default;
// create index if not exists idx_newsletter_subscribers_status on public.newsletter_subscribers using btree (status) tablespace pg_default;
// create index if not exists idx_newsletter_subscribers_created_at on public.newsletter_subscribers using btree (created_at desc) tablespace pg_default;

/**
 * Represents a newsletter subscriber in the system
 * @property {string} id - Unique identifier (UUID) for the subscriber
 * @property {string} email - Email address of the subscriber
 * @property {string} created_at - ISO 8601 timestamp of when the subscription was created
 * @property {string} updated_at - ISO 8601 timestamp of when the subscription was last updated
 * @property {string} status - Current status of the subscription ('active' or 'unsubscribed')
 */
export type NewsletterSubscriber = {
  /** Unique identifier (UUID) for the subscriber */
  id: string
  /** Email address of the subscriber */
  email: string
  /** ISO 8601 timestamp of when the subscription was created */
  created_at: string
  /** ISO 8601 timestamp of when the subscription was last updated */
  updated_at: string
  /** Current status of the subscription ('active' or 'unsubscribed') */
  status: 'active' | 'unsubscribed'
} 