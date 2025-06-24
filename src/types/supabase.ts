// -- WARNING: This schema is for context only and is not meant to be run.
// -- Table order and constraints may not be valid for execution.

// CREATE TABLE public.brands (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   slug text NOT NULL UNIQUE,
//   label text NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   popular boolean DEFAULT false,
//   CONSTRAINT brands_pkey PRIMARY KEY (id)
// );
// CREATE TABLE public.conversations (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   participant1_id uuid NOT NULL,
//   participant2_id uuid NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   CONSTRAINT conversations_pkey PRIMARY KEY (id),
//   CONSTRAINT conversations_participant1_id_fkey FOREIGN KEY (participant1_id) REFERENCES public.profiles(id),
//   CONSTRAINT conversations_participant2_id_fkey FOREIGN KEY (participant2_id) REFERENCES public.profiles(id)
// );
// CREATE TABLE public.custom_alerts (
//   id integer NOT NULL DEFAULT nextval('custom_alerts_id_seq'::regclass),
//   user_id uuid NOT NULL,
//   brand_id uuid,
//   model_id uuid,
//   reference text,
//   max_price numeric,
//   location text,
//   created_at timestamp with time zone NOT NULL DEFAULT now(),
//   dial_color text,
//   accessory_type text,
//   type text,
//   CONSTRAINT custom_alerts_pkey PRIMARY KEY (id),
//   CONSTRAINT custom_alerts_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
//   CONSTRAINT custom_alerts_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id),
//   CONSTRAINT custom_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
// );
// CREATE TABLE public.favorites (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   user_id uuid NOT NULL,
//   listing_id uuid NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   CONSTRAINT favorites_pkey PRIMARY KEY (id),
//   CONSTRAINT favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id),
//   CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
// );
// CREATE TABLE public.listing_images (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   listing_id uuid,
//   url text NOT NULL,
//   order_index integer NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   CONSTRAINT listing_images_pkey PRIMARY KEY (id),
//   CONSTRAINT listing_images_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
// );
// CREATE TABLE public.listing_subscriptions (
//   id integer NOT NULL DEFAULT nextval('listing_subscriptions_id_seq'::regclass),
//   user_id uuid NOT NULL,
//   listing_id uuid NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT now(),
//   CONSTRAINT listing_subscriptions_pkey PRIMARY KEY (id),
//   CONSTRAINT listing_subscriptions_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id),
//   CONSTRAINT listing_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
// );
// CREATE TABLE public.listings (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   reference_id text NOT NULL UNIQUE,
//   seller_id uuid NOT NULL,
//   brand_id uuid NOT NULL,
//   model_id uuid NOT NULL,
//   reference character varying NOT NULL,
//   title character varying NOT NULL,
//   description text,
//   year character varying,
//   dial_color character varying,
//   movement character varying,
//   case_material character varying,
//   bracelet_material character varying,
//   bracelet_color character varying,
//   included character varying,
//   condition character varying,
//   price numeric NOT NULL,
//   currency character varying NOT NULL DEFAULT 'EUR'::character varying,
//   shipping_delay character varying,
//   status character varying DEFAULT NULL::character varying,
//   created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
//   updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
//   listing_type text CHECK (listing_type = ANY (ARRAY['watch'::text, 'accessory'::text])),
//   accessory_type character varying,
//   final_price numeric,
//   brand_label text,
//   brand_slug text,
//   model_label text,
//   model_slug text,
//   country character varying,
//   sold_at timestamp with time zone,
//   fts tsvector DEFAULT ((((setweight(to_tsvector('english'::regconfig, COALESCE(brand_label, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(model_label, ''::text)), 'A'::"char")) || setweight(to_tsvector('english'::regconfig, (COALESCE(reference, ''::character varying))::text), 'B'::"char")) || setweight(to_tsvector('english'::regconfig, (COALESCE(title, ''::character varying))::text), 'B'::"char")) || setweight(to_tsvector('english'::regconfig, COALESCE(description, ''::text)), 'C'::"char")),
//   CONSTRAINT listings_pkey PRIMARY KEY (id),
//   CONSTRAINT listings_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id),
//   CONSTRAINT listings_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
//   CONSTRAINT listings_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
// );
// CREATE TABLE public.messages (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   conversation_id uuid NOT NULL,
//   sender_id uuid NOT NULL,
//   content text NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   read boolean DEFAULT false,
//   listing_id uuid,
//   CONSTRAINT messages_pkey PRIMARY KEY (id),
//   CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
//   CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id),
//   CONSTRAINT messages_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
// );
// CREATE TABLE public.models (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   brand_id uuid NOT NULL,
//   slug text NOT NULL,
//   label text NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   popular boolean DEFAULT false,
//   CONSTRAINT models_pkey PRIMARY KEY (id),
//   CONSTRAINT models_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
// );
// CREATE TABLE public.newsletter_subscribers (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   email text NOT NULL UNIQUE,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'unsubscribed'::text])),
//   CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
// );
// CREATE TABLE public.notifications (
//   id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
//   user_id uuid NOT NULL,
//   listing_id uuid,
//   model_id uuid,
//   type text NOT NULL,
//   title text NOT NULL,
//   message text NOT NULL,
//   is_read boolean DEFAULT false,
//   created_at timestamp with time zone NOT NULL DEFAULT now(),
//   CONSTRAINT notifications_pkey PRIMARY KEY (id),
//   CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
//   CONSTRAINT notifications_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id),
//   CONSTRAINT notifications_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
// );
// CREATE TABLE public.offers (
//   id integer NOT NULL DEFAULT nextval('offers_id_seq'::regclass),
//   seller_id uuid NOT NULL,
//   listing_id uuid NOT NULL,
//   offer numeric NOT NULL,
//   currency text NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT now(),
//   is_accepted boolean,
//   receiver_seller_id uuid NOT NULL,
//   CONSTRAINT offers_pkey PRIMARY KEY (id),
//   CONSTRAINT offers_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id),
//   CONSTRAINT offers_receiver_seller_id_fkey FOREIGN KEY (receiver_seller_id) REFERENCES public.sellers(id),
//   CONSTRAINT offers_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
// );
// CREATE TABLE public.profiles (
//   id uuid NOT NULL,
//   first_name text,
//   last_name text,
//   email text,
//   seller_id uuid,
//   stripe_customer_id text,
//   role text NOT NULL DEFAULT 'user'::text,
//   CONSTRAINT profiles_pkey PRIMARY KEY (id),
//   CONSTRAINT profiles_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id),
//   CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
// );
// CREATE TABLE public.seller_addresses (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   seller_id uuid NOT NULL,
//   street text NOT NULL,
//   address_complement text,
//   postal_code text NOT NULL,
//   city text NOT NULL,
//   fax text,
//   mobile text,
//   website text,
//   siren text,
//   tax_id text,
//   vat_number text,
//   oss boolean,
//   country text NOT NULL,
//   fax_prefix text,
//   mobile_prefix text,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   CONSTRAINT seller_addresses_pkey PRIMARY KEY (id),
//   CONSTRAINT seller_addresses_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
// );
// CREATE TABLE public.seller_reviews (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   seller_id uuid NOT NULL,
//   reviewer_id uuid NOT NULL,
//   rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
//   comment text NOT NULL,
//   created_at timestamp with time zone DEFAULT now(),
//   updated_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT seller_reviews_pkey PRIMARY KEY (id),
//   CONSTRAINT seller_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES auth.users(id),
//   CONSTRAINT seller_reviews_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
// );
// CREATE TABLE public.seller_stats (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   seller_id uuid NOT NULL UNIQUE,
//   total_reviews integer DEFAULT 0,
//   average_rating numeric DEFAULT 0,
//   total_approvals integer DEFAULT 0,
//   last_updated timestamp with time zone DEFAULT now(),
//   CONSTRAINT seller_stats_pkey PRIMARY KEY (id),
//   CONSTRAINT seller_stats_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
// );
// CREATE TABLE public.sellers (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   company_name text NOT NULL,
//   watch_pros_name text NOT NULL,
//   company_status text NOT NULL,
//   first_name text NOT NULL,
//   last_name text NOT NULL,
//   email text NOT NULL UNIQUE,
//   country text NOT NULL,
//   phone_prefix text NOT NULL,
//   phone text NOT NULL,
//   created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
//   id_card_front_url text,
//   id_card_back_url text,
//   proof_of_address_url text,
//   user_id uuid,
//   crypto_friendly boolean NOT NULL DEFAULT false,
//   search_vector tsvector DEFAULT (((setweight(to_tsvector('english'::regconfig, COALESCE(company_name, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(watch_pros_name, ''::text)), 'A'::"char")) || setweight(to_tsvector('english'::regconfig, COALESCE(((first_name || ' '::text) || last_name), ''::text)), 'B'::"char")) || setweight(to_tsvector('english'::regconfig, COALESCE(email, ''::text)), 'C'::"char")),
//   company_logo_url text,
//   identity_verified boolean DEFAULT false,
//   identity_rejected boolean DEFAULT false,
//   CONSTRAINT sellers_pkey PRIMARY KEY (id),
//   CONSTRAINT sellers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
// );
// CREATE TABLE public.subscription_plans (
//   price_id text NOT NULL,
//   max_listings integer,
//   CONSTRAINT subscription_plans_pkey PRIMARY KEY (price_id)
// );
// CREATE TABLE public.subscriptions (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   user_id uuid NOT NULL,
//   stripe_customer_id text NOT NULL,
//   stripe_subscription_id text NOT NULL UNIQUE,
//   price_id text NOT NULL,
//   product_id text,
//   status text NOT NULL,
//   payment_method_id text,
//   pm_type text,
//   pm_last4 text,
//   pm_brand text,
//   trial_end timestamp with time zone,
//   current_period_start timestamp with time zone,
//   current_period_end timestamp with time zone,
//   cancel_at_period_end boolean DEFAULT false,
//   canceled_at timestamp with time zone,
//   created_at timestamp with time zone DEFAULT now(),
//   CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
//   CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
//   CONSTRAINT subscriptions_price_id_fkey FOREIGN KEY (price_id) REFERENCES public.subscription_plans(price_id)
// );

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          slug: string
          label: string
          popular: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          label: string
          popular: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          label?: string
          popular?: boolean
          created_at?: string
        }
      }
      models: {
        Row: {
          id: string
          brand_id: string
          slug: string
          label: string
          popular: boolean
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          slug: string
          label: string
          popular: boolean
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          slug?: string
          label?: string
          popular?: boolean
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          reference_id: string
          seller_id: string
          brand_id: string
          model_id: string
          reference: string
          title: string
          accessory_type: string
          description: string | null
          year: string | null
          serial_number: string | null
          dial_color: string | null
          diameter_min: number | null
          diameter_max: number | null
          movement: string | null
          case_material: string | null
          bracelet_material: string | null
          bracelet_color: string | null
          included: string
          condition: string
          price: number
          currency: string
          shipping_delay: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_id: string
          seller_id: string
          brand_id: string
          model_id: string
          reference: string
          title: string
          accessory_type: string
          description?: string | null
          year?: string | null
          serial_number?: string | null
          dial_color?: string | null
          diameter_min?: number | null
          diameter_max?: number | null
          movement?: string | null
          case_material?: string | null
          bracelet_material?: string | null
          bracelet_color?: string | null
          included: string
          condition: string
          price: number
          currency?: string
          shipping_delay: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_id?: string
          seller_id?: string
          brand_id?: string
          model_id?: string
          reference?: string
          title?: string
          accessory_type?: string
          description?: string | null
          year?: string | null
          serial_number?: string | null
          dial_color?: string | null
          diameter_min?: number | null
          diameter_max?: number | null
          movement?: string | null
          case_material?: string | null
          bracelet_material?: string | null
          bracelet_color?: string | null
          included?: string
          condition?: string
          price?: number
          currency?: string
          shipping_delay?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      listing_images: {
        Row: {
          id: string
          listing_id: string
          url: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          url: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          url?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      listing_documents: {
        Row: {
          id: string
          listing_id: string
          document_type: string
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          document_type: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          document_type?: string
          url?: string
          created_at?: string
          updated_at?: string
        }
      }
      sellers: {
        Row: {
          id: string
          user_id: string
          company_name: string
          watch_pros_name: string
          company_status: string
          first_name: string
          last_name: string
          email: string
          country: string
          title: string
          phone_prefix: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          watch_pros_name: string
          company_status: string
          first_name: string
          last_name: string
          email: string
          country: string
          title: string
          phone_prefix: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          watch_pros_name?: string
          company_status?: string
          first_name?: string
          last_name?: string
          email?: string
          country?: string
          title?: string
          phone_prefix?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      seller_addresses: {
        Row: {
          id: string
          seller_id: string
          street: string
          address_complement: string | null
          postal_code: string
          city: string
          fax: string | null
          mobile: string | null
          website: string | null
          siren: string | null
          tax_id: string | null
          vat_number: string | null
          oss: boolean | null
          country: string
          fax_prefix: string | null
          mobile_prefix: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          street: string
          address_complement?: string | null
          postal_code: string
          city: string
          fax?: string | null
          mobile?: string | null
          website?: string | null
          siren?: string | null
          tax_id?: string | null
          vat_number?: string | null
          oss?: boolean | null
          country: string
          fax_prefix?: string | null
          mobile_prefix?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          street?: string
          address_complement?: string | null
          postal_code?: string
          city?: string
          fax?: string | null
          mobile?: string | null
          website?: string | null
          siren?: string | null
          tax_id?: string | null
          vat_number?: string | null
          oss?: boolean | null
          country?: string
          fax_prefix?: string | null
          mobile_prefix?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seller_documents: {
        Row: {
          id: string
          seller_id: string
          document_type: string
          url: string
          file_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          document_type: string
          url: string
          file_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          document_type?: string
          url?: string
          file_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      seller_reviews: {
        Row: {
          id: string
          seller_id: string
          reviewer_id: string
          rating: number
          comment: string
          created_at: string
          updated_at: string
          is_verified: boolean
          listing_id: string | null
        }
        Insert: {
          id?: string
          seller_id: string
          reviewer_id: string
          rating: number
          comment: string
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          listing_id?: string | null
        }
        Update: {
          id?: string
          seller_id?: string
          reviewer_id?: string
          rating?: number
          comment?: string
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          listing_id?: string | null
        }
      }
      seller_stats: {
        Row: {
          id: string
          seller_id: string
          total_reviews: number
          average_rating: number
          last_updated: string
        }
        Insert: {
          id?: string
          seller_id: string
          total_reviews?: number
          average_rating?: number
          last_updated?: string
        }
        Update: {
          id?: string
          seller_id?: string
          total_reviews?: number
          average_rating?: number
          last_updated?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 

