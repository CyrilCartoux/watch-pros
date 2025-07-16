/**
 * SQL table definition for the listing_views table
 * @see {@link ListingView} for the TypeScript type definition
 */
// create table public.listing_views (
//     id uuid not null default gen_random_uuid (),
//     listing_id uuid not null,
//     user_id uuid null,
//     ip_hash text null,
//     user_agent text null,
//     created_at timestamp with time zone null default now(),
//     constraint listing_views_pkey primary key (id),
//     constraint listing_views_listing_id_fkey foreign KEY (listing_id) references listings (id),
//     constraint listing_views_user_id_fkey foreign KEY (user_id) references auth.users (id)
//   ) TABLESPACE pg_default;
//   create index IF not exists idx_listing_views_listing_user on public.listing_views using btree (listing_id, user_id) TABLESPACE pg_default;
//   create index IF not exists idx_listing_views_listing_iphash on public.listing_views using btree (listing_id, ip_hash) TABLESPACE pg_default;

/**
 * Represents a view on a listing
 * @property {string} id - Unique identifier (UUID) for the view
 * @property {string} listing_id - UUID of the listing
 * @property {string | null} user_id - UUID of the user (if logged in)
 * @property {string | null} ip_hash - Hashed IP+UA for anonymous views
 * @property {string | null} user_agent - User agent string
 * @property {string | null} created_at - ISO 8601 timestamp of when the view was recorded
 */
export type ListingView = {
  /** Unique identifier (UUID) for the view */
  id: string
  /** UUID of the listing */
  listing_id: string
  /** UUID of the user (if logged in) */
  user_id: string | null
  /** Hashed IP+UA for anonymous views */
  ip_hash: string | null
  /** User agent string */
  user_agent: string | null
  /** ISO 8601 timestamp of when the view was recorded */
  created_at: string | null
}

export type ListingViewInsert = Omit<ListingView, 'id' | 'created_at'> & {
  id?: string
  created_at?: string | null
}

export type ListingViewUpdate = Partial<ListingView>