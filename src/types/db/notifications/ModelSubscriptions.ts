/**
 * SQL table definition for the model_subscriptions table
 * @see {@link ModelSubscription} for the TypeScript type definition
 */
// create table public.model_subscriptions (
//     id serial not null,
//     user_id uuid not null,
//     model_id uuid not null,
//     created_at timestamp with time zone null default now(),
//     constraint model_subscriptions_pkey primary key (id),
//     constraint model_subscriptions_user_id_model_id_key unique (user_id, model_id),
//     constraint model_subscriptions_model_id_fkey foreign KEY (model_id) references models (id) on delete CASCADE,
//     constraint model_subscriptions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a model subscription in the system
 * @property {string} id - Unique identifier (serial) for the subscription
 * @property {string} user_id - UUID of the user who is subscribed
 * @property {string} model_id - UUID of the watch model being followed (references models.id)
 * @property {string} created_at - ISO 8601 timestamp of when the subscription was created
 */
export type ModelSubscription = {
    /** Unique identifier (serial) for the subscription */
    id: string
    /** UUID of the user who is subscribed */
    user_id: string
    /** UUID of the watch model being followed (references models.id) */
    model_id: string
    /** ISO 8601 timestamp of when the subscription was created */
    created_at: string
}

export type ModelSubscriptionInsert = Omit<ModelSubscription, 'id' | 'created_at'>

export type ModelSubscriptionUpdate = {
    // No updatable fields
}
