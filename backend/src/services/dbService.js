const { pool, mockDb, isMockDatabase } = require('../config/db');

class DbService {
  getMockPortfolioData() {
    return {
      site_config: mockDb.site_config,
      projects: [...mockDb.projects].sort((a, b) => a.order_index - b.order_index),
      education: [...mockDb.education],
      experience: [...mockDb.experience],
      skills: [...mockDb.skills].sort((a, b) => b.proficiency - a.proficiency)
    };
  }

  async getPortfolioData() {
    if (!pool) {
      return this.getMockPortfolioData();
    }

    try {
      const [configRes, projectsRes, educationRes, experienceRes, skillsRes] = await Promise.all([
        pool.query('SELECT * FROM site_config WHERE id = 1'),
        pool.query('SELECT * FROM projects ORDER BY order_index ASC, id ASC'),
        pool.query('SELECT * FROM education ORDER BY start_year DESC, id DESC'),
        pool.query('SELECT * FROM experience ORDER BY created_at DESC, id DESC'),
        pool.query('SELECT * FROM skills ORDER BY proficiency DESC, id ASC')
      ]);

      return {
        site_config: configRes.rows[0] || mockDb.site_config,
        projects: projectsRes.rows || [],
        education: educationRes.rows || [],
        experience: experienceRes.rows || [],
        skills: skillsRes.rows || []
      };
    } catch (err) {
      console.warn('⚠️ Neon DB query failed, falling back to mock database:', err.message);
      return this.getMockPortfolioData();
    }
  }

