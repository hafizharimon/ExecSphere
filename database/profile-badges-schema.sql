-- Profile badges and analytics schema

-- Create badges table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    category VARCHAR(100) NOT NULL, -- experience, engagement, leadership, community, achievement
    criteria JSONB NOT NULL, -- Criteria for earning the badge
    points_value INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user badges table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    points_earned INTEGER DEFAULT 0,
    evidence JSONB, -- Evidence/data that led to earning this badge
    is_visible BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, badge_id)
);

-- Create user experience table (LinkedIn imported + custom)
CREATE TABLE user_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position_title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    location VARCHAR(255),
    company_linkedin_id VARCHAR(255),
    linkedin_experience_id VARCHAR(255),
    is_linkedin_imported BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    is_executive_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create profile analytics table
CREATE TABLE profile_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    profile_views INTEGER DEFAULT 0,
    network_views INTEGER DEFAULT 0,
    event_views INTEGER DEFAULT 0,
    wall_post_views INTEGER DEFAULT 0,
    wall_post_likes INTEGER DEFAULT 0,
    wall_post_comments INTEGER DEFAULT 0,
    wall_post_shares INTEGER DEFAULT 0,
    connection_requests_sent INTEGER DEFAULT 0,
    connection_requests_received INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    events_hosted INTEGER DEFAULT 0,
    forum_posts INTEGER DEFAULT 0,
    forum_comments INTEGER DEFAULT 0,
    mentorship_requests_sent INTEGER DEFAULT 0,
    mentorship_requests_received INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Create badge points tracking table
CREATE TABLE badge_points_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    reason VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user ratings table
CREATE TABLE user_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rated_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rater_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    category VARCHAR(100), -- leadership, expertise, communication, reliability
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rated_user_id, rater_user_id, category)
);

-- Create super admin approval workflows table
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_type VARCHAR(100) NOT NULL, -- user_registration, company_verification, mentor_application
    entity_id UUID NOT NULL, -- ID of the entity being approved (user, company, etc.)
    entity_type VARCHAR(100) NOT NULL, -- user, company, mentor_profile
    current_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, requires_info
    assigned_admin_id UUID REFERENCES users(id),
    priority_level VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    submission_data JSONB,
    admin_notes TEXT,
    approval_criteria JSONB,
    auto_checks_passed JSONB,
    manual_review_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id)
);

-- Create approval workflow steps table
CREATE TABLE approval_workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_name VARCHAR(255) NOT NULL,
    step_order INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, skipped
    automated BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES users(id),
    step_data JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default badges
INSERT INTO badges (name, description, icon, color, category, criteria, points_value) VALUES
('Executive Veteran', 'Served as C-level executive for 5+ years', 'crown', '#FFD700', 'experience', '{"min_years_in_position": 5}', 100),
('Rising Leader', 'Served as C-level executive for 1-3 years', 'trending-up', '#3B82F6', 'experience', '{"min_years_in_position": 1, "max_years_in_position": 3}', 50),
('Industry Pioneer', 'Served as C-level executive for 10+ years', 'star', '#8B5CF6', 'experience', '{"min_years_in_position": 10}', 200),
('Community Champion', 'High platform engagement and contributions', 'users', '#10B981', 'community', '{"min_forum_posts": 50, "min_events_attended": 10}', 75),
('Thought Leader', 'Highly rated content and responses', 'lightbulb', '#F59E0B', 'leadership', '{"min_average_rating": 4.5, "min_total_ratings": 20}', 150),
('Network Builder', 'Extensive professional network', 'network', '#EF4444', 'community', '{"min_connections": 100}', 80),
('Mentor Master', 'Successful mentorship track record', 'graduation-cap', '#EC4899', 'leadership', '{"min_mentees": 10, "min_mentor_rating": 4.5}', 120),
('Innovation Driver', 'Leading digital transformation initiatives', 'zap', '#06B6D4', 'achievement', '{"keywords": ["digital transformation", "innovation", "technology"]}, 90);

-- Create indexes for performance
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_experience_user_id ON user_experience(user_id);
CREATE INDEX idx_user_experience_current ON user_experience(user_id, is_current);
CREATE INDEX idx_profile_analytics_user_date ON profile_analytics(user_id, date);
CREATE INDEX idx_badge_points_log_user_id ON badge_points_log(user_id);
CREATE INDEX idx_user_ratings_rated_user ON user_ratings(rated_user_id);
CREATE INDEX idx_approval_workflows_type_status ON approval_workflows(workflow_type, current_status);
CREATE INDEX idx_approval_workflows_assigned ON approval_workflows(assigned_admin_id);

-- Create triggers for updated_at
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON user_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_ratings_updated_at BEFORE UPDATE ON user_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_workflows_updated_at BEFORE UPDATE ON approval_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
