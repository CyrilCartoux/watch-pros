-- Create conversations table
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT different_participants CHECK (participant1_id != participant2_id)
);

-- Create messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for conversations
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view their own conversations"
    ON conversations FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE id = participant1_id OR id = participant2_id
        )
    );

CREATE POLICY "Users can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles WHERE id = participant1_id OR id = participant2_id
        )
    );

-- Policies for messages
CREATE POLICY "Users can view messages in their conversations"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations
            WHERE id = messages.conversation_id
            AND (
                participant1_id IN (SELECT id FROM profiles WHERE id = auth.uid())
                OR participant2_id IN (SELECT id FROM profiles WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id IN (SELECT id FROM profiles WHERE id = auth.uid()) AND
        EXISTS (
            SELECT 1 FROM conversations
            WHERE id = conversation_id
            AND (
                participant1_id IN (SELECT id FROM profiles WHERE id = auth.uid())
                OR participant2_id IN (SELECT id FROM profiles WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (sender_id IN (SELECT id FROM profiles WHERE id = auth.uid()))
    WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE id = auth.uid())); 