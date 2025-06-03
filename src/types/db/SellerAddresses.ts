/**
 * SQL table definition for the seller_addresses table
 * @see {@link SellerAddress} for the TypeScript type definition
 */
// create table public.seller_addresses (
//     id uuid not null default gen_random_uuid (),
//     seller_id uuid not null,
//     street text not null,
//     address_complement text null,
//     postal_code text not null,
//     city text not null,
//     fax text null,
//     mobile text null,
//     website text null,
//     siren text null,
//     tax_id text null,
//     vat_number text null,
//     oss boolean null,
//     country text not null,
//     fax_prefix text null,
//     mobile_prefix text null,
//     created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     constraint seller_addresses_pkey primary key (id),
//     constraint seller_addresses_seller_id_fkey foreign KEY (seller_id) references sellers (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a seller's address and contact information in the system
 * @property {string} id - Unique identifier (UUID) for the address
 * @property {string} seller_id - UUID of the seller this address belongs to
 * @property {string} street - Street address
 * @property {string} address_complement - Additional address information
 * @property {string} postal_code - Postal/ZIP code
 * @property {string} city - City name
 * @property {string} fax - Fax number
 * @property {string} mobile - Mobile phone number
 * @property {string} website - Website URL
 * @property {string} siren - French company registration number
 * @property {string} tax_id - Tax identification number
 * @property {string} vat_number - VAT registration number
 * @property {boolean} oss - One-Stop Shop registration status
 * @property {string} country - Country name
 * @property {string} fax_prefix - International prefix for fax number
 * @property {string} mobile_prefix - International prefix for mobile number
 * @property {string} created_at - ISO 8601 timestamp of when the address was created
 * @property {string} updated_at - ISO 8601 timestamp of when the address was last updated
 */
export type SellerAddress = {
    /** Unique identifier (UUID) for the address */
    id: string
    /** UUID of the seller this address belongs to */
    seller_id: string
    /** Street address */
    street: string
    /** Additional address information */
    address_complement: string | null
    /** Postal/ZIP code */
    postal_code: string
    /** City name */
    city: string
    /** Fax number */
    fax: string | null
    /** Mobile phone number */
    mobile: string | null
    /** Website URL */
    website: string | null
    /** French company registration number */
    siren: string | null
    /** Tax identification number */
    tax_id: string | null
    /** VAT registration number */
    vat_number: string | null
    /** One-Stop Shop registration status */
    oss: boolean | null
    /** Country name */
    country: string
    /** International prefix for fax number */
    fax_prefix: string | null
    /** International prefix for mobile number */
    mobile_prefix: string | null
    /** ISO 8601 timestamp of when the address was created */
    created_at: string
    /** ISO 8601 timestamp of when the address was last updated */
    updated_at: string
}