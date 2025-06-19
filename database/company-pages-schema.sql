-- Enhanced Company Pages Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Company categories enum
CREATE TYPE company_category AS ENUM (
    'pvt_ltd',
    'startup',
    'mnc',
    'msme',
    'public_company',
    'partnership',
    'sole_proprietorship',
    'llp',
    'ngo',
    'government'
);

-- Verification status enum
CREATE TYPE verification_status AS ENUM (
    'pending',
    'verified',
    'rejected',
    'expired'
);

-- Badge types enum
CREATE TYPE badge_type AS ENUM (
    'mca_verified',
    'udyam_verified',
    'linkedin_verified',
    'premium',
    'startup_india',
    'iso_certified',
    'export_house'
);

-- Company pages table
CREATE TABLE company_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    company_category company_category NOT NULL,
    
    -- Legal verification details
    cin_number VARCHAR(21),
    udyam_number VARCHAR(19),
    gstin VARCHAR(15),
    pan_number VARCHAR(10),
    
    -- Basic information
    description TEXT,
    industry VARCHAR(100),
    founded_year INTEGER,
    employee_count_range VARCHAR(50),
    headquarters_address TEXT,
    website_url VARCHAR(255),
    
    -- LinkedIn integration
    linkedin_company_url VARCHAR(255),
    linkedin_company_id VARCHAR(50),
    linkedin_verified BOOLEAN DEFAULT FALSE,
    linkedin_data JSONB,
    
    -- Verification status
    mca_verification_status verification_status DEFAULT 'pending',
    udyam_verification_status verification_status DEFAULT 'pending',
    overall_verification_status verification_status DEFAULT 'pending',
    
    -- Contact information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(15),
    support_email VARCHAR(255),
    
    -- Social media
    twitter_url VARCHAR(255),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    
    -- Company logo and images
    logo_url VARCHAR(255),
    cover_image_url VARCHAR(255),
    gallery_images JSONB DEFAULT '[]',
    
    -- SEO and metadata
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT[],
    
    -- Status and settings
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    allow_employee_requests BOOLEAN DEFAULT TRUE,
    
    -- Ownership
    created_by UUID REFERENCES users(id),
    owned_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Company administrators table
CREATE TABLE company_administrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, admin, editor, viewer
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES users(id),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- Company employees table
CREATE TABLE company_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(255),
    department VARCHAR(100),
    employment_type VARCHAR(50), -- full_time, part_time, contract, intern
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    linkedin_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- Company badges table
CREATE TABLE company_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    badge_type badge_type NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon_url VARCHAR(255),
    verification_data JSONB,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    verified_by VARCHAR(100), -- MCA, Udyam, LinkedIn, etc.
    UNIQUE(company_id, badge_type)
);

-- Product listings table
CREATE TABLE product_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    short_description VARCHAR(500),
    
    -- Product details
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    
    -- Pricing
    price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'INR',
    pricing_model VARCHAR(50), -- fixed, subscription, quote_based, free
    
    -- Media
    featured_image_url VARCHAR(255),
    gallery_images JSONB DEFAULT '[]',
    video_url VARCHAR(255),
    
    -- Links
    purchase_url VARCHAR(255),
    demo_url VARCHAR(255),
    documentation_url VARCHAR(255),
    
    -- SEO
    slug VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Company analytics table
CREATE TABLE company_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    
    -- Date tracking
    date DATE NOT NULL,
    
    -- Page metrics
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0, -- in seconds
    
    -- Product metrics
    product_views INTEGER DEFAULT 0,
    product_clicks INTEGER DEFAULT 0,
    
    -- Engagement metrics
    profile_visits INTEGER DEFAULT 0,
    contact_clicks INTEGER DEFAULT 0,
    social_clicks INTEGER DEFAULT 0,
    
    -- Employee metrics
    employee_profile_views INTEGER DEFAULT 0,
    
    -- Search and discovery
    search_appearances INTEGER DEFAULT 0,
    search_clicks INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, date)
);

-- Verification logs table
CREATE TABLE company_verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL, -- mca, udyam, linkedin
    status VARCHAR(20) NOT NULL, -- initiated, success, failed, expired
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    otp_sent BOOLEAN DEFAULT FALSE,
    otp_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company page visits table for detailed analytics
