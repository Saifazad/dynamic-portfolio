const { supabase, mockDb, isMockDatabase } = require('../config/db');

class DbService {
  async getPortfolioData() {
    if (isMockDatabase) {
      return {
        site_config: mockDb.site_config,
        projects: [...mockDb.projects].sort((a, b) => a.order_index - b.order_index),
        education: [...mockDb.education],
        experience: [...mockDb.experience],
        skills: [...mockDb.skills].sort((a, b) => b.proficiency - a.proficiency)
      };
    }

    // Parallel fetching for optimal response times
    const [configRes, projectsRes, educationRes, experienceRes, skillsRes] = await Promise.all([
      supabase.from('site_config').select('*').eq('id', 1).single(),
      supabase.from('projects').select('*').order('order_index', { ascending: true }),
      supabase.from('education').select('*').order('start_year', { ascending: false }),
      supabase.from('experience').select('*').order('created_at', { ascending: false }),
      supabase.from('skills').select('*').order('proficiency', { ascending: false })
    ]);

    if (configRes.error && configRes.error.code !== 'PGRST116') {
      throw configRes.error;
    }
    if (projectsRes.error) throw projectsRes.error;
    if (educationRes.error) throw educationRes.error;
    if (experienceRes.error) throw experienceRes.error;
    if (skillsRes.error) throw skillsRes.error;

    // Handle initial state where site_config might be empty
    let site_config = configRes.data;
    if (!site_config) {
      // Create default
      const { data: defaultData, error: insertError } = await supabase.from('site_config').insert({
        id: 1,
        hero_title: "Hi, I'm Saif. I Build Dynamic Full-Stack Applications.",
        hero_subtitle: "A passionate developer specialized in React, Node.js, and Cloud Infrastructure.",
        profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
        primary_color: "#6366f1",
        font_family: "Inter",
        enable_animations: true,
        resume_url: "https://example.com/resume.pdf",
        stat_1_num: "4+",
        stat_1_lbl: "Years Exp",
        stat_2_num: "15+",
        stat_2_lbl: "Live Projects",
        stat_3_num: "100%",
        stat_3_lbl: "Success Rate",
        profile_tag_1: "React",
        profile_tag_2: "Node.js",
        profile_tag_3: "Full-Stack",
        profile_tag_4: "Supabase"
      }).select().single();
      
      if (insertError) throw insertError;
      site_config = defaultData;
    }

    return {
      site_config,
      projects: projectsRes.data || [],
      education: educationRes.data || [],
      experience: experienceRes.data || [],
      skills: skillsRes.data || []
    };
  }

