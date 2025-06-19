-- Enhanced schema for user registration and verification
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with enhanced verification fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- CEO, CTO, CFO, COO, etc.
    organization VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    years_experience INTEGER,
    region VARCHAR(100),
    bio TEXT,
    
    -- LinkedIn Integration
    linkedin_url VARCHAR(255) NOT NULL,
    linkedin_email VARCHAR(255),
    linkedin_verified BOOLEAN DEFAULT FALSE,
    linkedin_experience_data JSONB,
    has_minimum_cxo_experience BOOLEAN DEFAULT FALSE,
    
    -- Company Information
    legal_entity_name VARCHAR(255),
    cin_number VARCHAR(21),
    company_linkedin_page VARCHAR(255),
    
    -- Contact Information
    company_email VARCHAR(255),
    mobile_number VARCHAR(10), -- Exactly 10 digits for Indian numbers
    aadhaar_number VARCHAR(12),
    
    -- MCA Verification
    mca_verified BOOLEAN DEFAULT FALSE,
    mca_data JSONB,
    director_verified BOOLEAN DEFAULT FALSE,
    director_din VARCHAR(8),
    
    -- OTP Verification
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    
    -- Platform Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    user_type VARCHAR(20) DEFAULT 'pending', -- pending, cxo, mentor, admin, super-admin
    registration_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    
    -- Privileges
    selected_privileges JSONB DEFAULT '[]',
    
    -- Payment
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
    payment_id VARCHAR(255),
    payment_amount DECIMAL(10,2) DEFAULT 1000.00,
    
    -- Terms and Privacy
    terms_accepted BOOLEAN DEFAULT FALSE,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    profile_image_url VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create verification_logs table to track verification attempts
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL, -- linkedin, mca, email, mobile, aadhaar
    status VARCHAR(20) NOT NULL, -- success, failed, pending
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create otp_verifications table
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    otp_type VARCHAR(20) NOT NULL, -- email, sms, aadhaar
    target VARCHAR(255) NOT NULL, -- email address, phone number, or aadhaar number
    otp_code VARCHAR(10) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mca_company_data table for caching MCA responses
CREATE TABLE mca_company_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cin VARCHAR(21) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_status VARCHAR(50),
    company_category VARCHAR(100),
    date_of_incorporation DATE,
    authorized_capital BIGINT,
    paid_up_capital BIGINT,
    registered_address TEXT,
    directors JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create linkedin_experience table for detailed experience tracking
CREATE TABLE linkedin_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    is_cxo_role BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_transactions table
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL, -- pending, success, failed, refunded
    payment_method VARCHAR(50),
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_actions table for audit trail
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- approve, reject, suspend, activate
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile_number);
CREATE INDEX idx_users_cin ON users(cin_number);
CREATE INDEX idx_users_linkedin ON users(linkedin_url);
CREATE INDEX idx_users_status ON users(registration_status);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_mca_verified ON users(mca_verified);
CREATE INDEX idx_users_director_verified ON users(director_verified);
CREATE INDEX idx_users_payment_status ON users(payment_status);

CREATE INDEX idx_verification_logs_user ON verification_logs(user_id);
CREATE INDEX idx_verification_logs_type ON verification_logs(verification_type);
CREATE INDEX idx_verification_logs_status ON verification_logs(status);

CREATE INDEX idx_otp_verifications_user ON otp_verifications(user_id);
CREATE INDEX idx_otp_verifications_type ON otp_verifications(otp_type);
CREATE INDEX idx_otp_verifications_target ON otp_verifications(target);
CREATE INDEX idx_otp_verifications_expires ON otp_verifications(expires_at);

CREATE INDEX idx_mca_company_cin ON mca_company_data(cin);
CREATE INDEX idx_mca_company_name ON mca_company_data(company_name);

CREATE INDEX idx_linkedin_experience_user ON linkedin_experience(user_id);
CREATE INDEX idx_linkedin_experience_cxo ON linkedin_experience(is_cxo_role);

CREATE INDEX idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate mobile number (exactly 10 digits)
CREATE OR REPLACE FUNCTION validate_mobile_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.mobile_number IS NOT NULL AND (LENGTH(NEW.mobile_number) != 10 OR NEW.mobile_number !~ '^[0-9]{10}$') THEN
        RAISE EXCEPTION 'Mobile number must be exactly 10 digits';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_mobile_number_trigger BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE FUNCTION validate_mobile_number();

-- Create function to validate CIN format
CREATE OR REPLACE FUNCTION validate_cin_format()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cin_number IS NOT NULL AND NEW.cin_number !~ '^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$' THEN
        RAISE EXCEPTION 'Invalid CIN format';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_cin_format_trigger BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE FUNCTION validate_cin_format();

-- Create function to calculate C-level experience
CREATE OR REPLACE FUNCTION calculate_cxo_experience(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_days INTEGER := 0;
    exp_record RECORD;
BEGIN
    FOR exp_record IN 
        SELECT start_date, end_date, is_current 
        FROM linkedin_experience 
        WHERE user_id = user_uuid AND is_cxo_role = TRUE
    LOOP
        total_days := total_days + (
            COALESCE(exp_record.end_date, CURRENT_DATE) - exp_record.start_date
        );
    END LOOP;
    
    RETURN total_days;
END;
$$ language 'plpgsql';

-- Create view for user dashboard data
CREATE VIEW user_dashboard_view AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.organization,
    u.industry,
    u.registration_status,
    u.user_type,
    u.mca_verified,
    u.director_verified,
    u.linkedin_verified,
    u.email_verified,
    u.mobile_verified,
    u.aadhaar_verified,
    u.payment_status,
    u.selected_privileges,
    u.has_minimum_cxo_experience,
    u.created_at,
    u.approved_at,
    calculate_cxo_experience(u.id) as total_cxo_experience_days,
    CASE 
        WHEN u.mca_verified AND u.director_verified AND u.linkedin_verified 
             AND u.email_verified AND u.mobile_verified AND u.aadhaar_verified 
             AND u.payment_status = 'completed' 
        THEN 'complete'
        ELSE 'incomplete'
    END as verification_status
FROM users u;

-- Insert sample data for testing
INSERT INTO users (
    email, name, role, organization, industry, linkedin_url, 
    legal_entity_name, cin_number, company_linkedin_page,
    company_email, mobile_number, mca_verified, director_verified,
    linkedin_verified, email_verified, mobile_verified, aadhaar_verified,
    payment_status, registration_status, user_type, has_minimum_cxo_experience,
    selected_privileges, terms_accepted, privacy_accepted
) VALUES 
(
    'ceo@techcorp.com', 'Rajesh Kumar', 'CEO', 'TechCorp Solutions', 'Technology',
    'https://linkedin.com/in/rajesh-kumar', 'TechCorp Solutions Private Limited',
    'U72900KA2020PTC134567', 'https://linkedin.com/company/techcorp-solutions',
    'rajesh@techcorp.com', '9876543210', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    'completed', 'approved', 'cxo', TRUE,
    '["networking", "mentorship", "events", "analytics"]', TRUE, TRUE
),
(
    'cto@innovate.com', 'Sarah Chen', 'CTO', 'InnovateTech', 'Technology',
    'https://linkedin.com/in/sarah-chen', 'InnovateTech Solutions Private Limited',
    'U72900MH2019PTC234567', 'https://linkedin.com/company/innovatetech',
    'sarah@innovate.com', '9876543211', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    'completed', 'approved', 'mentor', TRUE,
    '["networking", "mentorship", "events"]', TRUE, TRUE
);
