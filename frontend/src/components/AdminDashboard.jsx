import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Briefcase, GraduationCap, Code, Mail } from 'lucide-react';

import AuthCard from './admin/AuthCard';
import ToastContainer from './admin/ToastContainer';
import SettingsTab from './admin/SettingsTab';
import ProjectsTab from './admin/ProjectsTab';
import TimelineTab from './admin/TimelineTab';
import SkillsTab from './admin/SkillsTab';
import MessagesTab from './admin/MessagesTab';

export default function AdminDashboard({ data, onDataUpdated, backendUrl }) {
  const { theme, updateThemeOptimistic } = useTheme();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('settings');
  
  // Auth State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('api_auth_token') || 'dev-token-12345');
  const [isAuthValid, setIsAuthValid] = useState(true);

  // Toast System State
  const [toasts, setToasts] = useState([]);

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [settingsForm, setSettingsForm] = useState({
    hero_title: '',
    hero_subtitle: '',
    profile_image_url: '',
    primary_color: '',
    font_family: '',
    enable_animations: true,
    resume_url: '',
    stat_1_num: '',
    stat_1_lbl: '',
    stat_2_num: '',
    stat_2_lbl: '',
    stat_3_num: '',
    stat_3_lbl: '',
    profile_tag_1: '',
    profile_tag_2: '',
    profile_tag_3: '',
    profile_tag_4: ''
  });

  const [projectForm, setProjectForm] = useState({
    id: null,
    title: '',
    description: '',
    tech_stack: '',
    image_url: '',
    live_url: '',
    github_url: '',
    order_index: 0
  });

  const [experienceForm, setExperienceForm] = useState({
    id: null,
    company: '',
    role: '',
    duration: '',
    achievements: '' // comma-separated or newline-separated
  });

  const [educationForm, setEducationForm] = useState({
    id: null,
    institution: '',
    degree: '',
    start_year: '',
    end_year: '',
    description: ''
  });

  const [skillForm, setSkillForm] = useState({
    id: null,
    name: '',
    category: 'Frontend',
    icon_svg: '',
    proficiency: 80
  });

  // Sync settings form with theme context data
  useEffect(() => {
    if (theme) {
      setSettingsForm({
        hero_title: theme.hero_title || '',
        hero_subtitle: theme.hero_subtitle || '',
        profile_image_url: theme.profile_image_url || '',
        primary_color: theme.primary_color || '#6366f1',
        font_family: theme.font_family || 'Inter',
        enable_animations: theme.enable_animations !== undefined ? theme.enable_animations : true,
        resume_url: theme.resume_url || '',
        stat_1_num: theme.stat_1_num || '',
        stat_1_lbl: theme.stat_1_lbl || '',
        stat_2_num: theme.stat_2_num || '',
        stat_2_lbl: theme.stat_2_lbl || '',
        stat_3_num: theme.stat_3_num || '',
        stat_3_lbl: theme.stat_3_lbl || '',
        profile_tag_1: theme.profile_tag_1 || '',
        profile_tag_2: theme.profile_tag_2 || '',
        profile_tag_3: theme.profile_tag_3 || '',
        profile_tag_4: theme.profile_tag_4 || ''
      });
    }
  }, [theme]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth Header Builder
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };
  };

  // Handle Token Change
  const saveAuthToken = (e) => {
    e.preventDefault();
    localStorage.setItem('api_auth_token', authToken);
    addToast('Auth Token saved in browser!', 'success');
  };

  // 1. SITE CONFIG / SETTINGS ACTIONS
  const handleSettingsChange = (field, value) => {
    // Real-time optimistic update in local context
    updateThemeOptimistic({ [field]: value });
    setSettingsForm(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/site-config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settingsForm)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save settings');
      }

      const updated = await res.json();
      onDataUpdated('site_config', updated);
      addToast('Site configuration saved to database!', 'success');
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      if (err.message.includes('Unauthorized')) setIsAuthValid(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. PROJECT ACTIONS (CRUD & REORDERING)
  const saveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      return addToast('Title and Description are required', 'error');
    }

    setIsSubmitting(true);
    
    // Parse tech stack comma separated
    const techArray = projectForm.tech_stack
      ? projectForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const isEdit = projectForm.id !== null;
    const url = isEdit 
      ? `${backendUrl}/api/projects/${projectForm.id}`
      : `${backendUrl}/api/projects`;
    
    const method = isEdit ? 'PUT' : 'POST';

    // Optimistic UI updates
    const tempId = projectForm.id || Date.now();
    const optimisticProj = {
      id: tempId,
      title: projectForm.title,
      description: projectForm.description,
      tech_stack: techArray,
      image_url: projectForm.image_url || 'https://picsum.photos/600/400',
      live_url: projectForm.live_url,
      github_url: projectForm.github_url,
      order_index: parseInt(projectForm.order_index) || 0
    };

    if (isEdit) {
      onDataUpdated('projects', data.projects.map(p => p.id === projectForm.id ? optimisticProj : p));
    } else {
      onDataUpdated('projects', [...data.projects, optimisticProj]);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...optimisticProj,
          id: undefined // server will generate or use route param
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save project');
      }

      const saved = await res.json();
      
      // Update with actual database record
      if (isEdit) {
        onDataUpdated('projects', data.projects.map(p => p.id === projectForm.id ? saved : p));
        addToast('Project updated successfully!', 'success');
      } else {
        onDataUpdated('projects', data.projects.map(p => p.id === tempId ? saved : p));
        addToast('Project created successfully!', 'success');
      }

      // Reset Form
      setProjectForm({
        id: null,
        title: '',
        description: '',
        tech_stack: '',
        image_url: '',
        live_url: '',
        github_url: '',
        order_index: data.projects.length + 1
      });
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      // Revert optimistic updates
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    // Optimistic Delete
    const original = data.projects;
    onDataUpdated('projects', data.projects.filter(p => p.id !== id));

    try {
      const res = await fetch(`${backendUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete project');
      }

      addToast('Project deleted successfully!', 'success');
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      onDataUpdated('projects', original);
    }
  };

  const moveProject = async (index, direction) => {
    const newProjects = [...data.projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    // Swap order
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Recalculate order indices
    const updatedProjects = newProjects.map((p, idx) => ({
      ...p,
      order_index: idx + 1
    }));

    onDataUpdated('projects', updatedProjects);

    // Save reordering to database
    try {
      addToast('Updating project sequence...', 'info');
      await Promise.all(
        updatedProjects.map(p => 
          fetch(`${backendUrl}/api/projects/${p.id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ order_index: p.order_index })
          })
        )
      );
      addToast('Project reordered successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Reordering save failed', 'error');
    }
  };

  const handleMockImageUpload = () => {
    // Generate standard lorem-picsum image URL as mock upload helper
    const randomId = Math.floor(Math.random() * 100) + 1;
    const url = `https://picsum.photos/600/400?random=${randomId}`;
    setProjectForm(prev => ({ ...prev, image_url: url }));
    addToast('Mock file upload: Image URL generated!', 'success');
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await res.json();
      return uploadData.url; // Returns "/uploads/filename.ext"
    } catch (err) {
      console.error('File upload error:', err);
      addToast(err.message || 'File upload failed', 'error');
      throw err;
    }
  };


  // 3. EXPERIENCE ACTIONS
  const saveExperience = async (e) => {
    e.preventDefault();
    if (!experienceForm.company || !experienceForm.role || !experienceForm.duration) {
      return addToast('Please fill all required experience fields', 'error');
    }

    setIsSubmitting(true);
    const achievementsArray = experienceForm.achievements
      ? experienceForm.achievements.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const isEdit = experienceForm.id !== null;
    const url = isEdit 
      ? `${backendUrl}/api/experience/${experienceForm.id}`
      : `${backendUrl}/api/experience`;
    
    const method = isEdit ? 'PUT' : 'POST';
    const tempId = experienceForm.id || Date.now();

    const optimisticExp = {
      id: tempId,
      company: experienceForm.company,
      role: experienceForm.role,
      duration: experienceForm.duration,
      achievements_array: achievementsArray
    };

    if (isEdit) {
      onDataUpdated('experience', data.experience.map(e => e.id === experienceForm.id ? optimisticExp : e));
    } else {
      onDataUpdated('experience', [optimisticExp, ...data.experience]);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...optimisticExp,
          id: undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save experience');
      }

      const saved = await res.json();
      if (isEdit) {
        onDataUpdated('experience', data.experience.map(e => e.id === experienceForm.id ? saved : e));
        addToast('Experience updated successfully!', 'success');
      } else {
        onDataUpdated('experience', data.experience.map(e => e.id === tempId ? saved : e));
        addToast('Experience added successfully!', 'success');
      }

      setExperienceForm({ id: null, company: '', role: '', duration: '', achievements: '' });
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    const original = data.experience;
    onDataUpdated('experience', data.experience.filter(e => e.id !== id));

    try {
      const res = await fetch(`${backendUrl}/api/experience/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete experience');
      }

      addToast('Experience deleted!', 'success');
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      onDataUpdated('experience', original);
    }
  };

  // 4. EDUCATION ACTIONS
  const saveEducation = async (e) => {
    e.preventDefault();
    if (!educationForm.institution || !educationForm.degree || !educationForm.start_year || !educationForm.end_year) {
      return addToast('Please fill all required education fields', 'error');
    }

    setIsSubmitting(true);
    const isEdit = educationForm.id !== null;
    const url = isEdit 
      ? `${backendUrl}/api/education/${educationForm.id}`
      : `${backendUrl}/api/education`;
    
    const method = isEdit ? 'PUT' : 'POST';
    const tempId = educationForm.id || Date.now();

    const optimisticEd = {
      id: tempId,
      institution: educationForm.institution,
      degree: educationForm.degree,
      start_year: educationForm.start_year,
      end_year: educationForm.end_year,
      description: educationForm.description
    };

    if (isEdit) {
      onDataUpdated('education', data.education.map(ed => ed.id === educationForm.id ? optimisticEd : ed));
    } else {
      onDataUpdated('education', [optimisticEd, ...data.education]);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...optimisticEd,
          id: undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save education');
      }

      const saved = await res.json();
      if (isEdit) {
        onDataUpdated('education', data.education.map(ed => ed.id === educationForm.id ? saved : ed));
        addToast('Education updated!', 'success');
      } else {
        onDataUpdated('education', data.education.map(ed => ed.id === tempId ? saved : ed));
        addToast('Education added!', 'success');
      }

      setEducationForm({ id: null, institution: '', degree: '', start_year: '', end_year: '', description: '' });
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEducation = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    const original = data.education;
    onDataUpdated('education', data.education.filter(ed => ed.id !== id));

    try {
      const res = await fetch(`${backendUrl}/api/education/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete education');
      }

      addToast('Education entry deleted!', 'success');
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      onDataUpdated('education', original);
    }
  };

  // 5. SKILLS ACTIONS
  const saveSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.category) {
      return addToast('Name and Category are required for skills', 'error');
    }

    setIsSubmitting(true);
    const isEdit = skillForm.id !== null;
    const url = isEdit 
      ? `${backendUrl}/api/skills/${skillForm.id}`
      : `${backendUrl}/api/skills`;
    
    const method = isEdit ? 'PUT' : 'POST';
    const tempId = skillForm.id || Date.now();

    const optimisticSkill = {
      id: tempId,
      name: skillForm.name,
      category: skillForm.category,
      icon_svg: skillForm.icon_svg,
      proficiency: parseInt(skillForm.proficiency) || 80
    };

    if (isEdit) {
      onDataUpdated('skills', data.skills.map(s => s.id === skillForm.id ? optimisticSkill : s));
    } else {
      onDataUpdated('skills', [...data.skills, optimisticSkill]);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...optimisticSkill,
          id: undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save skill');
      }

      const saved = await res.json();
      if (isEdit) {
        onDataUpdated('skills', data.skills.map(s => s.id === skillForm.id ? saved : s));
        addToast('Skill updated successfully!', 'success');
      } else {
        onDataUpdated('skills', data.skills.map(s => s.id === tempId ? saved : s));
        addToast('Skill added successfully!', 'success');
      }

      setSkillForm({ id: null, name: '', category: 'Frontend', icon_svg: '', proficiency: 80 });
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const original = data.skills;
    onDataUpdated('skills', data.skills.filter(s => s.id !== id));

    try {
      const res = await fetch(`${backendUrl}/api/skills/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete skill');
      }

      addToast('Skill deleted!', 'success');
      setIsAuthValid(true);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
      onDataUpdated('skills', original);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Portfolio Management</h1>
          <p className="text-slate-400 text-sm">Update and manage content across the entire dynamic frontend.</p>
        </div>

        {/* Global Authentication Key Holder */}
        <AuthCard 
          authToken={authToken} 
          setAuthToken={setAuthToken} 
          isAuthValid={isAuthValid} 
          onSaveAuthToken={saveAuthToken} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Navigation Links */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left p-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors ${
              activeTab === 'settings' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === 'settings' ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            <Settings size={18} />
            Site Settings
          </button>
          
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left p-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors ${
              activeTab === 'projects' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === 'projects' ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            <Code size={18} />
            Projects Grid
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full text-left p-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors ${
              activeTab === 'timeline' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === 'timeline' ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            <GraduationCap size={18} />
            Education & Experience
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full text-left p-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors ${
              activeTab === 'skills' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === 'skills' ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            <Code size={18} />
            Skills Matrix
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left p-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors ${
              activeTab === 'messages' 
                ? 'text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={activeTab === 'messages' ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            <Mail size={18} />
            Visitor Messages
          </button>
        </div>

        {/* Right Side: Tab Workspaces */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsTab 
              settingsForm={settingsForm} 
              onSettingsChange={handleSettingsChange} 
              onSaveSettings={saveSettings} 
              onImageUpload={handleImageUpload}
              isSubmitting={isSubmitting} 
            />
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <ProjectsTab 
              projects={data.projects} 
              projectForm={projectForm} 
              setProjectForm={setProjectForm} 
              onSaveProject={saveProject} 
              onDeleteProject={deleteProject} 
              onMoveProject={moveProject} 
              onMockImageUpload={handleMockImageUpload} 
              onImageUpload={handleImageUpload}
              isSubmitting={isSubmitting} 
            />
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <TimelineTab 
              experience={data.experience} 
              education={data.education} 
              experienceForm={experienceForm} 
              setExperienceForm={setExperienceForm} 
              educationForm={educationForm} 
              setEducationForm={setEducationForm} 
              onSaveExperience={saveExperience} 
              onDeleteExperience={deleteExperience} 
              onSaveEducation={saveEducation} 
              onDeleteEducation={deleteEducation} 
              isSubmitting={isSubmitting} 
            />
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <SkillsTab 
              skills={data.skills} 
              skillForm={skillForm} 
              setSkillForm={setSkillForm} 
              onSaveSkill={saveSkill} 
              onDeleteSkill={deleteSkill} 
              isSubmitting={isSubmitting} 
            />
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <MessagesTab 
              backendUrl={backendUrl}
              token={authToken}
              addToast={addToast}
            />
          )}

        </div>
      </div>
    </div>
  );
}