  async updateSiteConfig(configData) {
    const { 
      hero_title, hero_subtitle, profile_image_url, primary_color, font_family, enable_animations, resume_url,
      stat_1_num, stat_1_lbl, stat_2_num, stat_2_lbl, stat_3_num, stat_3_lbl,
      profile_tag_1, profile_tag_2, profile_tag_3, profile_tag_4
    } = configData;
    
    if (isMockDatabase) {
      mockDb.site_config = {
        ...mockDb.site_config,
        hero_title: hero_title !== undefined ? hero_title : mockDb.site_config.hero_title,
        hero_subtitle: hero_subtitle !== undefined ? hero_subtitle : mockDb.site_config.hero_subtitle,
        profile_image_url: profile_image_url !== undefined ? profile_image_url : mockDb.site_config.profile_image_url,
        primary_color: primary_color !== undefined ? primary_color : mockDb.site_config.primary_color,
        font_family: font_family !== undefined ? font_family : mockDb.site_config.font_family,
        enable_animations: enable_animations !== undefined ? enable_animations : mockDb.site_config.enable_animations,
        resume_url: resume_url !== undefined ? resume_url : mockDb.site_config.resume_url,
        stat_1_num: stat_1_num !== undefined ? stat_1_num : mockDb.site_config.stat_1_num,
        stat_1_lbl: stat_1_lbl !== undefined ? stat_1_lbl : mockDb.site_config.stat_1_lbl,
        stat_2_num: stat_2_num !== undefined ? stat_2_num : mockDb.site_config.stat_2_num,
        stat_2_lbl: stat_2_lbl !== undefined ? stat_2_lbl : mockDb.site_config.stat_2_lbl,
        stat_3_num: stat_3_num !== undefined ? stat_3_num : mockDb.site_config.stat_3_num,
        stat_3_lbl: stat_3_lbl !== undefined ? stat_3_lbl : mockDb.site_config.stat_3_lbl,
        profile_tag_1: profile_tag_1 !== undefined ? profile_tag_1 : mockDb.site_config.profile_tag_1,
        profile_tag_2: profile_tag_2 !== undefined ? profile_tag_2 : mockDb.site_config.profile_tag_2,
        profile_tag_3: profile_tag_3 !== undefined ? profile_tag_3 : mockDb.site_config.profile_tag_3,
        profile_tag_4: profile_tag_4 !== undefined ? profile_tag_4 : mockDb.site_config.profile_tag_4
      };
      return mockDb.site_config;
    }

    const { data, error } = await supabase
      .from('site_config')
      .update({ 
        hero_title, hero_subtitle, profile_image_url, primary_color, font_family, enable_animations, resume_url, 
        stat_1_num, stat_1_lbl, stat_2_num, stat_2_lbl, stat_3_num, stat_3_lbl,
        profile_tag_1, profile_tag_2, profile_tag_3, profile_tag_4,
        updated_at: new Date() 
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // PROJECTS CRUD
  async createProject(projectData) {
    const { title, description, tech_stack, image_url, live_url, github_url, order_index } = projectData;

    if (isMockDatabase) {
      const newProj = {
        id: Date.now(),
        title,
        description,
        tech_stack: tech_stack || [],
        image_url,
        live_url,
        github_url,
        order_index: order_index || 0
      };
      mockDb.projects.push(newProj);
      return newProj;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({ title, description, tech_stack, image_url, live_url, github_url, order_index })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProject(id, projectData) {
    const { title, description, tech_stack, image_url, live_url, github_url, order_index } = projectData;

    if (isMockDatabase) {
      const idx = mockDb.projects.findIndex(p => p.id == id);
      if (idx === -1) throw new Error('Project not found');
      mockDb.projects[idx] = {
        ...mockDb.projects[idx],
        title: title !== undefined ? title : mockDb.projects[idx].title,
        description: description !== undefined ? description : mockDb.projects[idx].description,
        tech_stack: tech_stack !== undefined ? tech_stack : mockDb.projects[idx].tech_stack,
        image_url: image_url !== undefined ? image_url : mockDb.projects[idx].image_url,
        live_url: live_url !== undefined ? live_url : mockDb.projects[idx].live_url,
        github_url: github_url !== undefined ? github_url : mockDb.projects[idx].github_url,
        order_index: order_index !== undefined ? order_index : mockDb.projects[idx].order_index
      };
      return mockDb.projects[idx];
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ title, description, tech_stack, image_url, live_url, github_url, order_index })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id) {
    if (isMockDatabase) {
      const lenBefore = mockDb.projects.length;
      mockDb.projects = mockDb.projects.filter(p => p.id != id);
      if (mockDb.projects.length === lenBefore) {
        throw new Error('Project not found');
      }
      return { success: true, message: 'Project deleted' };
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Project deleted' };
  }

  // EDUCATION CRUD
  async createEducation(educationData) {
    const { institution, degree, start_year, end_year, description } = educationData;

    if (isMockDatabase) {
      const newEd = { id: Date.now(), institution, degree, start_year, end_year, description };
      mockDb.education.push(newEd);
      return newEd;
    }

    const { data, error } = await supabase
      .from('education')
      .insert({ institution, degree, start_year, end_year, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEducation(id, educationData) {
    const { institution, degree, start_year, end_year, description } = educationData;

    if (isMockDatabase) {
      const idx = mockDb.education.findIndex(e => e.id == id);
      if (idx === -1) throw new Error('Education entry not found');
      mockDb.education[idx] = {
        ...mockDb.education[idx],
        institution: institution !== undefined ? institution : mockDb.education[idx].institution,
        degree: degree !== undefined ? degree : mockDb.education[idx].degree,
        start_year: start_year !== undefined ? start_year : mockDb.education[idx].start_year,
        end_year: end_year !== undefined ? end_year : mockDb.education[idx].end_year,
        description: description !== undefined ? description : mockDb.education[idx].description
      };
      return mockDb.education[idx];
    }

    const { data, error } = await supabase
      .from('education')
      .update({ institution, degree, start_year, end_year, description })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEducation(id) {
    if (isMockDatabase) {
      const lenBefore = mockDb.education.length;
      mockDb.education = mockDb.education.filter(e => e.id != id);
      if (mockDb.education.length === lenBefore) {
        throw new Error('Education entry not found');
      }
      return { success: true, message: 'Education entry deleted' };
    }

    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Education entry deleted' };
  }

  // EXPERIENCE CRUD
  async createExperience(experienceData) {
    const { company, role, duration, achievements_array } = experienceData;

    if (isMockDatabase) {
      const newExp = { id: Date.now(), company, role, duration, achievements_array: achievements_array || [] };
      mockDb.experience.push(newExp);
      return newExp;
    }

    const { data, error } = await supabase
      .from('experience')
      .insert({ company, role, duration, achievements_array })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateExperience(id, experienceData) {
    const { company, role, duration, achievements_array } = experienceData;

    if (isMockDatabase) {
      const idx = mockDb.experience.findIndex(e => e.id == id);
      if (idx === -1) throw new Error('Experience entry not found');
      mockDb.experience[idx] = {
        ...mockDb.experience[idx],
        company: company !== undefined ? company : mockDb.experience[idx].company,
        role: role !== undefined ? role : mockDb.experience[idx].role,
        duration: duration !== undefined ? duration : mockDb.experience[idx].duration,
        achievements_array: achievements_array !== undefined ? achievements_array : mockDb.experience[idx].achievements_array
      };
      return mockDb.experience[idx];
    }

    const { data, error } = await supabase
      .from('experience')
      .update({ company, role, duration, achievements_array })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteExperience(id) {
    if (isMockDatabase) {
      const lenBefore = mockDb.experience.length;
      mockDb.experience = mockDb.experience.filter(e => e.id != id);
      if (mockDb.experience.length === lenBefore) {
        throw new Error('Experience entry not found');
      }
      return { success: true, message: 'Experience entry deleted' };
    }

    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Experience entry deleted' };
  }

  // SKILLS CRUD
  async createSkill(skillData) {
    const { name, category, icon_svg, proficiency } = skillData;

    if (isMockDatabase) {
      const newSkill = { id: Date.now(), name, category, icon_svg, proficiency: proficiency || 80 };
      mockDb.skills.push(newSkill);
      return newSkill;
    }

    const { data, error } = await supabase
      .from('skills')
      .insert({ name, category, icon_svg, proficiency })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSkill(id, skillData) {
    const { name, category, icon_svg, proficiency } = skillData;

    if (isMockDatabase) {
      const idx = mockDb.skills.findIndex(s => s.id == id);
      if (idx === -1) throw new Error('Skill not found');
      mockDb.skills[idx] = {
        ...mockDb.skills[idx],
        name: name !== undefined ? name : mockDb.skills[idx].name,
        category: category !== undefined ? category : mockDb.skills[idx].category,
        icon_svg: icon_svg !== undefined ? icon_svg : mockDb.skills[idx].icon_svg,
        proficiency: proficiency !== undefined ? proficiency : mockDb.skills[idx].proficiency
      };
      return mockDb.skills[idx];
    }

    const { data, error } = await supabase
      .from('skills')
      .update({ name, category, icon_svg, proficiency })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSkill(id) {
    if (isMockDatabase) {
      const lenBefore = mockDb.skills.length;
      mockDb.skills = mockDb.skills.filter(s => s.id != id);
      if (mockDb.skills.length === lenBefore) {
        throw new Error('Skill not found');
      }
      return { success: true, message: 'Skill deleted' };
    }

    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Skill deleted' };
  }

  // MESSAGES CRUD
  async createMessage(messageData) {
    const { name, email, subject, message } = messageData;

    if (isMockDatabase) {
      const newMsg = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        created_at: new Date()
      };
      mockDb.messages.push(newMsg);
      return newMsg;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({ name, email, subject, message })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMessages() {
    if (isMockDatabase) {
      return [...mockDb.messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async deleteMessage(id) {
    if (isMockDatabase) {
      const lenBefore = mockDb.messages.length;
      mockDb.messages = mockDb.messages.filter(m => m.id != id);
      if (mockDb.messages.length === lenBefore) {
        throw new Error('Message not found');
      }
      return { success: true, message: 'Message deleted' };
    }

    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Message deleted' };
  }
}

module.exports = new DbService();
