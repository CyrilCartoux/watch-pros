/**
 * SQL table definition for the custom_alerts table
 * @see {@link CustomAlert} for the TypeScript type definition
 */
// create table public.custom_alerts (
//     id serial not null,
//     user_id uuid not null,
//     brand_id uuid null,
//     model_id uuid null,
//     reference text null,
//     dial_color text null,
//     max_price numeric(10, 2) null,
//     location text null,
//     created_at timestamp with time zone not null default now(),
//     constraint custom_alerts_pkey primary key (id),
//     constraint custom_alerts_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
//     constraint custom_alerts_brand_id_fkey foreign KEY (brand_id) references brands (id) on delete CASCADE,
//     constraint custom_alerts_model_id_fkey foreign KEY (model_id) references models (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a custom alert in the system
 * @property {string} id - Unique identifier (serial) for the alert
 * @property {string} user_id - UUID of the user who created the alert
 * @property {string} brand_id - UUID of the brand to monitor (optional)
 * @property {string} model_id - UUID of the model to monitor (optional)
 * @property {string} reference - Specific reference to monitor (optional)
 * @property {string} dial_color - Dial color to monitor (optional)
 * @property {number} max_price - Maximum price threshold (optional)
 * @property {string} location - Location to monitor (optional)
 * @property {string} created_at - ISO 8601 timestamp of when the alert was created
 */
export type CustomAlert = {
    /** Unique identifier (serial) for the alert */
    id: string
    /** UUID of the user who created the alert */
    user_id: string
    /** UUID of the brand to monitor (optional) */
    brand_id: string | null
    /** UUID of the model to monitor (optional) */
    model_id: string | null
    /** Specific reference to monitor (optional) */
    reference: string | null
    /** Dial color to monitor (optional) */
    dial_color: string | null
    /** Maximum price threshold (optional) */
    max_price: number | null
    /** Location to monitor (optional) */
    location: string | null
    /** ISO 8601 timestamp of when the alert was created */
    created_at: string
}

export type CustomAlertInsert = Omit<CustomAlert, 'id' | 'created_at'>

export type CustomAlertUpdate = {
    /** Dial color to monitor (optional) */
    dial_color?: string | null
    /** Maximum price threshold (optional) */
    max_price?: number | null
    /** Location to monitor (optional) */
    location?: string | null
}