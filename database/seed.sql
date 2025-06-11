-- Insert sample users
INSERT INTO users (id, email, password_hash, name, role, organization, industry, years_experience, region, bio, is_verified, is_admin) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@cxonetwork.com', '$2b$10$hashedpassword1', 'Admin User', 'Admin', 'CXO Network', 'Technology', 10, 'Global', 'Platform administrator', TRUE, TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'john.doe@techinnovations.com', '$2b$10$hashedpassword2', 'John Doe', 'CEO', 'Tech Innovations Inc.', 'Technology', 25, 'North America', 'Experienced CEO with focus on digital transformation and scaling technology companies.', TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440003', 'sarah.miller@innovatetech.com', '$2b$10$hashedpassword3', 'Sarah Miller', 'CTO', 'InnovateTech', 'Technology', 15, 'North America', 'Technology leader specializing in AI and machine learning implementations.', TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440004', 'james.davis@globalfinance.com', '$2b$10$hashedpassword4', 'James Davis', 'CFO', 'Global Finance Group', 'Finance', 20, 'Europe', 'Financial executive with expertise in M&A and risk management.', TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440005', 'maria.rodriguez@healthtech.com', '$2b$10$hashedpassword5', 'Maria Rodriguez', 'CEO', 'HealthTech Solutions', 'Healthcare', 18, 'North America', 'Healthcare innovation leader focused on digital health solutions.', TRUE, FALSE),
('550e8400-e29b-41d4-a716-446655440006', 'david.chen@techcorp.com', '$2b$10$hashedpassword6', 'David Chen', 'CTO', 'TechCorp Solutions', 'Technology', 12, 'Asia-Pacific', 'Technology executive with experience in cloud infrastructure and cybersecurity.', FALSE, FALSE),
('550e8400-e29b-41d4-a716-446655440007', 'emily.rodriguez@healthplus.com', '$2b$10$hashedpassword7', 'Emily Rodriguez', 'CEO', 'HealthPlus Inc', 'Healthcare', 18, 'North America', 'Healthcare CEO focused on patient-centered care and operational excellence.', FALSE, FALSE);

-- Insert user expertise
INSERT INTO user_expertise (user_id, expertise_area) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Digital Transformation'),
('550e8400-e29b-41d4-a716-446655440002', 'Strategic Planning'),
('550e8400-e29b-41d4-a716-446655440002', 'Team Leadership'),
('550e8400-e29b-41d4-a716-446655440003', 'Artificial Intelligence'),
('550e8400-e29b-41d4-a716-446655440003', 'Machine Learning'),
('550e8400-e29b-41d4-a716-446655440003', 'Product Strategy'),
('550e8400-e29b-41d4-a716-446655440004', 'Financial Strategy'),
('550e8400-e29b-41d4-a716-446655440004', 'Risk Management'),
('550e8400-e29b-41d4-a716-446655440004', 'Mergers & Acquisitions'),
('550e8400-e29b-41d4-a716-446655440005', 'Healthcare Innovation'),
('550e8400-e29b-41d4-a716-446655440005', 'Digital Health'),
('550e8400-e29b-41d4-a716-446655440005', 'Regulatory Affairs');

-- Insert forum categories
INSERT INTO forum_categories (id, name, description, role_restriction) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'CEO Forum', 'Discussions for Chief Executive Officers', 'CEO'),
('650e8400-e29b-41d4-a716-446655440002', 'CTO Forum', 'Technology leadership discussions', 'CTO'),
('650e8400-e29b-41d4-a716-446655440003', 'CFO Forum', 'Financial strategy and management', 'CFO'),
('650e8400-e29b-41d4-a716-446655440004', 'General Discussion', 'Open discussions for all executives', NULL),
('650e8400-e29b-41d4-a716-446655440005', 'Industry Insights', 'Share industry-specific knowledge', NULL);

-- Insert sample events
INSERT INTO events (id, title, description, event_date, event_time, location, event_type, max_attendees, industry_focus, created_by) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Future of AI in Business Strategy', 'An exclusive webinar exploring how artificial intelligence is reshaping executive decision-making and strategic planning.', '2024-06-20', '14:00:00', 'Online Webinar', 'webinar', 100, 'Technology', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440002', 'Global Economic Outlook Roundtable', 'A closed-door discussion on 2024 economic forecasts and their implications for business leaders.', '2024-07-05', '10:00:00', 'London, UK (Hybrid)', 'roundtable', 25, 'Finance', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440003', 'Sustainable Leadership Summit', 'Exploring sustainable business practices and ESG strategies for modern executives.', '2024-07-15', '09:00:00', 'New York, NY', 'summit', 150, 'All', '550e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440004', 'Digital Transformation Masterclass', 'Learn from successful digital transformation case studies and best practices.', '2024-08-02', '16:00:00', 'Online Workshop', 'workshop', 50, 'Technology', '550e8400-e29b-41d4-a716-446655440001');

-- Insert event registrations
INSERT INTO event_registrations (event_id, user_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005');

-- Insert connections
INSERT INTO connections (requester_id, receiver_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'accepted'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'accepted'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'pending'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'accepted');

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Hi Sarah, I saw your presentation on AI implementation. Very insightful! Would love to discuss further.', FALSE),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Thanks John! Happy to connect. Let me know when you''re available for a call.', TRUE),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Regarding the economic outlook discussion, I have some insights on European markets that might be valuable.', FALSE);

-- Insert forum posts
INSERT INTO forum_posts (id, category_id, user_id, title, content) VALUES
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Digital Transformation Challenges in 2024', 'What are the biggest challenges you''re facing in digital transformation initiatives? I''d love to hear about your experiences and share some insights from our recent transformation.'),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Healthcare Innovation Trends', 'The healthcare industry is rapidly evolving with new technologies. What innovations are you most excited about?'),
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Managing Financial Risk in Uncertain Times', 'With global economic uncertainty, how are you adjusting your risk management strategies?');

-- Insert forum comments
INSERT INTO forum_comments (post_id, user_id, content) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Great question! We''ve found that the biggest challenge is getting buy-in from all stakeholders. Change management is crucial.'),
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Agreed on change management. We''ve also struggled with legacy system integration. What approaches have worked for you?'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'AI-powered diagnostics and telemedicine are game-changers. We''re seeing significant improvements in patient outcomes.');

-- Insert mentorship requests
INSERT INTO mentorship_requests (id, requester_id, mentor_id, message, status) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'I''m looking for guidance on scaling a technology company. Your experience with Tech Innovations would be invaluable.', 'pending'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 'Would love to learn from your experience in healthcare leadership and digital transformation.', 'accepted');

-- Insert mentorship sessions
INSERT INTO mentorship_sessions (mentorship_request_id, scheduled_date, scheduled_time, status) VALUES
('950e8400-e29b-41d4-a716-446655440002', '2024-06-20', '14:00:00', 'scheduled');

-- Insert activity logs
INSERT INTO activity_logs (user_id, activity_type, description) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'login', 'User logged in'),
('550e8400-e29b-41d4-a716-446655440003', 'message_sent', 'Sent message to John Doe'),
('550e8400-e29b-41d4-a716-446655440001', 'event_created', 'Created event: Future of AI in Business Strategy'),
('550e8400-e29b-41d4-a716-446655440006', 'mentorship_request', 'Requested mentorship from John Doe'),
('550e8400-e29b-41d4-a716-446655440002', 'forum_post', 'Created forum post: Digital Transformation Challenges');
