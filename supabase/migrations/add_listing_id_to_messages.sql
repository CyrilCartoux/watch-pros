-- Add listing_id column to messages table
ALTER TABLE public.messages 
ADD COLUMN listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON public.messages(listing_id);

-- Add comment to document the new field
COMMENT ON COLUMN public.messages.listing_id IS 'Optional reference to a listing when the message is about a specific item'; 