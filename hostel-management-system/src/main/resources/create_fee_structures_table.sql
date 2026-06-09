-- Create fee_structures table
CREATE TABLE IF NOT EXISTS fee_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hostel_block VARCHAR(100) NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2),
    utilities DECIMAL(10,2),
    late_fee DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_fee_structures_block_room_type UNIQUE (hostel_block, room_type)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fee_structures_hostel_block ON fee_structures(hostel_block);
CREATE INDEX IF NOT EXISTS idx_fee_structures_room_type ON fee_structures(room_type);
CREATE INDEX IF NOT EXISTS idx_fee_structures_status ON fee_structures(status);

-- Insert sample fee structures for different hostel blocks and room types
INSERT IGNORE INTO fee_structures (hostel_block, room_type, monthly_fee, security_deposit, utilities, late_fee, status)
VALUES 
    ('Block A', 'AC', 5000.00, 2000.00, 500.00, 100.00, 'Active'),
    ('Block A', 'Non-AC', 3500.00, 1500.00, 300.00, 100.00, 'Active'),
    ('Block B', 'AC', 5000.00, 2000.00, 500.00, 100.00, 'Active'),
    ('Block B', 'Non-AC', 3500.00, 1500.00, 300.00, 100.00, 'Active'),
    ('Block C', 'AC', 5500.00, 2000.00, 550.00, 100.00, 'Active'),
    ('Block C', 'Non-AC', 4000.00, 1500.00, 350.00, 100.00, 'Active'),
    ('Block D', 'AC', 5500.00, 2000.00, 550.00, 100.00, 'Active'),
    ('Block D', 'Non-AC', 4000.00, 1500.00, 350.00, 100.00, 'Active');
