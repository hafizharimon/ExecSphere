-- Complete Platform Database Schema for Indian C-Level Executive Network
-- Designed for mobile-first experience with comprehensive functionality

-- Enhanced Users table with Indian-specific fields
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    linkedin_email VARCHAR(255),
    phone VARCHAR(10) NOT NULL, -- Indian mobile numbers only
    name VARCHAR(255) NOT NULL,
    headline TEXT,
    profile_picture_url TEXT,
    cover_image_url TEXT,
    country VARCHAR(100) DEFAULT 'India',
    location VARCHAR(255),
    personal_website VARCHAR(500),
    linkedin_url VARCHAR(500) NOT NULL, -- Mandatory LinkedIn profile
    twitter_url VARCHAR(500),
    github_url VARCHAR(500),
    
    -- Role and Organization
    current_role VARCHAR(255),
    current_organization VARCHAR(255),
    industry VARCHAR(100),
    
    -- Platform specific
    user_type VARCHAR(50) DEFAULT 'cxo', -- cxo, mentor, admin, super-admin
    is_mentor BOOLEAN DEFAULT false,
    mentor_email_suffix VARCHAR(10) DEFAULT '', -- (M) for mentor login
    is_verified BOOLEAN DEFAULT false,
    mca_verified BOOLEAN DEFAULT false,
    linkedin_verified BOOLEAN DEFAULT false,
    
    -- Experience and Eligibility
    total_executive_years DECIMAL(4,2) DEFAULT 0,
    meets_one_year_rule BOOLEAN DEFAULT false,
    mentorship_eligible BOOLEAN DEFAULT false,
    
    -- Platform Analytics
    profile_views INTEGER DEFAULT 0,
    network_connections INTEGER DEFAULT 0,
    platform_score DECIMAL(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    linkedin_last_sync TIMESTAMP
);

-- Executive Experience with precise date tracking
CREATE TABLE IF NOT EXISTS executive_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position_title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL if current position
    is_current BOOLEAN DEFAULT false,
    location VARCHAR(255),
    description TEXT,
    
    -- LinkedIn Integration
    linkedin_experience_id VARCHAR(255),
    is_linkedin_imported BOOLEAN DEFAULT false,
    
    -- Executive Position Validation
    is_executive_role BOOLEAN DEFAULT false,
    executive_level VARCHAR(50), -- C-level, VP, Director, etc.
    days_in_position INTEGER, -- Calculated field for 365-day rule
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    mca_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies with comprehensive Indian business verification
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    legal_entity_name VARCHAR(255) NOT NULL,
    company_category VARCHAR(100) NOT NULL, -- startup, mnc, public_company, msme, private_limited
    
    -- Indian Legal Identifiers
    cin_number VARCHAR(21), -- Corporate Identity Number
    udyam_number VARCHAR(19), -- Udyam Registration Number
    gstin VARCHAR(15), -- GST Identification Number
    pan_number VARCHAR(10), -- PAN Number
    
    -- Business Details
    industry VARCHAR(100),
    founded_year INTEGER,
    employee_count_range VARCHAR(50),
    headquarters_address TEXT,
    website_url VARCHAR(500),
    description TEXT,
    
    -- LinkedIn Integration
    linkedin_company_url VARCHAR(500) NOT NULL, -- Mandatory LinkedIn company page
    linkedin_company_id VARCHAR(255),
    linkedin_verified BOOLEAN DEFAULT false,
    
    -- Verification Status
    mca_verification_status VARCHAR(50) DEFAULT 'pending',
    udyam_verification_status VARCHAR(50) DEFAULT 'pending',
    overall_verification_status VARCHAR(50) DEFAULT 'pending',
    
    -- Premium Features
    is_premium BOOLEAN DEFAULT false,
    premium_plan VARCHAR(50), -- basic, professional, enterprise
    premium_expires_at TIMESTAMP,
    
    -- Platform Features
    auto_grade_score DECIMAL(5,2) DEFAULT 0,
    public_profile_enabled BOOLEAN DEFAULT true,
    
    -- Social Media
    twitter_url VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    
    -- Media
    logo_url TEXT,
    cover_image_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Company Admins (Multiple admins per company)
