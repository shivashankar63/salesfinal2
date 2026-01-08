-- Supabase Migration: Add link field to leads table
-- Date: January 8, 2026
-- Description: Add support for company website/link URLs when creating leads

-- Add link column to leads table if it doesn't exist
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS link TEXT;

-- Create index on link for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_leads_link ON leads(link) WHERE link IS NOT NULL;

-- Add comment to document the column
COMMENT ON COLUMN leads.link IS 'Company website or relevant URL associated with the lead (e.g., https://example.com)';
