/**
 * SQL table definition for the listings table
 * @see {@link Listing} for the TypeScript type definition
 */
// create table public.listings (
//     id uuid not null default gen_random_uuid (),
//     reference_id character varying(50) not null,
//     seller_id uuid not null,
//     brand_id uuid not null,
//     model_id uuid not null,
//     reference character varying(50) not null,
//     title character varying(255) not null,
//     description text null,
//     year character varying(4) null,
//     gender character varying(20) null,
//     serial_number character varying(100) null,
//     dial_color character varying(50) null,
//     diameter_min integer null,
//     diameter_max integer null,
//     movement character varying(50) null,
//     case_material character varying(50) null,
//     bracelet_material character varying(50) null,
//     bracelet_color character varying(50) null,
//     included character varying(50) null,
//     condition character varying(50) null,
//     price numeric(10, 2) not null,
//     currency character varying(3) not null default 'EUR'::character varying,
//     shipping_delay character varying(20) null,
//     status character varying(20) null default 'draft'::character varying,
//     created_at timestamp with time zone null default CURRENT_TIMESTAMP,
//     updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
//     listing_type text null,
//     accessory_type character varying(255) null,
//     constraint listings_pkey primary key (id),
//     constraint listings_reference_id_key unique (reference_id),
//     constraint listings_brand_id_fkey foreign KEY (brand_id) references brands (id),
//     constraint listings_model_id_fkey foreign KEY (model_id) references models (id),
//     constraint listings_seller_id_fkey foreign KEY (seller_id) references sellers (id),
//     constraint listings_listing_type_check check (
//       (
//         listing_type = any (array['watch'::text, 'accessory'::text])
//       )
//     )
//   ) TABLESPACE pg_default;
//
//   create index IF not exists idx_listings_brand_model on public.listings using btree (brand_id, model_id) TABLESPACE pg_default;
//   create index IF not exists idx_listings_seller on public.listings using btree (seller_id) TABLESPACE pg_default;
//   create index IF not exists idx_listings_status on public.listings using btree (status) TABLESPACE pg_default;
//   create index IF not exists idx_listings_search on public.listings using gin (
//     to_tsvector(
//       'english'::regconfig,
//       (
//         (
//           (
//             ((title)::text || ' '::text) || COALESCE(description, ''::text)
//           ) || ' '::text
//         ) || (reference)::text
//       )
//     )
//   ) TABLESPACE pg_default;
//   create index IF not exists idx_listings_brand_id on public.listings using btree (brand_id) TABLESPACE pg_default;
//   create index IF not exists idx_listings_model_id on public.listings using btree (model_id) TABLESPACE pg_default;
//   create index IF not exists idx_listings_condition on public.listings using btree (condition) TABLESPACE pg_default;
//   create index IF not exists idx_listings_price on public.listings using btree (price) TABLESPACE pg_default;
//   create index IF not exists idx_listings_listing_type on public.listings using btree (listing_type) TABLESPACE pg_default;
//   create index IF not exists idx_listings_dial_color on public.listings using btree (dial_color) TABLESPACE pg_default;
//   create index IF not exists idx_listings_included on public.listings using btree (included) TABLESPACE pg_default;
//   create index IF not exists idx_listings_shipping_delay on public.listings using btree (shipping_delay) TABLESPACE pg_default;

/**
 * Represents a watch or accessory listing in the system
 * @property {string} id - Unique identifier (UUID) for the listing
 * @property {string} reference_id - Unique reference identifier for the listing
 * @property {string} seller_id - UUID of the seller who created the listing
 * @property {string} brand_id - UUID of the watch brand
 * @property {string} model_id - UUID of the watch model
 * @property {string} reference - Model reference number
 * @property {string} title - Title of the listing
 * @property {string} description - Detailed description of the item
 * @property {string} year - Year of manufacture
 * @property {string} gender - Target gender (e.g., "Men", "Women", "Unisex")
 * @property {string} serial_number - Watch serial number
 * @property {string} dial_color - Color of the watch dial
 * @property {number} diameter_min - Minimum diameter of the watch case
 * @property {number} diameter_max - Maximum diameter of the watch case
 * @property {string} movement - Type of watch movement
 * @property {string} case_material - Material of the watch case
 * @property {string} bracelet_material - Material of the watch bracelet
 * @property {string} bracelet_color - Color of the watch bracelet
 * @property {string} included - Items included with the watch
 * @property {string} condition - Condition of the watch
 * @property {number} price - Price of the item
 * @property {string} currency - Currency code (default: 'EUR')
 * @property {string} shipping_delay - Expected shipping delay
 * @property {string} status - Current status of the listing (default: 'draft')
 * @property {string} created_at - ISO 8601 timestamp of when the listing was created
 * @property {string} updated_at - ISO 8601 timestamp of when the listing was last updated
 * @property {string} listing_type - Type of listing ('watch' or 'accessory')
 * @property {string} accessory_type - Type of accessory (if listing_type is 'accessory')
 */
export type Listing = {
    /** Unique identifier (UUID) for the listing */
    id: string
    /** Unique reference identifier for the listing */
    reference_id: string
    /** UUID of the seller who created the listing */
    seller_id: string
    /** UUID of the watch brand */
    brand_id: string
    /** UUID of the watch model */
    model_id: string
    /** Model reference number */
    reference: string
    /** Title of the listing */
    title: string
    /** Detailed description of the item */
    description: string | null
    /** Year of manufacture */
    year: string | null
    /** Target gender (e.g., "Men", "Women", "Unisex") */
    gender: string | null
    /** Watch serial number */
    serial_number: string | null
    /** Color of the watch dial */
    dial_color: string | null
    /** Minimum diameter of the watch case */
    diameter_min: number | null
    /** Maximum diameter of the watch case */
    diameter_max: number | null
    /** Type of watch movement */
    movement: string | null
    /** Material of the watch case */
    case_material: string | null
    /** Material of the watch bracelet */
    bracelet_material: string | null
    /** Color of the watch bracelet */
    bracelet_color: string | null
    /** Items included with the watch */
    included: string | null
    /** Condition of the watch */
    condition: string | null
    /** Price of the item */
    price: number
    /** Currency code (default: 'EUR') */
    currency: string
    /** Expected shipping delay */
    shipping_delay: string | null
    /** Current status of the listing (default: 'draft') */
    status: string | null
    /** ISO 8601 timestamp of when the listing was created */
    created_at: string | null
    /** ISO 8601 timestamp of when the listing was last updated */
    updated_at: string | null
    /** Type of listing ('watch' or 'accessory') */
    listing_type: string | null
    /** Type of accessory (if listing_type is 'accessory') */
    accessory_type: string | null
}