CREATE TABLE IF NOT EXISTS company_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'admin', -- admin, owner, manager
    permissions JSONB DEFAULT '[]',
    is_primary BOOLEAN DEFAULT false,
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- Company Products/Services
CREATE TABLE IF NOT EXISTS company_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    category VARCHAR(100),
    price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'INR',
    purchase_url VARCHAR(500),
    demo_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Posts with AI-powered targeting
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT NOT NULL,
    post_type VARCHAR(50) NOT NULL, -- question, share, comment_only
    
    -- AI-Powered Targeting
    target_roles JSONB DEFAULT '[]', -- ["CEO", "CTO", "CMO"] based on AI analysis
    target_industries JSONB DEFAULT '[]',
    ai_analysis JSONB, -- AI analysis results
    
    -- Response Management
    response_limit INTEGER, -- NULL for unlimited
    current_response_count INTEGER DEFAULT 0,
    allows_comments BOOLEAN DEFAULT true,
    allows_replies BOOLEAN DEFAULT true,
    
    -- AI Integration
    ai_first_response BOOLEAN DEFAULT false,
    selected_ai_model VARCHAR(50), -- openai, gemini, grok, meta, deepseek
    ai_response_generated BOOLEAN DEFAULT false,
    
    -- Engagement
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Visibility
    visibility VARCHAR(50) DEFAULT 'public', -- public, role_specific, company_only
    priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Tags and Categories
    tags JSONB DEFAULT '[]',
    category VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Responses to Posts
CREATE TABLE IF NOT EXISTS ai_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    ai_model VARCHAR(50) NOT NULL,
    response_content TEXT NOT NULL,
    confidence_score DECIMAL(3,2),
    is_first_response BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post Responses/Comments
CREATE TABLE IF NOT EXISTS post_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_response_id UUID REFERENCES post_responses(id),
    is_ai_response BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentor Profiles with Service Tags
CREATE TABLE IF NOT EXISTS mentor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    bio TEXT,
    expertise_summary TEXT,
    hourly_rate DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',
    max_mentees INTEGER DEFAULT 10,
    current_mentees_count INTEGER DEFAULT 0,
    total_mentees_served INTEGER DEFAULT 0,
    
    -- Analytics
    success_rate DECIMAL(5,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    
    -- Availability
    availability_status VARCHAR(50) DEFAULT 'available', -- available, busy, unavailable
    
    -- Service Tags
    service_tags JSONB DEFAULT '[]',
    
    -- Profile Enhancement
    articles_count INTEGER DEFAULT 0,
    achievements_count INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentor Service Tags
CREATE TABLE IF NOT EXISTS mentor_service_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
    years_experience INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentorship Requests
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES mentor_profiles(id),
    requester_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id), -- NULL if individual request
    
    request_type VARCHAR(50) NOT NULL, -- consultation, ongoing, project_based
    service_tags JSONB DEFAULT '[]',
    project_description TEXT NOT NULL,
    expected_duration VARCHAR(100),
    budget_range VARCHAR(100),
    urgency_level VARCHAR(50) DEFAULT 'medium',
    
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, in_progress, completed
    mentor_response TEXT,
    admin_notes TEXT,
    
    matching_score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Smart Connections System
CREATE TABLE IF NOT EXISTS smart_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recommended_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    connection_score DECIMAL(5,2) NOT NULL,
    matching_factors JSONB, -- Common interests, industry, experience level
    status VARCHAR(50) DEFAULT 'suggested', -- suggested, connected, declined
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    connected_at TIMESTAMP,
    UNIQUE(user_id, recommended_user_id)
);

-- Chat System
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1_id UUID REFERENCES users(id),
    participant_2_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id), -- For company-wide chats
    conversation_type VARCHAR(50) DEFAULT 'direct', -- direct, company, mentor
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_1_id, participant_2_id, company_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    message_content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- text, file, link
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Badges System
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_type VARCHAR(100) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(100),
    badge_color VARCHAR(50),
    criteria_met JSONB,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT true
);

-- Platform Analytics
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    profile_views INTEGER DEFAULT 0,
    network_views INTEGER DEFAULT 0,
    event_views INTEGER DEFAULT 0,
    post_views INTEGER DEFAULT 0,
    post_likes INTEGER DEFAULT 0,
    post_comments INTEGER DEFAULT 0,
    connections_made INTEGER DEFAULT 0,
    mentor_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Company Analytics
