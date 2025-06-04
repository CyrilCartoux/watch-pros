/**
 * SQL table definition for the notifications table
 * @see {@link Notification} for the TypeScript type definition
 */
// create table public.notifications (
//     id serial not null,
//     user_id uuid not null,
//     listing_id uuid null,
//     model_id uuid null,
//     type text not null,
//     title text not null,
//     message text not null,
//     is_read boolean null default false,
//     created_at timestamp with time zone not null default now(),
//     constraint notifications_pkey primary key (id),
//     constraint notifications_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete set null,
//     constraint notifications_model_id_fkey foreign KEY (model_id) references models (id) on delete set null,
//     constraint notifications_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
//   ) TABLESPACE pg_default;

/**
 * Represents a notification in the system
 * @property {string} id - Unique identifier (serial) for the notification
 * @property {string} user_id - UUID of the user who will receive the notification
 * @property {string} listing_id - UUID of the listing this notification is about (references listings.id, optional)
 * @property {string} model_id - UUID of the watch model this notification is about (references models.id, optional)
 * @property {NotificationType} type - Type of notification (new listing, price drop, sold)
 * @property {string} title - Short title of the notification
 * @property {string} message - Full message content
 * @property {boolean} is_read - Whether the user has read this notification
 * @property {string} created_at - ISO 8601 timestamp of when the notification was created
 */
export type NotificationType = 'new_listing' | 'sold_listing' | 'price_drop'

export type Notification = {
    /** Unique identifier (serial) for the notification */
    id: string
    /** UUID of the user who will receive the notification */
    user_id: string
    /** UUID of the listing this notification is about (references listings.id, optional) */
    listing_id?: string
    /** UUID of the watch model this notification is about (references models.id, optional) */
    model_id?: string
    /** Type of notification (new listing, price drop, sold) */
    type: NotificationType
    /** Short title of the notification */
    title: string
    /** Full message content */
    message: string
    /** Whether the user has read this notification */
    is_read: boolean
    /** ISO 8601 timestamp of when the notification was created */
    created_at: string
}

export type NotificationInsert = Omit<Notification, 'id' | 'created_at'>

export type NotificationUpdate = {
    /** Whether the user has read this notification */
    is_read?: boolean
}
