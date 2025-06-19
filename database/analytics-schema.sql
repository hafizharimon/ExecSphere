-- Analytics data storage schema for comprehensive tracking

-- User Analytics Table
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    profile_views INTEGER DEFAULT 0,
    network_views INTEGER DEFAULT 0,
    event_views INTEGER DEFAULT 0,
    wall_post_views INTEGER DEFAULT 0,
    wall_post_likes INTEGER DEFAULT 0,
    wall_post_comments INTEGER DEFAULT 0,
    wall_post_shares INTEGER DEFAULT 0,
    connections_gained INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    forum_posts INTEGER DEFAULT 0,
    mentorship_requests INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_url VARCHAR(500) NOT NULL,
    page_type VARCHAR(100),
    load_time INTEGER, -- in milliseconds
    fid INTEGER, -- First Input Delay
    lcp INTEGER, -- Largest Contentful Paint
    cls DECIMAL(5,3), -- Cumulative Layout Shift
    fcp INTEGER, -- First Contentful Paint
    ttfb INTEGER, -- Time to First Byte
    device_type VARCHAR(50),
    connection_type VARCHAR(50),
    user_agent TEXT,
    performance_grade VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event Tracking Table
CREATE TABLE IF NOT EXISTS event_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    event_properties JSONB,
    page_url VARCHAR(500),
    session_id VARCHAR(100),
    user_role VARCHAR(50),
    user_company VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interaction Tracking Table
CREATE TABLE IF NOT EXISTS interaction_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    interaction_type VARCHAR(50) NOT NULL,
    target_element VARCHAR(200),
    interaction_duration INTEGER, -- in milliseconds
    page_url VARCHAR(500),
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversion Tracking Table
CREATE TABLE IF NOT EXISTS conversion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    conversion_type VARCHAR(50) NOT NULL,
    conversion_value DECIMAL(10,2),
    conversion_currency VARCHAR(3) DEFAULT 'INR',
    funnel_stage VARCHAR(50),
    user_segment VARCHAR(50),
    attribution_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Revenue Tracking Table
CREATE TABLE IF NOT EXISTS revenue_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    revenue_type VARCHAR(50) NOT NULL,
    revenue_amount DECIMAL(10,2) NOT NULL,
    revenue_currency VARCHAR(3) DEFAULT 'INR',
    transaction_id VARCHAR(100),
    payment_method VARCHAR(50),
    revenue_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search Analytics Table
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    search_type VARCHAR(50) NOT NULL,
    search_query VARCHAR(500),
    results_count INTEGER,
    filters_used JSONB,
    search_success BOOLEAN,
    click_through_rate DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Error Tracking Table
CREATE TABLE IF NOT EXISTS error_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    error_context TEXT,
    page_url VARCHAR(500),
    user_agent TEXT,
    stack_trace TEXT,
    severity VARCHAR(20) DEFAULT 'medium',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session Analytics Table
CREATE TABLE IF NOT EXISTS session_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE,
    session_end TIMESTAMP WITH TIME ZONE,
    session_duration INTEGER, -- in seconds
    pages_visited INTEGER DEFAULT 0,
    actions_performed INTEGER DEFAULT 0,
    session_quality VARCHAR(20), -- high, medium, low
    bounce_rate DECIMAL(5,2),
    exit_page VARCHAR(500),
    referrer VARCHAR(500),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- A/B Test Tracking Table
CREATE TABLE IF NOT EXISTS ab_test_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    test_name VARCHAR(100) NOT NULL,
    variant VARCHAR(50) NOT NULL,
    conversion_achieved BOOLEAN DEFAULT FALSE,
    conversion_value DECIMAL(10,2),
    test_start_date DATE,
    test_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON user_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON user_analytics(date);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_type ON performance_metrics(page_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_event_tracking_event_name ON event_tracking(event_name);
CREATE INDEX IF NOT EXISTS idx_event_tracking_user_id ON event_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_event_tracking_created_at ON event_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_interaction_tracking_type ON interaction_tracking(interaction_type);
CREATE INDEX IF NOT EXISTS idx_interaction_tracking_created_at ON interaction_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_conversion_tracking_type ON conversion_tracking(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_created_at ON conversion_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_revenue_tracking_type ON revenue_tracking(revenue_type);
CREATE INDEX IF NOT EXISTS idx_revenue_tracking_created_at ON revenue_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_error_tracking_type ON error_tracking(error_type);
CREATE INDEX IF NOT EXISTS idx_error_tracking_resolved ON error_tracking(resolved);
CREATE INDEX IF NOT EXISTS idx_error_tracking_created_at ON error_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_session_analytics_session_id ON session_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_session_analytics_user_id ON session_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_session_analytics_created_at ON session_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_ab_test_tracking_test_name ON ab_test_tracking(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_tracking_user_id ON ab_test_tracking(user_id);

-- Create functions for analytics aggregation
CREATE OR REPLACE FUNCTION get_user_analytics_summary(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_profile_views BIGINT,
    total_network_views BIGINT,
    total_event_views BIGINT,
    total_wall_post_views BIGINT,
    total_wall_post_likes BIGINT,
    total_wall_post_comments BIGINT,
    total_connections_gained BIGINT,
    avg_daily_engagement DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ua.profile_views), 0) as total_profile_views,
        COALESCE(SUM(ua.network_views), 0) as total_network_views,
        COALESCE(SUM(ua.event_views), 0) as total_event_views,
        COALESCE(SUM(ua.wall_post_views), 0) as total_wall_post_views,
        COALESCE(SUM(ua.wall_post_likes), 0) as total_wall_post_likes,
        COALESCE(SUM(ua.wall_post_comments), 0) as total_wall_post_comments,
        COALESCE(SUM(ua.connections_gained), 0) as total_connections_gained,
        COALESCE(AVG(ua.profile_views + ua.network_views + ua.event_views), 0) as avg_daily_engagement
    FROM user_analytics ua
    WHERE ua.user_id = p_user_id
    AND ua.date BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Create function for performance analytics
CREATE OR REPLACE FUNCTION get_performance_summary(
    p_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP - INTERVAL '7 days',
    p_end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
RETURNS TABLE (
    avg_load_time DECIMAL(10,2),
    avg_fid DECIMAL(10,2),
    avg_lcp DECIMAL(10,2),
    avg_cls DECIMAL(5,3),
    total_page_views BIGINT,
    performance_grade_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(pm.load_time), 0) as avg_load_time,
        COALESCE(AVG(pm.fid), 0) as avg_fid,
        COALESCE(AVG(pm.lcp), 0) as avg_lcp,
        COALESCE(AVG(pm.cls), 0) as avg_cls,
        COUNT(*) as total_page_views,
        jsonb_object_agg(pm.performance_grade, grade_count) as performance_grade_distribution
    FROM performance_metrics pm
    LEFT JOIN (
        SELECT performance_grade, COUNT(*) as grade_count
        FROM performance_metrics
        WHERE created_at BETWEEN p_start_date AND p_end_date
        GROUP BY performance_grade
    ) grade_stats ON pm.performance_grade = grade_stats.performance_grade
    WHERE pm.created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;
