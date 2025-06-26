-- Create active_searches table
CREATE TABLE IF NOT EXISTS active_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('watch', 'accessory')),
    brand_id UUID REFERENCES brands(id),
    model_id UUID REFERENCES models(id),
    reference VARCHAR(100),
    dial_color VARCHAR(100),
    max_price DECIMAL(10,2),
    location VARCHAR(100),
    accessory_type VARCHAR(100),
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    currency VARCHAR(10),
    contact_preferences JSONB DEFAULT '{"email": true, "phone": false, "whatsapp": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_active_searches_user_id ON active_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_active_searches_public_active ON active_searches(is_public, is_active);
CREATE INDEX IF NOT EXISTS idx_active_searches_type ON active_searches(type);
CREATE INDEX IF NOT EXISTS idx_active_searches_brand_id ON active_searches(brand_id);
CREATE INDEX IF NOT EXISTS idx_active_searches_created_at ON active_searches(created_at DESC);

-- Enable RLS
ALTER TABLE active_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view public active searches" ON active_searches
    FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Users can view their own active searches" ON active_searches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own active searches" ON active_searches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own active searches" ON active_searches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own active searches" ON active_searches
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_active_searches_updated_at 
    BEFORE UPDATE ON active_searches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 