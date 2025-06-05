/**
 * SQL table definition for the sellers table
 * @see {@link Seller} for the TypeScript type definition
 */
// create table public.sellers (
//     id uuid not null default gen_random_uuid (),
//     company_name text not null,
//     watch_pros_name text not null,
//     company_status text not null,
//     first_name text not null,
//     last_name text not null,
//     email text not null,
//     country text not null,
//     title text not null,
//     phone_prefix text not null,
//     phone text not null,
//     created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     id_card_front_url text null,
//     id_card_back_url text null,
//     proof_of_address_url text null,
//     company_logo_url text null,
//     user_id uuid null,
//     crypto_friendly boolean not null default false,
//     constraint sellers_pkey primary key (id),
//     constraint sellers_email_key unique (email),
//     constraint sellers_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
//   ) TABLESPACE pg_default;
//
//   -- Add indexes for common filter operations
//   create index if not exists idx_sellers_country on public.sellers using btree (country) tablespace pg_default;
//   create index if not exists idx_sellers_crypto_friendly on public.sellers using btree (crypto_friendly) tablespace pg_default;
//   create index if not exists idx_sellers_company_status on public.sellers using btree (company_status) tablespace pg_default;
//   create index if not exists idx_sellers_created_at on public.sellers using btree (created_at desc) tablespace pg_default;
//
//   -- Add full-text search capabilities
//   alter table public.sellers add column if not exists search_vector tsvector
//   generated always as (
//     setweight(to_tsvector('english', coalesce(company_name, '')), 'A') ||
//     setweight(to_tsvector('english', coalesce(watch_pros_name, '')), 'A') ||
//     setweight(to_tsvector('english', coalesce(first_name || ' ' || last_name, '')), 'B') ||
//     setweight(to_tsvector('english', coalesce(email, '')), 'C')
//   ) stored;
//
//   create index if not exists idx_sellers_search on public.sellers using gin (search_vector) tablespace pg_default;
//
//   -- Create function to update search vector
//   create or replace function public.update_sellers_search_vector()
//   returns trigger as $$
//   begin
//     new.search_vector :=
//       setweight(to_tsvector('english', coalesce(new.company_name, '')), 'A') ||
//       setweight(to_tsvector('english', coalesce(new.watch_pros_name, '')), 'A') ||
//       setweight(to_tsvector('english', coalesce(new.first_name || ' ' || new.last_name, '')), 'B') ||
//       setweight(to_tsvector('english', coalesce(new.email, '')), 'C');
//     return new;
//   end;
//   $$ language plpgsql;
//
//   -- Create trigger to automatically update search vector
//   create trigger update_sellers_search_vector
//   before insert or update on public.sellers
//   for each row
//   execute function public.update_sellers_search_vector();

/**
 * Represents a seller in the system
 * @property {string} id - Unique identifier (UUID) for the seller
 * @property {string} company_name - Legal name of the company
 * @property {string} watch_pros_name - Display name on Watch Pros platform
 * @property {string} company_status - Current status of the company
 * @property {string} first_name - First name of the contact person
 * @property {string} last_name - Last name of the contact person
 * @property {string} email - Contact email address
 * @property {string} country - Country of operation
 * @property {string} title - Professional title of the contact person
 * @property {string} phone_prefix - International phone prefix
 * @property {string} phone - Phone number
 * @property {string} created_at - ISO 8601 timestamp of when the seller was created
 * @property {string} updated_at - ISO 8601 timestamp of when the seller was last updated
 * @property {string} id_card_front_url - URL to the front of the ID card image
 * @property {string} id_card_back_url - URL to the back of the ID card image
 * @property {string} proof_of_address_url - URL to the proof of address document
 * @property {string} company_logo_url - URL to the company logo
 * @property {string} user_id - UUID of the associated user account
 * @property {boolean} crypto_friendly - Whether the seller accepts cryptocurrency payments
 * @property {string} search_vector - Full-text search vector for efficient text search
 */
export type Seller = {
    /** Unique identifier (UUID) for the seller */
    id: string
    /** Legal name of the company */
    company_name: string
    /** Display name on Watch Pros platform */
    watch_pros_name: string
    /** Current status of the company */
    company_status: string
    /** First name of the contact person */
    first_name: string
    /** Last name of the contact person */
    last_name: string
    /** Contact email address */
    email: string
    /** Country of operation */
    country: string
    /** Professional title of the contact person */
    title: string
    /** International phone prefix */
    phone_prefix: string
    /** Phone number */
    phone: string
    /** ISO 8601 timestamp of when the seller was created */
    created_at: string
    /** ISO 8601 timestamp of when the seller was last updated */
    updated_at: string
    /** URL to the front of the ID card image */
    id_card_front_url: string | null
    /** URL to the back of the ID card image */
    id_card_back_url: string | null
    /** URL to the proof of address document */
    proof_of_address_url: string | null
    /** URL to the company logo */
    company_logo_url: string | null
    /** UUID of the associated user account */
    user_id: string | null
    /** Whether the seller accepts cryptocurrency payments */
    crypto_friendly: boolean
    /** Full-text search vector for efficient text search */
    search_vector?: string
}