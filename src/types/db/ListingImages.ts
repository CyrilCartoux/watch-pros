/**
 * SQL table definition for the listing_images table
 * @see {@link ListingImage} for the TypeScript type definition
 */
// create table public.listing_images (
//   id uuid not null default gen_random_uuid (),
//   listing_id uuid null,
//   url text not null,
//   order_index integer not null,
//   created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//   updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
//   constraint listing_images_pkey primary key (id),
//   constraint listing_images_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete CASCADE
// ) TABLESPACE pg_default;
//
// create index IF not exists listing_images_listing_id_idx on public.listing_images using btree (listing_id) TABLESPACE pg_default;
//
// create index IF not exists listing_images_order_index_idx on public.listing_images using btree (order_index) TABLESPACE pg_default;
//
// create trigger set_updated_at BEFORE
// update on listing_images for EACH row
// execute FUNCTION set_updated_at ();

/**
 * Represents an image associated with a listing in the system
 * @property {string} id - Unique identifier (UUID) for the image
 * @property {string} listing_id - UUID of the listing this image belongs to
 * @property {string} url - URL/path to the image file
 * @property {number} order_index - Position of the image in the listing's image sequence
 * @property {string} created_at - ISO 8601 timestamp of when the image was created
 * @property {string} updated_at - ISO 8601 timestamp of when the image was last updated
 */
export type ListingImage = {
    /** Unique identifier (UUID) for the image */
    id: string
    /** UUID of the listing this image belongs to */
    listing_id: string | null
    /** URL/path to the image file */
    url: string
    /** Position of the image in the listing's image sequence */
    order_index: number
    /** ISO 8601 timestamp of when the image was created */
    created_at: string
    /** ISO 8601 timestamp of when the image was last updated */
    updated_at: string
}