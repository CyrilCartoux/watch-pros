export type ActiveSearch = {
    /** Unique identifier (UUID) for the active search */
    id: string
    /** UUID of the user who created the search */
    user_id: string
    /** Title of the search request */
    title: string
    /** Detailed description of what the user is looking for */
    description: string | null
    /** Type of item being searched (watch or accessory) */
    type: 'watch' | 'accessory'
    /** UUID of the brand to search for (optional) */
    brand_id: string | null
    /** UUID of the model to search for (optional) */
    model_id: string | null
    /** Specific reference to search for (optional) */
    reference: string | null
    /** Dial color to search for (optional) */
    dial_color: string | null
    /** Maximum price threshold (optional) */
    max_price: number | null
    /** Preferred location (optional) */
    location: string | null
    /** Type of accessory to search for (optional) */
    accessory_type: string | null
    /** Whether the search is publicly visible */
    is_public: boolean
    /** Whether the search is still active */
    is_active: boolean
    /** Contact preferences for receiving offers */
    contact_preferences: {
        email: boolean
        phone: boolean
        whatsapp: boolean
    }
    /** ISO 8601 timestamp of when the search was created */
    created_at: string
    /** ISO 8601 timestamp of when the search was last updated */
    updated_at: string
}

export type ActiveSearchInsert = Omit<ActiveSearch, 'id' | 'created_at' | 'updated_at'>

export type ActiveSearchUpdate = {
    /** Title of the search request */
    title?: string
    /** Detailed description of what the user is looking for */
    description?: string | null
    /** Type of item being searched (watch or accessory) */
    type?: 'watch' | 'accessory'
    /** UUID of the brand to search for (optional) */
    brand_id?: string | null
    /** UUID of the model to search for (optional) */
    model_id?: string | null
    /** Specific reference to search for (optional) */
    reference?: string | null
    /** Dial color to search for (optional) */
    dial_color?: string | null
    /** Maximum price threshold (optional) */
    max_price?: number | null
    /** Preferred location (optional) */
    location?: string | null
    /** Type of accessory to search for (optional) */
    accessory_type?: string | null
    /** Whether the search is publicly visible */
    is_public?: boolean
    /** Whether the search is still active */
    is_active?: boolean
    /** Contact preferences for receiving offers */
    contact_preferences?: {
        email: boolean
        phone: boolean
        whatsapp: boolean
    }
} 