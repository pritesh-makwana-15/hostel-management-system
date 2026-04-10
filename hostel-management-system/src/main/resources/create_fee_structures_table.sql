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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fee_structures_hostel_block ON fee_structures(hostel_block);
CREATE INDEX IF NOT EXISTS idx_fee_structures_room_type ON fee_structures(room_type);
CREATE INDEX IF NOT EXISTS idx_fee_structures_status ON fee_structures(status);
