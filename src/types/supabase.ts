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
          gender: string | null
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
          gender?: string | null
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
          gender?: string | null
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
      seller_banking: {
        Row: {
          id: string
          seller_id: string
          card_holder: string | null
          cvc: string | null
          is_authorized: boolean | null
          account_holder: string | null
          sepa_street: string | null
          sepa_postal_code: string | null
          sepa_city: string | null
          bank_name: string | null
          payment_method: string
          card_number: string | null
          expiry_date: string | null
          sepa_country: string | null
          created_at: string
          updated_at: string
          bic: string | null
          iban: string | null
        }
        Insert: {
          id?: string
          seller_id: string
          card_holder?: string | null
          cvc?: string | null
          is_authorized?: boolean | null
          account_holder?: string | null
          sepa_street?: string | null
          sepa_postal_code?: string | null
          sepa_city?: string | null
          bank_name?: string | null
          payment_method: string
          card_number?: string | null
          expiry_date?: string | null
          sepa_country?: string | null
          created_at?: string
          updated_at?: string
          bic?: string | null
          iban?: string | null
        }
        Update: {
          id?: string
          seller_id?: string
          card_holder?: string | null
          cvc?: string | null
          is_authorized?: boolean | null
          account_holder?: string | null
          sepa_street?: string | null
          sepa_postal_code?: string | null
          sepa_city?: string | null
          bank_name?: string | null
          payment_method?: string
          card_number?: string | null
          expiry_date?: string | null
          sepa_country?: string | null
          created_at?: string
          updated_at?: string
          bic?: string | null
          iban?: string | null
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
      seller_approvals: {
        Row: {
          id: string
          seller_id: string
          approver_id: string
          created_at: string
          updated_at: string
          is_verified: boolean
        }
        Insert: {
          id?: string
          seller_id: string
          approver_id: string
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
        Update: {
          id?: string
          seller_id?: string
          approver_id?: string
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
      }
      seller_stats: {
        Row: {
          id: string
          seller_id: string
          total_reviews: number
          average_rating: number
          total_approvals: number
          verified_approvals: number
          last_updated: string
        }
        Insert: {
          id?: string
          seller_id: string
          total_reviews?: number
          average_rating?: number
          total_approvals?: number
          verified_approvals?: number
          last_updated?: string
        }
        Update: {
          id?: string
          seller_id?: string
          total_reviews?: number
          average_rating?: number
          total_approvals?: number
          verified_approvals?: number
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