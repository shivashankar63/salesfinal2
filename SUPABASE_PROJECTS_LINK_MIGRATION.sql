-- Supabase Migration: Add link field to projects and leads tables
-- Date: January 8, 2026
-- Description: Add support for URLs/links for both projects and leads

-- Add missing columns to projects table if they don't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS link TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add link column to leads table if it doesn't exist
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS link TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_link ON projects(link) WHERE link IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_leads_link ON leads(link) WHERE link IS NOT NULL;

-- Add comments to document the columns
COMMENT ON COLUMN projects.link IS 'URL or external link associated with the project (e.g., project documentation, website, or resource)';
COMMENT ON COLUMN projects.start_date IS 'Project start date';
COMMENT ON COLUMN projects.end_date IS 'Project end date';
COMMENT ON COLUMN projects.owner_id IS 'Project owner/creator user reference';
COMMENT ON COLUMN leads.link IS 'Company website or relevant URL associated with the lead';

-- Optional: Update the projects table status check constraint if needed
-- ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
-- ALTER TABLE projects ADD CONSTRAINT projects_status_check CHECK (status IN ('planned', 'active', 'paused', 'completed'));
