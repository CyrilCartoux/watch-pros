/**
 * SQL table definition for the seller_banking table
 * @see {@link SellerBanking} for the TypeScript type definition
 */
// create table public.seller_banking (
//     id uuid not null default gen_random_uuid (),
//     seller_id uuid not null,
//     card_holder text null,
//     cvc text null,
//     is_authorized boolean null,
//     account_holder text null,
//     sepa_street text null,
//     sepa_postal_code text null,
//     sepa_city text null,
//     bank_name text null,
//     payment_method text not null,
//     card_number text null,
//     expiry_date text null,
//     sepa_country text null,
//     created_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
//     bic character varying(11) null,
//     iban character varying(34) null,
//     constraint seller_banking_pkey primary key (id),
//     constraint seller_banking_seller_id_fkey foreign KEY (seller_id) references sellers (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a seller's banking and payment information in the system
 * @property {string} id - Unique identifier (UUID) for the banking record
 * @property {string} seller_id - UUID of the seller this banking info belongs to
 * @property {string} card_holder - Name of the card holder
 * @property {string} cvc - Card verification code
 * @property {boolean} is_authorized - Whether the payment method is authorized
 * @property {string} account_holder - Name of the bank account holder
 * @property {string} sepa_street - Street address for SEPA payment
 * @property {string} sepa_postal_code - Postal code for SEPA payment
 * @property {string} sepa_city - City for SEPA payment
 * @property {string} bank_name - Name of the bank
 * @property {string} payment_method - Type of payment method used
 * @property {string} card_number - Credit/debit card number
 * @property {string} expiry_date - Card expiration date
 * @property {string} sepa_country - Country for SEPA payment
 * @property {string} created_at - ISO 8601 timestamp of when the record was created
 * @property {string} updated_at - ISO 8601 timestamp of when the record was last updated
 * @property {string} bic - Bank Identifier Code (BIC/SWIFT)
 * @property {string} iban - International Bank Account Number
 */
export type SellerBanking = {
    /** Unique identifier (UUID) for the banking record */
    id: string
    /** UUID of the seller this banking info belongs to */
    seller_id: string
    /** Name of the card holder */
    card_holder: string | null
    /** Card verification code */
    cvc: string | null
    /** Whether the payment method is authorized */
    is_authorized: boolean | null
    /** Name of the bank account holder */
    account_holder: string | null
    /** Street address for SEPA payment */
    sepa_street: string | null
    /** Postal code for SEPA payment */
    sepa_postal_code: string | null
    /** City for SEPA payment */
    sepa_city: string | null
    /** Name of the bank */
    bank_name: string | null
    /** Type of payment method used */
    payment_method: string
    /** Credit/debit card number */
    card_number: string | null
    /** Card expiration date */
    expiry_date: string | null
    /** Country for SEPA payment */
    sepa_country: string | null
    /** ISO 8601 timestamp of when the record was created */
    created_at: string
    /** ISO 8601 timestamp of when the record was last updated */
    updated_at: string
    /** Bank Identifier Code (BIC/SWIFT) */
    bic: string | null
    /** International Bank Account Number */
    iban: string | null
}