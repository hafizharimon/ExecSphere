-- Mentor Board Database Schema

-- Create mentor profiles table
CREATE TABLE mentor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    expertise_summary TEXT,
    years_experience INTEGER,
    hourly_rate DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',
    availability_status VARCHAR(20) DEFAULT 'available', -- available, busy, unavailable
    max_mentees INTEGER DEFAULT 10,
    current_mentees_count INTEGER DEFAULT 0,
    total_mentees_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    impact_score DECIMAL(8,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    profile_image_url VARCHAR(255),
    cover_image_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    website_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentor service tags table
CREATE TABLE mentor_service_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- strategy, operations, marketing, finance, etc.
    description TEXT,
    color VARCHAR(7), -- hex color code
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentor tags relationship table
CREATE TABLE mentor_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES mentor_service_tags(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 5, -- 1-10 scale
    years_experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, tag_id)
);

-- Create mentor articles table
CREATE TABLE mentor_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    reading_time INTEGER, -- in minutes
    tags TEXT[], -- array of tags
    seo_title VARCHAR(255),
    seo_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentorship requests table
CREATE TABLE mentorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL, -- consultation, ongoing_mentorship, project_based
    service_tags UUID[] NOT NULL, -- array of tag IDs
    project_description TEXT NOT NULL,
    expected_duration VARCHAR(50), -- 1-3 months, 3-6 months, etc.
    budget_range VARCHAR(50),
    urgency_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    preferred_communication VARCHAR(50), -- video_call, chat, email, in_person
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, in_progress, completed, cancelled
    mentor_response TEXT,
    admin_notes TEXT,
    matched_score DECIMAL(5,2), -- matching algorithm score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create mentorship sessions table
CREATE TABLE mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentorship_request_id UUID REFERENCES mentorship_requests(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- consultation, review, workshop, check_in
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    session_notes TEXT,
    mentor_feedback TEXT,
    mentee_feedback TEXT,
    session_rating INTEGER, -- 1-5 stars
    meeting_url VARCHAR(255),
    recording_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentor achievements table
CREATE TABLE mentor_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- milestone, award, certification, success_story
    title VARCHAR(255) NOT NULL,
    description TEXT,
    achievement_date DATE,
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    verification_document_url VARCHAR(255),
    impact_score_contribution DECIMAL(5,2) DEFAULT 0.00,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentor reviews table
CREATE TABLE mentor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentorship_request_id UUID REFERENCES mentorship_requests(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    service_tags UUID[], -- which services were reviewed
    would_recommend BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentor analytics table
CREATE TABLE mentor_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    profile_views INTEGER DEFAULT 0,
    article_views INTEGER DEFAULT 0,
    service_requests INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    new_mentees INTEGER DEFAULT 0,
    impact_score_change DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, date)
);

-- Create mentor company partnerships table
CREATE TABLE mentor_company_partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    partnership_type VARCHAR(50) NOT NULL, -- advisor, consultant, board_member, investor
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    role_description TEXT,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mentor availability table
CREATE TABLE mentor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, day_of_week, start_time, end_time)
);

-- Create indexes for better performance
CREATE INDEX idx_mentor_profiles_user_id ON mentor_profiles(user_id);
CREATE INDEX idx_mentor_profiles_availability ON mentor_profiles(availability_status);
CREATE INDEX idx_mentor_profiles_impact_score ON mentor_profiles(impact_score DESC);
CREATE INDEX idx_mentor_profiles_rating ON mentor_profiles(rating DESC);
CREATE INDEX idx_mentor_profiles_featured ON mentor_profiles(is_featured);
CREATE INDEX idx_mentor_profiles_active ON mentor_profiles(is_active);

CREATE INDEX idx_mentor_tags_mentor_id ON mentor_tags(mentor_id);
CREATE INDEX idx_mentor_tags_tag_id ON mentor_tags(tag_id);
CREATE INDEX idx_mentor_tags_proficiency ON mentor_tags(proficiency_level DESC);

CREATE INDEX idx_mentor_articles_mentor_id ON mentor_articles(mentor_id);
CREATE INDEX idx_mentor_articles_status ON mentor_articles(status);
CREATE INDEX idx_mentor_articles_published ON mentor_articles(published_at DESC);
CREATE INDEX idx_mentor_articles_slug ON mentor_articles(slug);

CREATE INDEX idx_mentorship_requests_company_id ON mentorship_requests(company_id);
CREATE INDEX idx_mentorship_requests_mentor_id ON mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_requests_status ON mentorship_requests(status);
CREATE INDEX idx_mentorship_requests_created ON mentorship_requests(created_at DESC);

CREATE INDEX idx_mentor_reviews_mentor_id ON mentor_reviews(mentor_id);
CREATE INDEX idx_mentor_reviews_rating ON mentor_reviews(rating);
CREATE INDEX idx_mentor_reviews_created ON mentor_reviews(created_at DESC);

CREATE INDEX idx_mentor_analytics_mentor_id ON mentor_analytics(mentor_id);
CREATE INDEX idx_mentor_analytics_date ON mentor_analytics(date DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_mentor_profiles_updated_at 
    BEFORE UPDATE ON mentor_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_articles_updated_at 
    BEFORE UPDATE ON mentor_articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_requests_updated_at 
    BEFORE UPDATE ON mentorship_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentorship_sessions_updated_at 
    BEFORE UPDATE ON mentorship_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default service tags
INSERT INTO mentor_service_tags (name, category, description, color, icon) VALUES
('Business Strategy', 'strategy', 'Strategic planning and business development', '#3B82F6', 'target'),
('Digital Transformation', 'strategy', 'Technology adoption and digital strategy', '#8B5CF6', 'zap'),
('Leadership Development', 'leadership', 'Executive coaching and leadership skills', '#10B981', 'users'),
('Team Building', 'leadership', 'Building and managing high-performance teams', '#F59E0B', 'users-2'),
('Fundraising', 'finance', 'Venture capital and investment strategies', '#EF4444', 'trending-up'),
('Financial Planning', 'finance', 'Financial strategy and planning', '#06B6D4', 'dollar-sign'),
('Marketing Strategy', 'marketing', 'Brand building and marketing campaigns', '#EC4899', 'megaphone'),
('Sales Optimization', 'sales', 'Sales process and revenue growth', '#84CC16', 'trending-up'),
('Product Development', 'product', 'Product strategy and development', '#F97316', 'package'),
('Operations Management', 'operations', 'Operational efficiency and process optimization', '#6B7280', 'settings'),
('HR & Talent', 'hr', 'Human resources and talent acquisition', '#14B8A6', 'user-plus'),
('Legal & Compliance', 'legal', 'Legal strategy and regulatory compliance', '#7C3AED', 'shield'),
('International Expansion', 'growth', 'Global market entry and expansion', '#DC2626', 'globe'),
('Mergers & Acquisitions', 'growth', 'M&A strategy and execution', '#059669', 'git-merge'),
('Crisis Management', 'leadership', 'Crisis response and business continuity', '#B91C1C', 'alert-triangle'),
('Innovation Management', 'strategy', 'Innovation processes and R&D strategy', '#7C2D12', 'lightbulb');
