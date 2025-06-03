/**
 * SQL table definition for the seller_approvals table
 * @see {@link SellerApproval} for the TypeScript type definition
 */
// create table public.seller_approvals (
//     id uuid not null default gen_random_uuid (),
//     seller_id uuid not null,
//     approver_id uuid not null,
//     created_at timestamp with time zone null default now(),
//     updated_at timestamp with time zone null default now(),
//     constraint seller_approvals_pkey primary key (id),
//     constraint seller_approvals_seller_id_approver_id_key unique (seller_id, approver_id),
//     constraint seller_approvals_approver_id_fkey foreign KEY (approver_id) references auth.users (id) on delete CASCADE,
//     constraint seller_approvals_seller_id_fkey foreign KEY (seller_id) references sellers (id) on delete CASCADE
//   ) TABLESPACE pg_default;
//
//   create index IF not exists idx_seller_approvals_seller_id on public.seller_approvals using btree (seller_id) TABLESPACE pg_default;
//
//   create index IF not exists idx_seller_approvals_approver_id on public.seller_approvals using btree (approver_id) TABLESPACE pg_default;
//
//   create trigger update_seller_stats_approvals
//   after INSERT
//   or DELETE
//   or
//   update on seller_approvals for EACH row
//   execute FUNCTION update_seller_stats ();

/**
 * Represents an approval record for a seller in the system
 * @property {string} id - Unique identifier (UUID) for the approval record
 * @property {string} seller_id - UUID of the seller being approved
 * @property {string} approver_id - UUID of the user who approved the seller
 * @property {string} created_at - ISO 8601 timestamp of when the approval was created
 * @property {string} updated_at - ISO 8601 timestamp of when the approval was last updated
 */
export type SellerApproval = {
    /** Unique identifier (UUID) for the approval record */
    id: string
    /** UUID of the seller being approved */
    seller_id: string
    /** UUID of the user who approved the seller */
    approver_id: string
    /** ISO 8601 timestamp of when the approval was created */
    created_at: string | null
    /** ISO 8601 timestamp of when the approval was last updated */
    updated_at: string | null
}