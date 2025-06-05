/**
 * SQL table definition for the offers table
 * @see {@link Offer} for the TypeScript type definition
 */
// create table public.offers (
//     id serial not null,
//     seller_id uuid not null,
//     listing_id uuid not null,
//     offer numeric not null,
//     is_accepted boolean not null default false,
//     currency text not null,
//     created_at timestamp with time zone not null default now(),
//     constraint offers_pkey primary key (id),
//     constraint offers_seller_id_fkey foreign key (seller_id) references sellers (id) on delete cascade,
//     constraint offers_listing_id_fkey foreign key (listing_id) references listings (id) on delete cascade
//   ) tablespace pg_default;

/**
 * Represents an offer in the system
 * @property {string} id - Unique identifier (serial) for the offer
 * @property {string} seller_id - UUID of the seller making the offer (references sellers.id)
 * @property {string} listing_id - UUID of the listing being offered on (references listings.id)
 * @property {number} offer - The amount of the offer
 * @property {boolean} is_accepted - Whether the offer has been accepted (TRUE = accepted, FALSE = declined, NULL = pending)
 * @property {string} currency - The currency of the offer (e.g., 'USD', 'EUR')
 * @property {string} created_at - ISO 8601 timestamp of when the offer was created
 */
export type Offer = {
    /** Unique identifier (serial) for the offer */
    id: string
    /** UUID of the seller making the offer (references sellers.id) */
    seller_id: string
    /** UUID of the listing being offered on (references listings.id) */
    listing_id: string
    /** The amount of the offer */
    offer: number
    /** Whether the offer has been accepted */
    is_accepted: boolean
    /** The currency of the offer (e.g., 'USD', 'EUR') */
    currency: string
    /** ISO 8601 timestamp of when the offer was created */
    created_at: string
}

export type OfferInsert = Omit<Offer, 'id' | 'created_at'>

export type OfferUpdate = {
    /** The amount of the offer */
    offer?: number
    /** The currency of the offer */
    currency?: string
} 