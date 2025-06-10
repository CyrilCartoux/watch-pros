/**
 * SQL table definition for the profiles table
 * @see {@link Profile} for the TypeScript type definition
 */
// create table public.profiles (
//     id uuid not null,
//     first_name text null,
//     last_name text null,
//     email text null,
//     seller_id uuid null,
//     stripe_customer_id text null,
//     constraint profiles_pkey primary key (id),
//     constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
//     constraint profiles_seller_id_fkey foreign KEY (seller_id) references public.sellers (id) on delete SET NULL
//   ) TABLESPACE pg_default;

/**
 * Represents a user profile in the system
 * @property {string} id - Unique identifier (UUID) for the profile, matches auth.users id
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {string} email - User's email
 * @property {string} seller_id - Reference to the seller profile if the user is a seller
 * @property {string} stripe_customer_id - Stripe customer ID for payment processing
 */
export type Profile = {
    /** Unique identifier (UUID) for the profile, matches auth.users id */
    id: string
    /** User's first name */
    first_name: string | null
    /** User's last name */
    last_name: string | null
    /** User's email */
    email: string | null
    /** Reference to the seller profile if the user is a seller */
    seller_id: string | null
    /** Stripe customer ID for payment processing */
    stripe_customer_id: string | null
}

export type ProfileInsert = Omit<Profile, 'id'>

export type ProfileUpdate = Partial<Omit<Profile, 'id'>>