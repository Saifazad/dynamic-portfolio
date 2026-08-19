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
  education: [
    {
      id: 1,
      institution: "Indira Gandhi National Open University (IGNOU)",
      degree: "Bachelor of Computer Applications (BCA)",
      start_year: "2020",
      end_year: "2023",
      description: "Bachelor of Computer Applications"
    },
    {
      id: 2,
      institution: "Senior Secondary (BCEB Board)",
      degree: "Senior Secondary",
      start_year: "2018",
      end_year: "2020",
      description: "Senior Secondary Education"
    }
  ],
  experience: [
    {
      id: 1,
      company: "Ahmad Web Solutions",
      role: "Software Developer",
      duration: "Jun 2025 – Present",
      achievements_array: [
        "Architected and developed cross-platform mobile apps (Find My Carz, MirandMed) using the MVVM design pattern and Provider.",
        "Designed high-performance vehicle discovery engine with advanced multi-parameter search filters, real-time paginated results, and cached image loading.",
        "Implemented complex auto finance module for loan eligibility, EMI calculation, and Balance Transfer (BT) + Top-up applications.",
        "Built robust networking layer with Dio HTTP client, custom interceptors, centralized error handling, and FormData multi-file upload.",
        "Integrated Postal Pincode lookup API for automated dynamic location mapping (State and District detection).",
        "Designed role-based dual-portal B2B system dynamically catering to Buyers and Manufacturers within a single codebase.",
        "Developed responsive real-time chat layout with online status indicators, unread message badges, and automated quick-response features.",
        "Authored Product Requirement Documents (PRDs) and technical architecture documents for SaaS platforms and ERP marketing solutions."
      ]
    },
    {
      id: 2,
      company: "Techxigo Software Services",
      role: "Software Developer",
      duration: "May 2024 – Jun 2025",
      achievements_array: [
        "Designed and developed GS Trucking logistics management system using React, Node.js, Express, and MySQL.",
        "Developed admin dashboard to assign trucks to drivers and monitor routes in real-time from source to destination.",
        "Implemented secure RESTful APIs to handle CRUD operations for drivers, trucks, and routes using Express middleware.",
        "Developed Vidya Institute Management System to streamline institute operations and student data management.",
        "Built responsive frontends using React.js and React Router, ensuring seamless user experience across devices.",
        "Prioritized security by implementing Bcrypt.js for industry-standard password hashing and authentication."
      ]
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
