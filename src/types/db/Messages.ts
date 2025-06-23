/**
 * SQL table definition for the messages table
 * @see {@link Message} for the TypeScript type definition
 */
// create table public.messages (
//     id uuid not null default gen_random_uuid (),
//     conversation_id uuid not null,
//     sender_id uuid not null,
//     content text not null,
//     created_at timestamp with time zone not null default now(),
//     read boolean not null default false,
//     listing_id uuid null,
//     constraint messages_pkey primary key (id),
//     constraint messages_conversation_id_fkey foreign KEY (conversation_id) references conversations (id) on delete CASCADE,
//     constraint messages_sender_id_fkey foreign KEY (sender_id) references profiles (id) on delete CASCADE,
//     constraint messages_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete SET NULL
//   ) TABLESPACE pg_default;

/**
 * Represents a message in a conversation
 * @property {string} id - Unique identifier (UUID) for the message
 * @property {string} conversation_id - UUID of the conversation this message belongs to
 * @property {string} sender_id - UUID of the user who sent the message
 * @property {string} content - The message content
 * @property {string} created_at - ISO 8601 timestamp of when the message was created
 * @property {boolean} read - Whether the message has been read by the recipient
 * @property {string} listing_id - Optional UUID of the listing this message is about
 */
export type Message = {
    /** Unique identifier (UUID) for the message */
    id: string
    /** UUID of the conversation this message belongs to */
    conversation_id: string
    /** UUID of the user who sent the message */
    sender_id: string
    /** The message content */
    content: string
    /** ISO 8601 timestamp of when the message was created */
    created_at: string
    /** Whether the message has been read by the recipient */
    read: boolean
    /** Optional UUID of the listing this message is about */
    listing_id?: string | null
}

export type MessageInsert = Omit<Message, 'id' | 'created_at'>

export type MessageUpdate = {
    /** Whether the message has been read by the recipient */
    read?: boolean
} 