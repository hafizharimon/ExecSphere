-- Script to create enhanced tables for user registration and verification
-- Run this after the main schema creation

-- Create table for storing LinkedIn experience data
CREATE TABLE IF NOT EXISTS linkedin_experience_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_profile_id VARCHAR(255),
    experience_data JSONB NOT NULL,
    cxo_analysis JSONB NOT NULL,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for OTP management
CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    otp_type VARCHAR(20) NOT NULL, -- email, mobile, aadhaar
    otp_code VARCHAR(10) NOT NULL,
    target_identifier VARCHAR(255) NOT NULL, -- email, phone, aadhaar
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP WITH TIME ZONE
);

-- Create table for registration workflow tracking
CREATE TABLE IF NOT EXISTS registration_workflow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    completed_steps JSONB DEFAULT '[]',
    step_data JSONB DEFAULT '{}',
    linkedin_connected BOOLEAN DEFAULT FALSE,
    mca_verified BOOLEAN DEFAULT FALSE,
    director_verified BOOLEAN DEFAULT FALSE,
    otp_verifications_completed JSONB DEFAULT '{}',
    payment_completed BOOLEAN DEFAULT FALSE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_linkedin_experience_cache_user ON linkedin_experience_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_experience_cache_profile ON linkedin_experience_cache(linkedin_profile_id);

CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(user_email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_type ON otp_codes(otp_type);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_codes_used ON otp_codes(is_used);

CREATE INDEX IF NOT EXISTS idx_registration_workflow_user ON registration_workflow(user_id);
CREATE INDEX IF NOT EXISTS idx_registration_workflow_step ON registration_workflow(current_step);

-- Create function to clean expired OTP codes
CREATE OR REPLACE FUNCTION clean_expired_otps()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM otp_codes WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate OTP
CREATE OR REPLACE FUNCTION generate_otp()
RETURNS VARCHAR(6) AS $$
DECLARE
    chars VARCHAR(36) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(6) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate mobile number format for India
CREATE OR REPLACE FUNCTION is_valid_indian_mobile(mobile VARCHAR(10))
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if exactly 10 digits and starts with 6, 7, 8, or 9
    RETURN mobile ~ '^[6-9][0-9]{9}$';
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update registration workflow
CREATE OR REPLACE FUNCTION update_registration_workflow()
RETURNS TRIGGER AS $$
BEGIN
    -- Update workflow when user data changes
    UPDATE registration_workflow 
    SET 
        linkedin_connected = NEW.linkedin_verified,
        mca_verified = NEW.mca_verified,
        director_verified = NEW.director_verified,
        payment_completed = (NEW.payment_status = 'completed'),
        terms_accepted = NEW.terms_accepted,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registration_workflow_trigger 
    AFTER UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_registration_workflow();

-- Insert sample registration workflow data
INSERT INTO registration_workflow (user_id, current_step, completed_steps, linkedin_connected, mca_verified, director_verified, payment_completed, terms_accepted)
SELECT 
    id, 
    8, 
    '[1,2,3,4,5,6,7,8]'::jsonb,
    linkedin_verified,
    mca_verified, 
    director_verified,
    (payment_status = 'completed'),
    terms_accepted
FROM users 
WHERE registration_status = 'approved'
ON CONFLICT DO NOTHING;
