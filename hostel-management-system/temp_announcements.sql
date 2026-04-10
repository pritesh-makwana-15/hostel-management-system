-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    audience ENUM('STUDENTS', 'WARDENS', 'BOTH') NOT NULL,
    priority ENUM('NORMAL', 'IMPORTANT', 'URGENT') NOT NULL,
    publish_date DATETIME,
    expiry_date DATETIME,
    created_by VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('DRAFT', 'PUBLISHED', 'EXPIRED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT'
);

-- Add indexes for better performance
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_audience ON announcements(audience);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_publish_date ON announcements(publish_date);
CREATE INDEX idx_announcements_expiry_date ON announcements(expiry_date);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);

-- Insert sample announcements for testing
INSERT INTO announcements (title, message, audience, priority, publish_date, expiry_date, created_by, status) VALUES
('Welcome to Hostel Management System', 'We are pleased to announce the launch of our new Hostel Management System. This system will help streamline all hostel operations and provide better services to students.', 'BOTH', 'IMPORTANT', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Admin', 'PUBLISHED'),
('Maintenance Notice', 'The water supply will be interrupted tomorrow from 9 AM to 12 PM for maintenance work. Please store water accordingly.', 'STUDENTS', 'URGENT', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 'Admin', 'PUBLISHED'),
('New Wardens Meeting Schedule', 'Monthly wardens meeting will be held every first Monday of the month at 10 AM in the conference room.', 'WARDENS', 'NORMAL', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'Admin', 'PUBLISHED'),
('Fee Payment Reminder', 'Last date for fee payment for this month is 25th. Please pay your fees on time to avoid late charges.', 'STUDENTS', 'IMPORTANT', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Admin', 'PUBLISHED'),
('Holiday Schedule Update', 'The hostel will remain closed during the upcoming festival holidays from 15th to 20th of this month. Please plan accordingly.', 'BOTH', 'NORMAL', NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'Admin', 'PUBLISHED');
