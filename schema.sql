-- SQL Schema for Dynamic Personal Portfolio
-- Database: PostgreSQL (Supabase)

-- 1. Site Configuration Table (Single Row Constraint)
CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    primary_color VARCHAR(50) NOT NULL DEFAULT '#6366f1',
    font_family VARCHAR(100) NOT NULL DEFAULT 'Inter',
    enable_animations BOOLEAN NOT NULL DEFAULT TRUE,
    profile_image_url TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    stat_1_num VARCHAR(50) DEFAULT '4+',
    stat_1_lbl VARCHAR(100) DEFAULT 'Years Exp',
    stat_2_num VARCHAR(50) DEFAULT '15+',
    stat_2_lbl VARCHAR(100) DEFAULT 'Live Projects',
    stat_3_num VARCHAR(50) DEFAULT '100%',
    stat_3_lbl VARCHAR(100) DEFAULT 'Success Rate',
    profile_tag_1 VARCHAR(100) NOT NULL DEFAULT 'React',
    profile_tag_2 VARCHAR(100) NOT NULL DEFAULT 'Node.js',
    profile_tag_3 VARCHAR(100) NOT NULL DEFAULT 'Full-Stack',
    profile_tag_4 VARCHAR(100) NOT NULL DEFAULT 'Supabase',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configurations if not exists
INSERT INTO site_config (id, hero_title, hero_subtitle, primary_color, font_family, enable_animations)
VALUES (
    1,
    'Hi, I''m Saif. I Build Dynamic Full-Stack Applications.',
    'A passionate developer specialized in React, Node.js, and Cloud Infrastructure.',
    '#6366f1',
    'Inter',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Education Table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    start_year VARCHAR(10) NOT NULL,
    end_year VARCHAR(10) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    achievements_array TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g. Frontend, Backend, Tools, Database
    icon_svg TEXT, -- Inline SVG or icon identifier
    proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100) DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance optimization
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- 6. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
