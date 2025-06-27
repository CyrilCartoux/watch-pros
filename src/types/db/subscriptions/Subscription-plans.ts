//create table public.subscription_plans (
  //  price_id text not null,
//    max_listings integer null,
//    name text not null,
//    constraint subscription_plans_pkey primary key (price_id)
 // ) TABLESPACE pg_default;

 export type SubscriptionPlan = {
    price_id: string
    max_listings: number | null
    name: string | null
 }