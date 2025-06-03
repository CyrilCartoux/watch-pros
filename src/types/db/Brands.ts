/**
 * SQL table definition for the brands table
 * @see {@link Brand} for the TypeScript type definition
 */
// create table public.brands (
//     id uuid not null default gen_random_uuid (),
//     slug text not null,
//     label text not null,
//     created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     popular boolean null default false,
//     constraint brands_pkey primary key (id),
//     constraint brands_slug_key unique (slug)
//   ) TABLESPACE pg_default;

/**
 * Represents a watch brand in the system
 * @property {string} id - Unique identifier (UUID) for the brand
 * @property {string} slug - URL-friendly unique identifier for the brand
 * @property {string} label - Display name of the brand
 * @property {string} created_at - ISO 8601 timestamp of when the brand was created
 * @property {boolean} popular - Whether the brand is marked as popular
 */
export type Brand = {
    /** Unique identifier (UUID) for the brand */
    id: string
    /** URL-friendly unique identifier for the brand */
    slug: string
    /** Display name of the brand */
    label: string
    /** ISO 8601 timestamp of when the brand was created */
    created_at: string
    /** Whether the brand is marked as popular */
    popular: boolean
}