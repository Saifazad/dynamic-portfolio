const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Fix Node.js < 22 WebSocket support for Supabase Realtime
globalThis.WebSocket = require('ws');

// Load environment variables (just in case they weren't loaded yet)
dotenv.config();

let supabase = null;
let isMockDatabase = false;

const mockDb = {
  site_config: {
    id: 1,
    hero_title: "Hi, I'm Saif. I Build Dynamic Flutter & Full-Stack Applications.",
    hero_subtitle: "Experienced Software Developer currently working at Ahmad Web Solutions, with prior experience at Techxigo Software Solution.",
    profile_image_url: "",
    primary_color: "#6366f1",
    font_family: "Inter",
    enable_animations: true,
    resume_url: "",
    stat_1_num: "2+",
    stat_1_lbl: "Years Exp",
    stat_2_num: "10+",
    stat_2_lbl: "Projects",
    stat_3_num: "100%",
    stat_3_lbl: "Commitment",
    profile_tag_1: "Flutter",
    profile_tag_2: "React",
    profile_tag_3: "Node.js",
    profile_tag_4: "SQL"
  },
  projects: [],
  education: [],
  experience: [
    {
      id: 1,
      company: "Ahmad Web Solutions",
      role: "Flutter Developer",
      duration: "Present",
      achievements_array: ["Working on dynamic cross-platform mobile apps using Flutter."]
    },
    {
      id: 2,
      company: "Techxigo Software Solution",
      role: "Software Developer",
      duration: "Past",
      achievements_array: ["Worked on Full-Stack web development using React, Node.js, and SQL databases."]
    }
  ],
  skills: [
    { id: 1, name: "Flutter", category: "Mobile", proficiency: 90 },
    { id: 2, name: "React", category: "Frontend", proficiency: 85 },
    { id: 3, name: "Node.js", category: "Backend", proficiency: 85 },
    { id: 4, name: "SQL", category: "Database", proficiency: 80 }
  ],
  messages: []
};


const hasSupabaseCreds = process.env.SUPABASE_URL && 
                         process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co' && 
                         process.env.SUPABASE_KEY;

if (hasSupabaseCreds) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log('Successfully connected to Supabase Client');
  } catch (error) {
    console.error('Error initializing Supabase Client:', error);
    isMockDatabase = true;
  }
} else {
  console.warn('⚠️ Supabase credentials missing. Falling back to IN-MEMORY MOCK database.');
  isMockDatabase = true;
}

module.exports = {
  supabase,
  mockDb,
  isMockDatabase
};
