/**
 * SQL table definition for the models table
 * @see {@link Model} for the TypeScript type definition
 */
// create table public.models (
//     id uuid not null default gen_random_uuid (),
//     brand_id uuid not null,
//     slug text not null,
//     label text not null,
//     created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     popular boolean null default false,
//     constraint models_pkey primary key (id),
//     constraint models_brand_id_slug_key unique (brand_id, slug),
//     constraint models_brand_id_fkey foreign KEY (brand_id) references brands (id)
//   ) TABLESPACE pg_default;

/**
 * Represents a watch model in the system
 * @property {string} id - Unique identifier (UUID) for the model
 * @property {string} brand_id - UUID of the brand this model belongs to
 * @property {string} slug - URL-friendly unique identifier for the model within its brand
 * @property {string} label - Display name of the model
 * @property {string} created_at - ISO 8601 timestamp of when the model was created
 * @property {boolean} popular - Whether the model is marked as popular
 */
export type Model = {
    /** Unique identifier (UUID) for the model */
    id: string
    /** UUID of the brand this model belongs to */
    brand_id: string
    /** URL-friendly unique identifier for the model within its brand */
    slug: string
    /** Display name of the model */
    label: string
    /** ISO 8601 timestamp of when the model was created */
    created_at: string
    /** Whether the model is marked as popular */
    popular: boolean
}