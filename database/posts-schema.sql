-- Posts and AI Routing Schema for PostgreSQL

-- Create posts table with comprehensive fields
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type VARCHAR(20) NOT NULL CHECK (post_type IN ('share', 'question', 'comment-only')),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Audience and Routing
    target_audience JSONB NOT NULL DEFAULT '["all"]',
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'role-specific', 'company-only')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    
    -- Response Settings
    response_limit INTEGER, -- NULL means unlimited
    current_response_count INTEGER DEFAULT 0,
    allow_replies BOOLEAN DEFAULT TRUE,
    
    -- AI Integration
    ai_first_response BOOLEAN DEFAULT FALSE,
    selected_ai_model VARCHAR(20),
    ai_response_generated BOOLEAN DEFAULT FALSE,
    ai_response_id UUID,
    
    -- Content Analysis
    content_analysis JSONB,
    detected_topics JSONB DEFAULT '[]',
    suggested_tags JSONB DEFAULT '[]',
    
    -- Tags and Categories
    tags JSONB DEFAULT '[]',
    category VARCHAR(50),
    
    -- Engagement Metrics
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    
    -- Status and Moderation
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'flagged', 'deleted')),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create post_responses table
CREATE TABLE post_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_response_id UUID REFERENCES post_responses(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT NOT NULL,
    
    -- AI Response Fields
    is_ai_response BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(50),
    ai_confidence DECIMAL(3,2),
    is_first_response BOOLEAN DEFAULT FALSE,
    
    -- Engagement
    likes INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'flagged', 'deleted')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create post_routing table for audience-based delivery
CREATE TABLE post_routing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    target_role VARCHAR(50) NOT NULL,
    priority INTEGER DEFAULT 1,
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create post_tags table for tag management
CREATE TABLE post_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    tag_type VARCHAR(20) DEFAULT 'user' CHECK (tag_type IN ('user', 'ai-suggested', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, tag_name)
);

-- Create ai_responses table for detailed AI response tracking
CREATE TABLE ai_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    response_id UUID REFERENCES post_responses(id) ON DELETE CASCADE,
    
    -- AI Model Information
    ai_model VARCHAR(50) NOT NULL,
    model_version VARCHAR(20),
    
    -- Request and Response Data
    request_data JSONB,
    response_data JSONB,
    
    -- Quality Metrics
    confidence_score DECIMAL(3,2),
    relevance_score DECIMAL(3,2),
    helpfulness_score DECIMAL(3,2),
    
    -- Performance Metrics
    response_time_ms INTEGER,
    token_count INTEGER,
    cost_estimate DECIMAL(8,4),
    
    -- Status
    generation_status VARCHAR(20) DEFAULT 'completed' CHECK (generation_status IN ('pending', 'completed', 'failed', 'timeout')),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create post_analytics table for detailed analytics
CREATE TABLE post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Daily metrics
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Audience breakdown
    audience_breakdown JSONB DEFAULT '{}',
    
    -- Engagement metrics
    avg_read_time DECIMAL(5,2),
    bounce_rate DECIMAL(3,2),
    engagement_rate DECIMAL(3,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, date)
);

-- Create post_interactions table for user interactions
CREATE TABLE post_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Interaction types
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('view', 'like', 'comment', 'share', 'bookmark', 'report')),
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(post_id, user_id, interaction_type)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_target_audience ON posts USING GIN(target_audience);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_priority ON posts(priority);
CREATE INDEX idx_posts_ai_first_response ON posts(ai_first_response);
CREATE INDEX idx_posts_engagement ON posts(engagement_score DESC);

CREATE INDEX idx_post_responses_post ON post_responses(post_id);
CREATE INDEX idx_post_responses_author ON post_responses(author_id);
CREATE INDEX idx_post_responses_parent ON post_responses(parent_response_id);
CREATE INDEX idx_post_responses_ai ON post_responses(is_ai_response);
CREATE INDEX idx_post_responses_created ON post_responses(created_at DESC);

CREATE INDEX idx_post_routing_post ON post_routing(post_id);
CREATE INDEX idx_post_routing_role ON post_routing(target_role);
CREATE INDEX idx_post_routing_delivered ON post_routing(is_delivered);

CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_name ON post_tags(tag_name);
CREATE INDEX idx_post_tags_type ON post_tags(tag_type);

CREATE INDEX idx_ai_responses_post ON ai_responses(post_id);
CREATE INDEX idx_ai_responses_model ON ai_responses(ai_model);
CREATE INDEX idx_ai_responses_status ON ai_responses(generation_status);
CREATE INDEX idx_ai_responses_confidence ON ai_responses(confidence_score DESC);

CREATE INDEX idx_post_analytics_post ON post_analytics(post_id);
CREATE INDEX idx_post_analytics_date ON post_analytics(date DESC);

