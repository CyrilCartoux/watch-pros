/**
 * SQL table definition for the push_subscriptions table
 * @see {@link PushSubscription} for the TypeScript type definition
 */
// create table public.push_subscriptions (
//     id serial not null,
//     user_id uuid not null,
//     endpoint text not null,
//     p256dh text not null,
//     auth text not null,
//     created_at timestamp with time zone null default now(),
//     constraint push_subscriptions_pkey primary key (id),
//     constraint push_subscriptions_user_id_endpoint_key unique (user_id, endpoint),
//     constraint push_subscriptions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a push subscription in the system
 * @property {string} id - Unique identifier (serial) for the subscription
 * @property {string} user_id - UUID of the user who owns this subscription
 * @property {string} endpoint - URL of the browser's push service
 * @property {string} p256dh - Client's public key
 * @property {string} auth - Client's authentication key
 * @property {string} created_at - ISO 8601 timestamp of when the subscription was created
 */
export type PushSubscription = {
    /** Unique identifier (serial) for the subscription */
    id: string
    /** UUID of the user who owns this subscription */
    user_id: string
    /** URL of the browser's push service */
    endpoint: string
    /** Client's public key */
    p256dh: string
    /** Client's authentication key */
    auth: string
    /** ISO 8601 timestamp of when the subscription was created */
    created_at: string
}
