/**
 * SQL table definition for the listing_subscriptions table
 * @see {@link ListingSubscription} for the TypeScript type definition
 */
// create table public.listing_subscriptions (
//     id serial not null,
//     user_id uuid not null,
//     listing_id uuid not null,
//     created_at timestamp with time zone not null default now(),
//     constraint listing_subscriptions_pkey primary key (id),
//     constraint listing_subscriptions_user_id_listing_id_key unique (user_id, listing_id),
//     constraint listing_subscriptions_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete CASCADE,
//     constraint listing_subscriptions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
//   ) TABLESPACE pg_default;
/**
 * Represents a listing subscription in the system
 * @property {string} id - Unique identifier (serial) for the subscription
 * @property {string} user_id - UUID of the user who is subscribed
 * @property {string} listing_id - UUID of the listing being followed (references listings.id)
 * @property {string} created_at - ISO 8601 timestamp of when the subscription was created
 */
export type ListingSubscription = {
    /** Unique identifier (serial) for the subscription */
    id: string
    /** UUID of the user who is subscribed */
    user_id: string
    /** UUID of the listing being followed (references listings.id) */
    listing_id: string
    /** ISO 8601 timestamp of when the subscription was created */
    created_at: string
}

export type ListingSubscriptionInsert = Omit<ListingSubscription, 'id' | 'created_at'>

export type ListingSubscriptionUpdate = {
    // No updatable fields
}