CREATE INDEX idx_post_interactions_post ON post_interactions(post_id);
CREATE INDEX idx_post_interactions_user ON post_interactions(user_id);
CREATE INDEX idx_post_interactions_type ON post_interactions(interaction_type);
CREATE INDEX idx_post_interactions_created ON post_interactions(created_at DESC);

-- Create functions for post management

-- Function to update engagement score
CREATE OR REPLACE FUNCTION update_post_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts 
    SET engagement_score = (
        (likes * 1.0) + 
        (comments * 2.0) + 
        (shares * 3.0) + 
        (views * 0.1)
    ) / GREATEST(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 3600, 1)
    WHERE id = NEW.post_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for engagement score updates
CREATE TRIGGER update_engagement_on_interaction 
    AFTER INSERT ON post_interactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_post_engagement_score();

-- Function to create post routing entries
CREATE OR REPLACE FUNCTION create_post_routing()
RETURNS TRIGGER AS $$
DECLARE
    audience_role TEXT;
BEGIN
    -- Create routing entries for each target audience
    FOR audience_role IN SELECT jsonb_array_elements_text(NEW.target_audience)
    LOOP
        INSERT INTO post_routing (post_id, target_role, priority)
        VALUES (
            NEW.id, 
            audience_role, 
            CASE NEW.priority 
                WHEN 'high' THEN 1 
                WHEN 'medium' THEN 2 
                ELSE 3 
            END
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for post routing
CREATE TRIGGER create_routing_on_post_insert 
    AFTER INSERT ON posts 
    FOR EACH ROW 
    EXECUTE FUNCTION create_post_routing();

-- Function to update response count
CREATE OR REPLACE FUNCTION update_response_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts 
    SET current_response_count = (
        SELECT COUNT(*) 
        FROM post_responses 
        WHERE post_id = NEW.post_id AND status = 'published'
    )
    WHERE id = NEW.post_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for response count updates
CREATE TRIGGER update_response_count_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON post_responses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_response_count();

-- Function to check response limit
CREATE OR REPLACE FUNCTION check_response_limit()
RETURNS TRIGGER AS $$
DECLARE
    post_record RECORD;
BEGIN
    SELECT response_limit, current_response_count 
    INTO post_record 
    FROM posts 
    WHERE id = NEW.post_id;
    
    IF post_record.response_limit IS NOT NULL AND 
       post_record.current_response_count >= post_record.response_limit THEN
        RAISE EXCEPTION 'Response limit reached for this post';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for response limit check
CREATE TRIGGER check_response_limit_trigger 
    BEFORE INSERT ON post_responses 
    FOR EACH ROW 
    EXECUTE FUNCTION check_response_limit();

-- Create view for post feed with user context
CREATE VIEW post_feed_view AS
SELECT 
    p.*,
    u.name as author_name,
    u.role as author_role,
    u.organization as author_company,
    u.profile_image_url as author_avatar,
    u.is_verified as author_verified,
    u.mca_verified as author_mca_verified,
    
    -- AI Response data
    ar.ai_model,
    ar.confidence_score as ai_confidence,
    pr_ai.content as ai_response_content,
    pr_ai.likes as ai_response_likes,
    pr_ai.created_at as ai_response_timestamp,
    
    -- Engagement metrics
    COALESCE(pa.views, 0) as daily_views,
    COALESCE(pa.engagement_rate, 0) as daily_engagement_rate
    
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN ai_responses ar ON p.ai_response_id = ar.id
LEFT JOIN post_responses pr_ai ON ar.response_id = pr_ai.id
LEFT JOIN post_analytics pa ON p.id = pa.post_id AND pa.date = CURRENT_DATE
WHERE p.status = 'published' 
  AND p.deleted_at IS NULL
  AND (p.scheduled_at IS NULL OR p.scheduled_at <= CURRENT_TIMESTAMP);

-- Insert sample data
INSERT INTO posts (
    title, content, post_type, author_id, target_audience, 
    ai_first_response, selected_ai_model, tags, priority, status
) VALUES 
(
    'AI Governance Framework Implementation',
    'What are your thoughts on implementing AI governance frameworks in large organizations? We''re seeing increased regulatory scrutiny and need to balance innovation with compliance.',
    'question',
    (SELECT id FROM users WHERE email = 'ceo@techcorp.com' LIMIT 1),
    '["cto", "ceo"]',
    TRUE,
    'openai',
    '["ai-governance", "compliance", "leadership"]',
    'high',
    'published'
),
(
    'Remote Team Leadership Insights',
    'Sharing insights from our recent board meeting: The future of work is not just remote vs. office - it''s about creating hybrid experiences that maximize both collaboration and individual productivity.',
    'share',
    (SELECT id FROM users WHERE email = 'cto@innovate.com' LIMIT 1),
    '["all"]',
    TRUE,
    'gemini',
    '["future-of-work", "leadership", "productivity"]',
    'medium',
    'published'
);
