const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Fix Node.js < 22 WebSocket support for Supabase Realtime
if (typeof globalThis.WebSocket === 'undefined') {
  try { globalThis.WebSocket = require('ws'); } catch (e) { /* ws not available, skip */ }
}

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
  projects: [
    {
      id: 1,
      title: "Find My Carz",
      description: "Cross-platform mobile application with advanced multi-parameter search filters, real-time paginated results, and auto-finance EMI calculation module.",
      tech_stack: ["Flutter", "Dart", "Provider", "MVVM", "REST API", "Dio"],
      image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
      live_url: "",
      github_url: "https://github.com/Saifazad",
      order_index: 1
    },
    {
      id: 2,
      title: "MirandMed",
      description: "Cross-platform healthcare and medical appointment booking mobile app built with MVVM design pattern, dynamic pincode lookup, and robust networking layer.",
      tech_stack: ["Flutter", "Dart", "Provider", "REST API"],
      image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      live_url: "",
      github_url: "https://github.com/Saifazad",
      order_index: 2
    },
    {
      id: 3,
      title: "GS Trucking Logistics System",
      description: "Logistics management platform enabling real-time truck tracking from source to destination, driver assignment dashboard, and secure Express RESTful APIs.",
      tech_stack: ["React.js", "Node.js", "Express.js", "MySQL", "Bcrypt.js"],
      image_url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80",
      live_url: "",
      github_url: "https://github.com/Saifazad",
      order_index: 3
    },
    {
      id: 4,
      title: "Vidya Institute Management System",
      description: "Comprehensive institute management system to streamline operations, manage student data, and support administrative workflows.",
      tech_stack: ["React.js", "Node.js", "Express.js", "MySQL", "Tailwind CSS"],
      image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      live_url: "",
      github_url: "https://github.com/Saifazad",
      order_index: 4
    }
  ],
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
    { id: 1, name: "Flutter", category: "Mobile", proficiency: 95 },
    { id: 2, name: "Dart", category: "Languages", proficiency: 95 },
    { id: 3, name: "JavaScript", category: "Languages", proficiency: 90 },
    { id: 4, name: "TypeScript", category: "Languages", proficiency: 85 },
    { id: 5, name: "React.js", category: "Frontend", proficiency: 90 },
    { id: 6, name: "Next.js", category: "Frontend", proficiency: 85 },
    { id: 7, name: "Provider", category: "Mobile", proficiency: 90 },
    { id: 8, name: "GoRouter", category: "Mobile", proficiency: 85 },
    { id: 9, name: "Node.js", category: "Backend", proficiency: 85 },
    { id: 10, name: "Express.js", category: "Backend", proficiency: 85 },
    { id: 11, name: "Redux Toolkit", category: "Frontend", proficiency: 80 },
    { id: 12, name: "MySQL", category: "Database", proficiency: 80 },
    { id: 13, name: "REST API", category: "Backend", proficiency: 90 },
    { id: 14, name: "Axios", category: "Tools", proficiency: 85 },
    { id: 15, name: "Dio", category: "Tools", proficiency: 90 },
    { id: 16, name: "Bcrypt.js", category: "Tools", proficiency: 80 },
    { id: 17, name: "Tailwind CSS", category: "Frontend", proficiency: 90 },
    { id: 18, name: "Flutter Animate", category: "Mobile", proficiency: 85 },
    { id: 19, name: "MVVM Architecture", category: "Tools", proficiency: 90 },
    { id: 20, name: "SaaS Architecture", category: "Tools", proficiency: 85 },
    { id: 21, name: "PRD Writing", category: "Tools", proficiency: 80 }
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
