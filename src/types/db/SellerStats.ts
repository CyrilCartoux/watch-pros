/**
 * SQL table definition for the seller_stats table
 * @see {@link SellerStats} for the TypeScript type definition
 */
// create table public.seller_stats (
//     id uuid not null default gen_random_uuid (),
//     seller_id uuid not null,
//     total_reviews integer null default 0,
//     average_rating numeric(3, 2) null default 0,
//     total_approvals integer null default 0,
//     last_updated timestamp with time zone null default now(),
//     constraint seller_stats_pkey primary key (id),
//     constraint seller_stats_seller_id_key unique (seller_id),
//     constraint seller_stats_seller_id_fkey foreign KEY (seller_id) references sellers (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents aggregated statistics for a seller in the system
 * @property {string} id - Unique identifier (UUID) for the stats record
 * @property {string} seller_id - UUID of the seller these stats belong to
 * @property {number} total_reviews - Total number of reviews received by the seller
 * @property {number} average_rating - Average rating received by the seller (0-5 scale with 2 decimal places)
 * @property {number} total_approvals - Total number of approvals received by the seller
 * @property {string} last_updated - ISO 8601 timestamp of when the stats were last updated
 */
export type SellerStats = {
    /** Unique identifier (UUID) for the stats record */
    id: string
    /** UUID of the seller these stats belong to */
    seller_id: string
    /** Total number of reviews received by the seller */
    total_reviews: number | null
    /** Average rating received by the seller (0-5 scale with 2 decimal places) */
    average_rating: number | null
    /** Total number of approvals received by the seller */
    total_approvals: number | null
    /** ISO 8601 timestamp of when the stats were last updated */
    last_updated: string | null
}