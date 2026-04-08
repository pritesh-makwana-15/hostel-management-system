-- Create admin user
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES ('Admin User', 'admin@hms.com', '$2a$10$9S7tmvgi1LFbY0SAjmT6Q.BGdCJqyNMGs9MJjtdFWNBfbOhGatVR6', '9876543210', 'ADMIN', NOW());

-- Get the user ID and create admin profile
SET @admin_user_id = LAST_INSERT_ID();

INSERT INTO admin (user_id, designation, phone, created_at) 
VALUES (@admin_user_id, 'System Administrator', '9876543210', NOW());
