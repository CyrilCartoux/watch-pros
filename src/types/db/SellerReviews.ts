/**
 * SQL table definition for the seller_reviews table
 * @see {@link SellerReview} for the TypeScript type definition
 */
// create table public.seller_reviews (
//     id uuid not null default gen_random_uuid (),
//     seller_id uuid not null,
//     reviewer_id uuid not null,
//     rating integer not null,
//     comment text not null,
//     created_at timestamp with time zone null default now(),
//     updated_at timestamp with time zone null default now(),
//     constraint seller_reviews_pkey primary key (id),
//     constraint seller_reviews_seller_id_reviewer_id_key unique (seller_id, reviewer_id),
//     constraint seller_reviews_reviewer_id_fkey foreign KEY (reviewer_id) references auth.users (id) on delete CASCADE,
//     constraint seller_reviews_seller_id_fkey foreign KEY (seller_id) references sellers (id) on delete CASCADE,
//     constraint seller_reviews_rating_check check (
//       (
//         (rating >= 1)
//         and (rating <= 5)
//       )
//     )
//   ) TABLESPACE pg_default;
//
//   create index IF not exists idx_seller_reviews_seller_id on public.seller_reviews using btree (seller_id) TABLESPACE pg_default;
//
//   create index IF not exists idx_seller_reviews_reviewer_id on public.seller_reviews using btree (reviewer_id) TABLESPACE pg_default;
//
//   create trigger update_seller_stats_reviews
//   after INSERT
//   or DELETE
//   or
//   update on seller_reviews for EACH row
//   execute FUNCTION update_seller_stats ();

/**
 * Represents a review for a seller in the system
 * @property {string} id - Unique identifier (UUID) for the review
 * @property {string} seller_id - UUID of the seller being reviewed
 * @property {string} reviewer_id - UUID of the user who wrote the review
 * @property {number} rating - Rating given to the seller (1-5)
 * @property {string} comment - Review comment/feedback
 * @property {string} created_at - ISO 8601 timestamp of when the review was created
 * @property {string} updated_at - ISO 8601 timestamp of when the review was last updated
 */
export type SellerReview = {
    /** Unique identifier (UUID) for the review */
    id: string
    /** UUID of the seller being reviewed */
    seller_id: string
    /** UUID of the user who wrote the review */
    reviewer_id: string
    /** Rating given to the seller (1-5) */
    rating: number
    /** Review comment/feedback */
    comment: string
    /** ISO 8601 timestamp of when the review was created */
    created_at: string | null
    /** ISO 8601 timestamp of when the review was last updated */
    updated_at: string | null
}