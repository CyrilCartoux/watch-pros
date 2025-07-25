/**
 * SQL table definition for the subscriptions table
 * @see {@link Subscription} for the TypeScript type definition
 */
// create table public.subscriptions (
//   id uuid not null default gen_random_uuid (),
//   user_id uuid not null,
//   stripe_customer_id text not null,
//   stripe_subscription_id text not null,
//   price_id text not null,
//   product_id text null,
//   status text not null,
//   payment_method_id text null,
//   pm_type text null,
//   pm_last4 text null,
//   pm_brand text null,
//   trial_end timestamp with time zone null,
//   current_period_start timestamp with time zone null,
//   current_period_end timestamp with time zone null,
//   cancel_at_period_end boolean null default false,
//   canceled_at timestamp with time zone null,
//   created_at timestamp with time zone null default now(),
//   constraint subscriptions_pkey primary key (id),
//   constraint subscriptions_stripe_subscription_id_key unique (stripe_subscription_id),
//   constraint subscriptions_price_id_fkey foreign KEY (price_id) references subscription_plans (price_id),
//   constraint subscriptions_user_id_fkey foreign KEY (user_id) references profiles (id)


// ) TABLESPACE pg_default;
export type SubscriptionStatus = 
  | 'incomplete' 
  | 'incomplete_expired' 
  | 'trialing' 
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid'

export type PaymentMethodType = 'card' | 'sepa_debit'

export type Subscription = {
  /** Unique identifier for the subscription record */
  id: string
  /** UUID of the user who owns this subscription */
  user_id: string
  /** Stripe customer ID */
  stripe_customer_id: string
  /** Stripe subscription ID */
  stripe_subscription_id: string
  /** Stripe price ID */
  price_id: string
  /** Stripe product ID */
  product_id: string | null
  /** Current status of the subscription */
  status: SubscriptionStatus
  /** ID of the default payment method */
  payment_method_id: string | null
  /** Type of payment method (card, sepa_debit) */
  pm_type: PaymentMethodType | null
  /** Last 4 digits of the payment method */
  pm_last4: string | null
  /** Brand of the payment method (visa, mastercard, etc.) */
  pm_brand: string | null
  /** End of trial period if applicable */
  trial_end: string | null
  /** Start of current billing period */
  current_period_start: string | null
  /** End of current billing period */
  current_period_end: string | null
  /** Whether the subscription will be canceled at the end of the current period */
  cancel_at_period_end: boolean
  /** When the subscription was canceled */
  canceled_at: string | null
  /** When the subscription record was created */
  created_at: string
}

export type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at'>

export type SubscriptionUpdate = Partial<Omit<Subscription, 'id' | 'user_id' | 'stripe_customer_id' | 'stripe_subscription_id' | 'created_at'>> 