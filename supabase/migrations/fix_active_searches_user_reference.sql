-- Fix active_searches user_id reference to use profiles instead of auth.users
-- First, drop the existing foreign key constraint
ALTER TABLE active_searches DROP CONSTRAINT IF EXISTS active_searches_user_id_fkey;
 
-- Add the correct foreign key constraint referencing profiles
ALTER TABLE active_searches 
ADD CONSTRAINT active_searches_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE; 