CREATE TABLE IF NOT EXISTS company_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    product_views INTEGER DEFAULT 0,
    employee_profile_views INTEGER DEFAULT 0,
    mentor_requests INTEGER DEFAULT 0,
    premium_conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, date)
);

-- MCA Verification Data Cache
CREATE TABLE IF NOT EXISTS mca_verification_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cin_number VARCHAR(21) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    company_status VARCHAR(100),
    registration_date DATE,
    authorized_capital BIGINT,
    paid_up_capital BIGINT,
    directors JSONB, -- Array of director information
    verification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Udyam Verification Data Cache
CREATE TABLE IF NOT EXISTS udyam_verification_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    udyam_number VARCHAR(19) UNIQUE NOT NULL,
    enterprise_name VARCHAR(255),
    enterprise_type VARCHAR(100),
    major_activity VARCHAR(255),
    registration_date DATE,
    verification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LinkedIn Integration Cache
CREATE TABLE IF NOT EXISTS linkedin_integration_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_profile_data JSONB,
    linkedin_experience_data JSONB,
    linkedin_company_data JSONB,
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_status VARCHAR(50) DEFAULT 'success',
    api_calls_used INTEGER DEFAULT 0,
    cache_expires_at TIMESTAMP
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    transaction_type VARCHAR(100) NOT NULL, -- registration, premium_upgrade, mentor_payment, badge_purchase
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_gateway VARCHAR(50), -- razorpay, stripe
    gateway_transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_linkedin_url ON users(linkedin_url);
CREATE INDEX IF NOT EXISTS idx_users_is_mentor ON users(is_mentor);
CREATE INDEX IF NOT EXISTS idx_users_meets_one_year_rule ON users(meets_one_year_rule);
CREATE INDEX IF NOT EXISTS idx_executive_experiences_user_id ON executive_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_executive_experiences_is_current ON executive_experiences(is_current);
CREATE INDEX IF NOT EXISTS idx_executive_experiences_is_executive_role ON executive_experiences(is_executive_role);
CREATE INDEX IF NOT EXISTS idx_companies_cin_number ON companies(cin_number);
CREATE INDEX IF NOT EXISTS idx_companies_udyam_number ON companies(udyam_number);
CREATE INDEX IF NOT EXISTS idx_companies_verification_status ON companies(overall_verification_status);
CREATE INDEX IF NOT EXISTS idx_posts_target_roles ON posts USING GIN(target_roles);
CREATE INDEX IF NOT EXISTS idx_posts_ai_analysis ON posts USING GIN(ai_analysis);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_service_tags ON mentor_profiles USING GIN(service_tags);
CREATE INDEX IF NOT EXISTS idx_smart_connections_user_id ON smart_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participants ON chat_conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON user_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_company_analytics_company_date ON company_analytics(company_id, date);

-- Insert default badge types
INSERT INTO user_badges (user_id, badge_type, badge_name, badge_description, badge_icon, badge_color) 
SELECT 
    u.id,
    'verification',
    'MCA Verified',
    'Verified by Ministry of Corporate Affairs',
    'shield-check',
    '#10B981'
FROM users u 
WHERE u.mca_verified = true
ON CONFLICT DO NOTHING;

-- Function to calculate executive experience days
CREATE OR REPLACE FUNCTION calculate_executive_days(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_days INTEGER := 0;
    exp_record RECORD;
BEGIN
    FOR exp_record IN 
        SELECT start_date, end_date, is_current 
        FROM executive_experiences 
        WHERE user_id = user_uuid AND is_executive_role = true
    LOOP
        IF exp_record.is_current THEN
            total_days := total_days + (CURRENT_DATE - exp_record.start_date);
        ELSE
            total_days := total_days + (exp_record.end_date - exp_record.start_date);
        END IF;
    END LOOP;
    
    RETURN total_days;
END;
$$ LANGUAGE plpgsql;

-- Function to update user eligibility
CREATE OR REPLACE FUNCTION update_user_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET 
        total_executive_years = calculate_executive_days(NEW.user_id) / 365.0,
        meets_one_year_rule = calculate_executive_days(NEW.user_id) >= 365,
        mentorship_eligible = calculate_executive_days(NEW.user_id) >= 365
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update eligibility when experience is added/updated
CREATE TRIGGER trigger_update_user_eligibility
    AFTER INSERT OR UPDATE ON executive_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_eligibility();
