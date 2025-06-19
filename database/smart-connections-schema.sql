-- Smart Connections and Chat System Schema

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Smart Connections table
CREATE TABLE smart_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recommended_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    connection_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    recommendation_reasons JSONB,
    status VARCHAR(20) DEFAULT 'suggested', -- suggested, connected, declined, blocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    connected_at TIMESTAMP WITH TIME ZONE,
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, recommended_user_id)
);

-- Connection factors for scoring algorithm
CREATE TABLE connection_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factor_name VARCHAR(100) NOT NULL UNIQUE,
    weight DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat conversations
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_type VARCHAR(20) DEFAULT 'direct', -- direct, group, company_mentorship
    title VARCHAR(255),
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID, -- References company if company-specific chat
    mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat participants
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_muted BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    UNIQUE(conversation_id, user_id)
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system
    content TEXT,
    metadata JSONB, -- For attachments, mentions, etc.
    reply_to_message_id UUID REFERENCES chat_messages(id),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Message reactions
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL, -- like, love, laugh, angry, sad
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, reaction_type)
);

-- Chat sessions for real-time tracking
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    socket_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Company mentorship groups
CREATE TABLE company_mentorship_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company mentorship group members
CREATE TABLE company_mentorship_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES company_mentorship_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- mentor, admin, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, user_id)
);

-- Connection interaction logs
CREATE TABLE connection_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- profile_view, message_sent, connection_request, etc.
    interaction_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_smart_connections_user_id ON smart_connections(user_id);
CREATE INDEX idx_smart_connections_recommended_user_id ON smart_connections(recommended_user_id);
CREATE INDEX idx_smart_connections_status ON smart_connections(status);
CREATE INDEX idx_smart_connections_score ON smart_connections(connection_score DESC);
CREATE INDEX idx_smart_connections_updated_at ON smart_connections(updated_at DESC);

CREATE INDEX idx_chat_conversations_company_id ON chat_conversations(company_id);
CREATE INDEX idx_chat_conversations_mentor_id ON chat_conversations(mentor_id);
CREATE INDEX idx_chat_conversations_last_message_at ON chat_conversations(last_message_at DESC);

CREATE INDEX idx_chat_participants_conversation_id ON chat_participants(conversation_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_participants_last_read_at ON chat_participants(last_read_at);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_sent_at ON chat_messages(sent_at DESC);
CREATE INDEX idx_chat_messages_reply_to ON chat_messages(reply_to_message_id);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_session_token ON chat_sessions(session_token);
CREATE INDEX idx_chat_sessions_active ON chat_sessions(is_active, expires_at);

CREATE INDEX idx_company_mentorship_groups_company_id ON company_mentorship_groups(company_id);
CREATE INDEX idx_company_mentorship_groups_mentor_id ON company_mentorship_groups(mentor_id);

CREATE INDEX idx_connection_interactions_user_id ON connection_interactions(user_id);
CREATE INDEX idx_connection_interactions_target_user_id ON connection_interactions(target_user_id);
CREATE INDEX idx_connection_interactions_type ON connection_interactions(interaction_type);
CREATE INDEX idx_connection_interactions_created_at ON connection_interactions(created_at DESC);

-- Insert default connection factors
INSERT INTO connection_factors (factor_name, weight, description) VALUES
('same_role', 0.25, 'Users with the same C-level role'),
('same_industry', 0.20, 'Users in the same industry'),
('shared_mentor', 0.30, 'Users who share the same mentor'),
('company_size_similarity', 0.15, 'Companies with similar employee count'),
('geographic_proximity', 0.10, 'Users in the same region/country'),
('experience_level', 0.15, 'Similar years of experience'),
('mutual_connections', 0.25, 'Users with mutual connections'),
('event_attendance', 0.10, 'Users who attended same events'),
('forum_activity', 0.05, 'Users active in same forum categories');

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_smart_connections_updated_at 
    BEFORE UPDATE ON smart_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_mentorship_groups_updated_at 
    BEFORE UPDATE ON company_mentorship_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired chat sessions
CREATE OR REPLACE FUNCTION cleanup_expired_chat_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM chat_sessions 
    WHERE expires_at < CURRENT_TIMESTAMP OR 
          (is_active = FALSE AND last_activity_at < CURRENT_TIMESTAMP - INTERVAL '1 hour');
END;
$$ LANGUAGE plpgsql;

-- Function to update conversation last message time
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations 
    SET last_message_at = NEW.sent_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
