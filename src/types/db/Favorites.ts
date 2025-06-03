/**
 * SQL table definition for the favorites table
 * @see {@link Favorite} for the TypeScript type definition
 */
// create table public.favorites (
//     id uuid not null default gen_random_uuid (),
//     user_id uuid not null,
//     listing_id uuid not null,
//     created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     constraint favorites_pkey primary key (id),
//     constraint favorites_user_id_listing_id_key unique (user_id, listing_id),
//     constraint favorites_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete CASCADE,
//     constraint favorites_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a user's favorite listing in the system
 * @property {string} id - Unique identifier (UUID) for the favorite entry
 * @property {string} user_id - UUID of the user who favorited the listing
 * @property {string} listing_id - UUID of the listing that was favorited
 * @property {string} created_at - ISO 8601 timestamp of when the favorite was created
 */
export type Favorite = {
    /** Unique identifier (UUID) for the favorite entry */
    id: string
    /** UUID of the user who favorited the listing */
    user_id: string
    /** UUID of the listing that was favorited */
    listing_id: string
    /** ISO 8601 timestamp of when the favorite was created */
    created_at: string
}