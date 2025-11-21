-- Drop existing tables if they exist
DROP TABLE IF EXISTS issue_history CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS authorities CASCADE;

-- Create authorities table (users)
CREATE TABLE authorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    municipality_type VARCHAR(50) NOT NULL CHECK (municipality_type IN ('Municipal Corporation', 'Municipal Council', 'Nagar Panchayat')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create issues table
CREATE TABLE issues (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('POTHOLES', 'GARBAGE', 'STREETLIGHTS', 'WATER', 'SEWAGE', 'OTHER')),
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    
    -- Location details
    address TEXT NOT NULL,
    ward VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Reporter details
    reporter_name VARCHAR(255) NOT NULL,
    reporter_phone VARCHAR(20) NOT NULL,
    
    -- Assignment details
    assigned_department VARCHAR(50) CHECK (assigned_department IN ('ROADS', 'SANITATION', 'WATER', 'ELECTRICITY', 'OTHER')),
    assigned_officer_name VARCHAR(255),
    
    -- Images (stored as JSON array of URLs)
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    reported_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sla_breached BOOLEAN DEFAULT FALSE,
    age_in_hours INTEGER DEFAULT 0,
    
    -- Foreign key to authority who created/manages the issue
    authority_id UUID REFERENCES authorities(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create issue history table
CREATE TABLE issue_history (
    id SERIAL PRIMARY KEY,
    issue_id VARCHAR(50) NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    updated_by VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_city ON issues(city);
CREATE INDEX idx_issues_reported_date ON issues(reported_date);
CREATE INDEX idx_issue_history_issue_id ON issue_history(issue_id);
CREATE INDEX idx_authorities_email ON authorities(email);

-- Create a function to update the updated_at timestamp for authorities
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a function to update the updated_date timestamp for issues
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update timestamps
CREATE TRIGGER update_authorities_updated_at BEFORE UPDATE ON authorities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_date BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