CREATE TABLE company_page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_pages(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES users(id), -- NULL for anonymous visitors
    visitor_ip INET,
    visitor_user_agent TEXT,
    page_type VARCHAR(50), -- profile, product, employee
    page_id UUID, -- product_id or employee_id
    referrer_url VARCHAR(255),
    session_id VARCHAR(255),
    visit_duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_company_pages_category ON company_pages(company_category);
CREATE INDEX idx_company_pages_verification ON company_pages(overall_verification_status);
CREATE INDEX idx_company_pages_slug ON company_pages(slug);
CREATE INDEX idx_company_pages_owner ON company_pages(owned_by);
CREATE INDEX idx_company_pages_active ON company_pages(is_active, is_public);

CREATE INDEX idx_company_administrators_company ON company_administrators(company_id);
CREATE INDEX idx_company_administrators_user ON company_administrators(user_id);
CREATE INDEX idx_company_administrators_role ON company_administrators(role);

CREATE INDEX idx_company_employees_company ON company_employees(company_id);
CREATE INDEX idx_company_employees_user ON company_employees(user_id);
CREATE INDEX idx_company_employees_current ON company_employees(is_current);

CREATE INDEX idx_company_badges_company ON company_badges(company_id);
CREATE INDEX idx_company_badges_type ON company_badges(badge_type);
CREATE INDEX idx_company_badges_active ON company_badges(is_active);

CREATE INDEX idx_product_listings_company ON product_listings(company_id);
CREATE INDEX idx_product_listings_active ON product_listings(is_active);
CREATE INDEX idx_product_listings_featured ON product_listings(is_featured);
CREATE INDEX idx_product_listings_category ON product_listings(category);

CREATE INDEX idx_company_analytics_company_date ON company_analytics(company_id, date);
CREATE INDEX idx_company_verification_logs_company ON company_verification_logs(company_id);
CREATE INDEX idx_company_page_visits_company ON company_page_visits(company_id);
CREATE INDEX idx_company_page_visits_date ON company_page_visits(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_company_pages_updated_at 
    BEFORE UPDATE ON company_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_employees_updated_at 
    BEFORE UPDATE ON company_employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_listings_updated_at 
    BEFORE UPDATE ON product_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate company slug
CREATE OR REPLACE FUNCTION generate_company_slug(company_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Convert to lowercase and replace spaces/special chars with hyphens
    base_slug := lower(regexp_replace(company_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    
    final_slug := base_slug;
    
    -- Check for uniqueness and append counter if needed
    WHILE EXISTS (SELECT 1 FROM company_pages WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update company analytics
CREATE OR REPLACE FUNCTION update_company_analytics(
    comp_id UUID,
    metric_type VARCHAR(50),
    increment_value INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO company_analytics (company_id, date, page_views, unique_visitors, product_views, product_clicks, profile_visits, contact_clicks, social_clicks, employee_profile_views, search_appearances, search_clicks)
    VALUES (comp_id, CURRENT_DATE, 
        CASE WHEN metric_type = 'page_view' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'unique_visitor' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'product_view' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'product_click' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'profile_visit' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'contact_click' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'social_click' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'employee_profile_view' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'search_appearance' THEN increment_value ELSE 0 END,
        CASE WHEN metric_type = 'search_click' THEN increment_value ELSE 0 END
    )
    ON CONFLICT (company_id, date) 
    DO UPDATE SET
        page_views = company_analytics.page_views + CASE WHEN metric_type = 'page_view' THEN increment_value ELSE 0 END,
        unique_visitors = company_analytics.unique_visitors + CASE WHEN metric_type = 'unique_visitor' THEN increment_value ELSE 0 END,
        product_views = company_analytics.product_views + CASE WHEN metric_type = 'product_view' THEN increment_value ELSE 0 END,
        product_clicks = company_analytics.product_clicks + CASE WHEN metric_type = 'product_click' THEN increment_value ELSE 0 END,
        profile_visits = company_analytics.profile_visits + CASE WHEN metric_type = 'profile_visit' THEN increment_value ELSE 0 END,
        contact_clicks = company_analytics.contact_clicks + CASE WHEN metric_type = 'contact_click' THEN increment_value ELSE 0 END,
        social_clicks = company_analytics.social_clicks + CASE WHEN metric_type = 'social_click' THEN increment_value ELSE 0 END,
        employee_profile_views = company_analytics.employee_profile_views + CASE WHEN metric_type = 'employee_profile_view' THEN increment_value ELSE 0 END,
        search_appearances = company_analytics.search_appearances + CASE WHEN metric_type = 'search_appearance' THEN increment_value ELSE 0 END,
        search_clicks = company_analytics.search_clicks + CASE WHEN metric_type = 'search_click' THEN increment_value ELSE 0 END;
END;
$$ LANGUAGE plpgsql;

-- Create view for company dashboard data
CREATE VIEW company_dashboard_view AS
SELECT 
    cp.id,
    cp.company_name,
    cp.legal_name,
    cp.company_category,
    cp.description,
    cp.industry,
    cp.founded_year,
    cp.employee_count_range,
    cp.website_url,
    cp.logo_url,
    cp.cover_image_url,
    cp.overall_verification_status,
    cp.linkedin_verified,
    cp.is_active,
    cp.is_public,
    cp.created_at,
    cp.verified_at,
    
    -- Owner information
    u.name as owner_name,
    u.email as owner_email,
    u.role as owner_role,
    
    -- Counts
    (SELECT COUNT(*) FROM company_employees ce WHERE ce.company_id = cp.id AND ce.is_current = TRUE) as current_employees_count,
    (SELECT COUNT(*) FROM product_listings pl WHERE pl.company_id = cp.id AND pl.is_active = TRUE) as active_products_count,
    (SELECT COUNT(*) FROM company_badges cb WHERE cb.company_id = cp.id AND cb.is_active = TRUE) as badges_count,
    
    -- Recent analytics (last 30 days)
    COALESCE((SELECT SUM(page_views) FROM company_analytics ca WHERE ca.company_id = cp.id AND ca.date >= CURRENT_DATE - INTERVAL '30 days'), 0) as monthly_page_views,
    COALESCE((SELECT SUM(unique_visitors) FROM company_analytics ca WHERE ca.company_id = cp.id AND ca.date >= CURRENT_DATE - INTERVAL '30 days'), 0) as monthly_unique_visitors,
    COALESCE((SELECT SUM(product_views) FROM company_analytics ca WHERE ca.company_id = cp.id AND ca.date >= CURRENT_DATE - INTERVAL '30 days'), 0) as monthly_product_views
    
FROM company_pages cp
LEFT JOIN users u ON cp.owned_by = u.id;
