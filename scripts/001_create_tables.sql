-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  github_url TEXT,
  live_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  cover_image TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create about table (single row for portfolio info)
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  projects_shipped INTEGER DEFAULT 0,
  location TEXT,
  what_i_do JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create social_links table (single row)
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table for password-based admin access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default about data
INSERT INTO about (bio, years_experience, projects_shipped, location, what_i_do)
VALUES (
  'Full-stack developer building clean, premium, and high-performance digital experiences.',
  5,
  50,
  'Remote',
  '[{"point": "Building responsive, performant web applications"}, {"point": "Creating intuitive user interfaces with modern frameworks"}, {"point": "Developing scalable backend systems and APIs"}, {"point": "Implementing secure authentication and authorization"}]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Insert default social links
INSERT INTO social_links (email, github, linkedin, twitter)
VALUES (
  'dev@gmail.com',
  'https://github.com',
  'https://linkedin.com',
  'https://twitter.com'
)
ON CONFLICT DO NOTHING;