  async updateSiteConfig(configData) {
    const { 
      hero_title, hero_subtitle, profile_image_url, primary_color, font_family, enable_animations, resume_url,
      stat_1_num, stat_1_lbl, stat_2_num, stat_2_lbl, stat_3_num, stat_3_lbl,
      profile_tag_1, profile_tag_2, profile_tag_3, profile_tag_4
    } = configData;
    
    if (!pool) {
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

    const query = `
      UPDATE site_config SET 
        hero_title = COALESCE($1, hero_title),
        hero_subtitle = COALESCE($2, hero_subtitle),
        profile_image_url = COALESCE($3, profile_image_url),
        primary_color = COALESCE($4, primary_color),
        font_family = COALESCE($5, font_family),
        enable_animations = COALESCE($6, enable_animations),
        resume_url = COALESCE($7, resume_url),
        stat_1_num = COALESCE($8, stat_1_num),
        stat_1_lbl = COALESCE($9, stat_1_lbl),
        stat_2_num = COALESCE($10, stat_2_num),
        stat_2_lbl = COALESCE($11, stat_2_lbl),
        stat_3_num = COALESCE($12, stat_3_num),
        stat_3_lbl = COALESCE($13, stat_3_lbl),
        profile_tag_1 = COALESCE($14, profile_tag_1),
        profile_tag_2 = COALESCE($15, profile_tag_2),
        profile_tag_3 = COALESCE($16, profile_tag_3),
        profile_tag_4 = COALESCE($17, profile_tag_4),
        updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `;

    const values = [
      hero_title, hero_subtitle, profile_image_url, primary_color, font_family, enable_animations, resume_url,
      stat_1_num, stat_1_lbl, stat_2_num, stat_2_lbl, stat_3_num, stat_3_lbl,
      profile_tag_1, profile_tag_2, profile_tag_3, profile_tag_4
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // PROJECTS CRUD
  async createProject(projectData) {
    const { title, description, tech_stack, image_url, live_url, github_url, order_index } = projectData;

    if (!pool) {
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

    const { rows } = await pool.query(
      'INSERT INTO projects (title, description, tech_stack, image_url, live_url, github_url, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, tech_stack || [], image_url, live_url, github_url, order_index || 0]
    );
    return rows[0];
  }

  async updateProject(id, projectData) {
    const { title, description, tech_stack, image_url, live_url, github_url, order_index } = projectData;

    if (!pool) {
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

    const query = `
      UPDATE projects SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        tech_stack = COALESCE($3, tech_stack),
        image_url = COALESCE($4, image_url),
        live_url = COALESCE($5, live_url),
        github_url = COALESCE($6, github_url),
        order_index = COALESCE($7, order_index)
      WHERE id = $8
      RETURNING *
    `;
    const { rows } = await pool.query(query, [title, description, tech_stack, image_url, live_url, github_url, order_index, id]);
    if (!rows[0]) throw new Error('Project not found');
    return rows[0];
  }

  async deleteProject(id) {
    if (!pool) {
      const lenBefore = mockDb.projects.length;
      mockDb.projects = mockDb.projects.filter(p => p.id != id);
      if (mockDb.projects.length === lenBefore) {
        throw new Error('Project not found');
      }
      return { success: true, message: 'Project deleted' };
    }

    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    if (rowCount === 0) throw new Error('Project not found');
    return { success: true, message: 'Project deleted' };
  }

  // EDUCATION CRUD
  async createEducation(educationData) {
    const { institution, degree, start_year, end_year, description } = educationData;

    if (!pool) {
      const newEd = { id: Date.now(), institution, degree, start_year, end_year, description };
      mockDb.education.push(newEd);
      return newEd;
    }

    const { rows } = await pool.query(
      'INSERT INTO education (institution, degree, start_year, end_year, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [institution, degree, start_year, end_year, description]
    );
    return rows[0];
  }

  async updateEducation(id, educationData) {
    const { institution, degree, start_year, end_year, description } = educationData;

    if (!pool) {
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

    const query = `
      UPDATE education SET 
        institution = COALESCE($1, institution),
        degree = COALESCE($2, degree),
        start_year = COALESCE($3, start_year),
        end_year = COALESCE($4, end_year),
        description = COALESCE($5, description)
      WHERE id = $6
      RETURNING *
    `;
    const { rows } = await pool.query(query, [institution, degree, start_year, end_year, description, id]);
    if (!rows[0]) throw new Error('Education entry not found');
    return rows[0];
  }

  async deleteEducation(id) {
    if (!pool) {
      const lenBefore = mockDb.education.length;
      mockDb.education = mockDb.education.filter(e => e.id != id);
      if (mockDb.education.length === lenBefore) {
        throw new Error('Education entry not found');
      }
      return { success: true, message: 'Education entry deleted' };
    }

    const { rowCount } = await pool.query('DELETE FROM education WHERE id = $1', [id]);
    if (rowCount === 0) throw new Error('Education entry not found');
    return { success: true, message: 'Education entry deleted' };
  }

  // EXPERIENCE CRUD
  async createExperience(experienceData) {
    const { company, role, duration, achievements_array } = experienceData;

    if (!pool) {
      const newExp = { id: Date.now(), company, role, duration, achievements_array: achievements_array || [] };
      mockDb.experience.push(newExp);
      return newExp;
    }

    const { rows } = await pool.query(
      'INSERT INTO experience (company, role, duration, achievements_array) VALUES ($1, $2, $3, $4) RETURNING *',
      [company, role, duration, achievements_array || []]
    );
    return rows[0];
  }

  async updateExperience(id, experienceData) {
    const { company, role, duration, achievements_array } = experienceData;

    if (!pool) {
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

    const query = `
      UPDATE experience SET 
        company = COALESCE($1, company),
        role = COALESCE($2, role),
        duration = COALESCE($3, duration),
        achievements_array = COALESCE($4, achievements_array)
      WHERE id = $5
      RETURNING *
    `;
    const { rows } = await pool.query(query, [company, role, duration, achievements_array, id]);
    if (!rows[0]) throw new Error('Experience entry not found');
    return rows[0];
  }

  async deleteExperience(id) {
    if (!pool) {
      const lenBefore = mockDb.experience.length;
      mockDb.experience = mockDb.experience.filter(e => e.id != id);
      if (mockDb.experience.length === lenBefore) {
        throw new Error('Experience entry not found');
      }
      return { success: true, message: 'Experience entry deleted' };
    }

    const { rowCount } = await pool.query('DELETE FROM experience WHERE id = $1', [id]);
    if (rowCount === 0) throw new Error('Experience entry not found');
    return { success: true, message: 'Experience entry deleted' };
  }

  // SKILLS CRUD
  async createSkill(skillData) {
    const { name, category, icon_svg, proficiency } = skillData;

    if (!pool) {
      const newSkill = { id: Date.now(), name, category, icon_svg, proficiency: proficiency || 80 };
      mockDb.skills.push(newSkill);
      return newSkill;
    }

    const { rows } = await pool.query(
      'INSERT INTO skills (name, category, icon_svg, proficiency) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, icon_svg || '', proficiency || 80]
    );
    return rows[0];
  }

  async updateSkill(id, skillData) {
    const { name, category, icon_svg, proficiency } = skillData;

    if (!pool) {
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

    const query = `
      UPDATE skills SET 
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        icon_svg = COALESCE($3, icon_svg),
        proficiency = COALESCE($4, proficiency)
      WHERE id = $5
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, category, icon_svg, proficiency, id]);
    if (!rows[0]) throw new Error('Skill not found');
    return rows[0];
  }

  async deleteSkill(id) {
    if (!pool) {
      const lenBefore = mockDb.skills.length;
      mockDb.skills = mockDb.skills.filter(s => s.id != id);
      if (mockDb.skills.length === lenBefore) {
        throw new Error('Skill not found');
      }
      return { success: true, message: 'Skill deleted' };
    }

    const { rowCount } = await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    if (rowCount === 0) throw new Error('Skill not found');
    return { success: true, message: 'Skill deleted' };
  }

  // MESSAGES CRUD
  async createMessage(messageData) {
    const { name, email, subject, message } = messageData;

    if (!pool) {
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

    const { rows } = await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    return rows[0];
  }

  async getMessages() {
    if (!pool) {
      return [...mockDb.messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    return rows;
  }

  async deleteMessage(id) {
    if (!pool) {
      const lenBefore = mockDb.messages.length;
      mockDb.messages = mockDb.messages.filter(m => m.id != id);
      if (mockDb.messages.length === lenBefore) {
        throw new Error('Message not found');
      }
      return { success: true, message: 'Message deleted' };
    }

    const { rowCount } = await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    if (rowCount === 0) throw new Error('Message not found');
    return { success: true, message: 'Message deleted' };
  }
}

module.exports = new DbService();
