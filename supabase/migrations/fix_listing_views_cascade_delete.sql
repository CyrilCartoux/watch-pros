-- Fix listing_views foreign key constraint to include ON DELETE CASCADE
-- This allows listings to be deleted even when they have associated view records

-- First, drop the existing foreign key constraint
ALTER TABLE listing_views DROP CONSTRAINT IF EXISTS listing_views_listing_id_fkey;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE listing_views 
ADD CONSTRAINT listing_views_listing_id_fkey 
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE; 