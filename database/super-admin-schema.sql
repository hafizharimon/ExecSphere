-- Super Admin Panel Database Schema
-- Comprehensive schema for all super admin functionalities

-- Global Settings Table
CREATE TABLE IF NOT EXISTS global_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- User Verification Requests
CREATE TABLE IF NOT EXISTS user_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    request_type VARCHAR(50) NOT NULL, -- registration, profile_update, mentor_application
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, requires_info
    submitted_data JSONB,
    linkedin_data JSONB,
    eligibility_analysis JSONB,
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Verification Requests
CREATE TABLE IF NOT EXISTS company_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    request_type VARCHAR(50) NOT NULL, -- creation, update, legal_verification
    status VARCHAR(50) DEFAULT 'pending',
    submitted_data JSONB,
    mca_verification JSONB,
    udyam_verification JSONB,
    linkedin_verification JSONB,
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee Requests
CREATE TABLE IF NOT EXISTS fee_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    request_type VARCHAR(50) NOT NULL, -- mentor_rate_increase, premium_badge, subscription
    current_amount DECIMAL(10,2),
    requested_amount DECIMAL(10,2),
    max_allowed_amount DECIMAL(10,2),
    justification TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    admin_response TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing and Payments
CREATE TABLE IF NOT EXISTS billing_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    transaction_type VARCHAR(50) NOT NULL, -- registration_fee, mentor_payment, subscription, refund
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_gateway VARCHAR(50), -- razorpay, stripe, bank_transfer
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    description TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role Management
CREATE TABLE IF NOT EXISTS custom_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(100) UNIQUE NOT NULL,
    role_description TEXT,
    max_hourly_rate DECIMAL(10,2),
    permissions JSONB, -- Array of permission strings
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Providers
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(100) NOT NULL, -- payment, verification, communication, analytics
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT,
    configuration JSONB,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, maintenance
    last_health_check TIMESTAMP,
    health_status VARCHAR(50), -- healthy, degraded, down
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platform Configurations
CREATE TABLE IF NOT EXISTS platform_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_category VARCHAR(100) NOT NULL, -- security, features, limits, notifications
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(config_category, config_key)
);

-- Database Monitoring
CREATE TABLE IF NOT EXISTS database_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_data JSONB
);

-- Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- user, company, fee_request, etc.
    target_id UUID,
    action_details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LinkedIn Integration Cache
CREATE TABLE IF NOT EXISTS linkedin_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    profile_data JSONB,
    experience_data JSONB,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cache_expires_at TIMESTAMP,
    api_calls_used INTEGER DEFAULT 0
);

-- Mentor Eligibility Analysis
CREATE TABLE IF NOT EXISTS mentor_eligibility_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    analysis_data JSONB,
    eligibility_score DECIMAL(5,2),
    meets_one_year_rule BOOLEAN,
    executive_experience_years DECIMAL(4,2),
    recommendation VARCHAR(50), -- approved, rejected, requires_review
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyzed_by VARCHAR(50) DEFAULT 'system' -- system or admin_id
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_verification_status ON user_verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_company_verification_status ON company_verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_fee_requests_status ON fee_requests(status);
CREATE INDEX IF NOT EXISTS idx_billing_transactions_user ON billing_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_transactions_status ON billing_transactions(status);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_cache_user ON linkedin_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_eligibility_user ON mentor_eligibility_analysis(user_id);

-- Insert default global settings
INSERT INTO global_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'CXO Network', 'string', 'Platform display name', true),
('registration_fee', '1000', 'number', 'User registration fee in INR', false),
('max_mentor_hourly_rate', '10000', 'number', 'Maximum allowed mentor hourly rate', false),
('linkedin_api_rate_limit', '100', 'number', 'LinkedIn API calls per hour', false),
('auto_approval_enabled', 'false', 'boolean', 'Enable automatic user approval', false),
('maintenance_mode', 'false', 'boolean', 'Platform maintenance mode', true),
('max_file_upload_size', '10485760', 'number', 'Max file upload size in bytes (10MB)', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default platform configurations
INSERT INTO platform_configurations (config_category, config_key, config_value, description) VALUES
('security', 'session_timeout', '{"hours": 24}', 'User session timeout'),
('security', 'max_login_attempts', '{"attempts": 5, "lockout_minutes": 30}', 'Login attempt limits'),
('features', 'chat_enabled', '{"enabled": true}', 'Enable chat functionality'),
('features', 'mentorship_enabled', '{"enabled": true}', 'Enable mentorship features'),
('limits', 'daily_connection_requests', '{"limit": 10}', 'Daily connection request limit'),
('limits', 'monthly_mentor_sessions', '{"limit": 50}', 'Monthly mentor session limit'),
('notifications', 'email_notifications', '{"enabled": true, "types": ["approval", "rejection", "payment"]}', 'Email notification settings'),
('notifications', 'push_notifications', '{"enabled": true}', 'Push notification settings')
ON CONFLICT (config_category, config_key) DO NOTHING;
