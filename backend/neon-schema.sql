-- =============================================
-- Portfolio Database Schema for Neon DB
-- Run this in Neon SQL Editor after creating project
-- =============================================

-- Site Configuration
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  hero_title TEXT DEFAULT 'Hi, I''m Saif. I Build Dynamic Flutter & Full-Stack Applications.',
  hero_subtitle TEXT DEFAULT 'Experienced Software Developer currently working at Ahmad Web Solutions.',
  profile_image_url TEXT DEFAULT '',
  primary_color VARCHAR(20) DEFAULT '#6366f1',
  font_family VARCHAR(50) DEFAULT 'Inter',
  enable_animations BOOLEAN DEFAULT true,
  resume_url TEXT DEFAULT '',
  stat_1_num VARCHAR(20) DEFAULT '2+',
  stat_1_lbl VARCHAR(50) DEFAULT 'Years Exp',
  stat_2_num VARCHAR(20) DEFAULT '10+',
  stat_2_lbl VARCHAR(50) DEFAULT 'Projects',
  stat_3_num VARCHAR(20) DEFAULT '100%',
  stat_3_lbl VARCHAR(50) DEFAULT 'Commitment',
  profile_tag_1 VARCHAR(50) DEFAULT 'Flutter',
  profile_tag_2 VARCHAR(50) DEFAULT 'React',
  profile_tag_3 VARCHAR(50) DEFAULT 'Node.js',
  profile_tag_4 VARCHAR(50) DEFAULT 'SQL',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  start_year VARCHAR(10),
  end_year VARCHAR(10),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  duration VARCHAR(100),
  achievements_array TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  proficiency INTEGER DEFAULT 80,
  icon_svg TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Contact form)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Seed Initial Data
-- =============================================

-- Insert default site config (only if empty)
INSERT INTO site_config (id, hero_title, hero_subtitle, primary_color, stat_1_num, stat_1_lbl, stat_2_num, stat_2_lbl, stat_3_num, stat_3_lbl, profile_tag_1, profile_tag_2, profile_tag_3, profile_tag_4)
VALUES (1, 'Hi, I''m Saif. I Build Dynamic Flutter & Full-Stack Applications.',
           'Experienced Software Developer currently working at Ahmad Web Solutions, with prior experience at Techxigo Software Solution.',
           '#6366f1', '2+', 'Years Exp', '10+', 'Projects', '100%', 'Commitment',
           'Flutter', 'React', 'Node.js', 'SQL')
ON CONFLICT (id) DO NOTHING;

-- Insert Projects
INSERT INTO projects (title, description, tech_stack, image_url, github_url, order_index) VALUES
('Find My Carz', 'Cross-platform mobile application with advanced multi-parameter search filters, real-time paginated results, and auto-finance EMI calculation module.',
 ARRAY['Flutter', 'Dart', 'Provider', 'MVVM', 'REST API', 'Dio'],
 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
 'https://github.com/Saifazad', 1),
('MirandMed', 'Cross-platform healthcare and medical appointment booking mobile app built with MVVM design pattern, dynamic pincode lookup, and robust networking layer.',
 ARRAY['Flutter', 'Dart', 'Provider', 'REST API'],
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
 'https://github.com/Saifazad', 2),
('GS Trucking Logistics System', 'Logistics management platform enabling real-time truck tracking from source to destination, driver assignment dashboard, and secure Express RESTful APIs.',
 ARRAY['React.js', 'Node.js', 'Express.js', 'MySQL', 'Bcrypt.js'],
 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80',
 'https://github.com/Saifazad', 3),
('Vidya Institute Management System', 'Comprehensive institute management system to streamline operations, manage student data, and support administrative workflows.',
 ARRAY['React.js', 'Node.js', 'Express.js', 'MySQL', 'Tailwind CSS'],
 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
 'https://github.com/Saifazad', 4)
ON CONFLICT DO NOTHING;

-- Insert Education
INSERT INTO education (institution, degree, start_year, end_year, description) VALUES
('Indira Gandhi National Open University (IGNOU)', 'Bachelor of Computer Applications (BCA)', '2020', '2023', 'Bachelor of Computer Applications'),
('Senior Secondary (BCEB Board)', 'Senior Secondary', '2018', '2020', 'Senior Secondary Education')
ON CONFLICT DO NOTHING;

-- Insert Experience
INSERT INTO experience (company, role, duration, achievements_array) VALUES
('Ahmad Web Solutions', 'Software Developer', 'Jun 2025 – Present',
 ARRAY['Architected and developed cross-platform mobile apps using MVVM design pattern and Provider.',
       'Designed high-performance vehicle discovery engine with advanced multi-parameter search filters.',
       'Implemented complex auto finance module for loan eligibility and EMI calculation.',
       'Built robust networking layer with Dio HTTP client and custom interceptors.']),
('Techxigo Software Services', 'Software Developer', 'May 2024 – Jun 2025',
 ARRAY['Designed and developed GS Trucking logistics management system using React, Node.js, Express, and MySQL.',
       'Developed admin dashboard to assign trucks to drivers and monitor routes in real-time.',
       'Implemented secure RESTful APIs for CRUD operations using Express middleware.',
       'Developed Vidya Institute Management System for institute operations.'])
ON CONFLICT DO NOTHING;

-- Insert Skills
INSERT INTO skills (name, category, proficiency) VALUES
('Flutter', 'Mobile', 95), ('Dart', 'Languages', 95),
('JavaScript', 'Languages', 90), ('TypeScript', 'Languages', 85),
('React.js', 'Frontend', 90), ('Next.js', 'Frontend', 85),
('Provider', 'Mobile', 90), ('GoRouter', 'Mobile', 85),
('Node.js', 'Backend', 85), ('Express.js', 'Backend', 85),
('Redux Toolkit', 'Frontend', 80), ('MySQL', 'Database', 80),
('REST API', 'Backend', 90), ('Axios', 'Tools', 85),
('Dio', 'Tools', 90), ('Bcrypt.js', 'Tools', 80),
('Tailwind CSS', 'Frontend', 90), ('Flutter Animate', 'Mobile', 85),
('MVVM Architecture', 'Tools', 90), ('SaaS Architecture', 'Tools', 85),
('PRD Writing', 'Tools', 80)
ON CONFLICT DO NOTHING;

