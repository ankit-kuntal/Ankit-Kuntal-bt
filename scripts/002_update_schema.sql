-- Update projects table to include all fields needed for CMS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Web App';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update blogs table to include all fields needed for CMS
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Update about table to include all fields needed for CMS
ALTER TABLE about ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Developer';
ALTER TABLE about ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Full-Stack Developer';
ALTER TABLE about ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE about ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE about ADD COLUMN IF NOT EXISTS email TEXT;

-- Recreate social_links table with proper structure
DROP TABLE IF EXISTS social_links;
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default social links
INSERT INTO social_links (platform, url, icon, display_order)
VALUES 
  ('GitHub', 'https://github.com', 'github', 0),
  ('LinkedIn', 'https://linkedin.com', 'linkedin', 1),
  ('Twitter', 'https://twitter.com', 'twitter', 2);

-- Update default about data
UPDATE about SET 
  name = 'Developer',
  title = 'Full-Stack Developer',
  email = 'dev@example.com';
