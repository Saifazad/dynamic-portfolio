import React from 'react';
import { Briefcase, GraduationCap, Edit2, Trash2 } from 'lucide-react';

export default function TimelineTab({
  experience,
  education,
  experienceForm,
  setExperienceForm,
  educationForm,
  setEducationForm,
  onSaveExperience,
  onDeleteExperience,
  onSaveEducation,
  onDeleteEducation,
  isSubmitting
}) {
  return (
    <div className="grid grid-cols-1 gap-8">
      {/* WORK EXPERIENCE */}
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Briefcase size={20} style={{ color: 'var(--primary-color)' }} />
          {experienceForm.id ? 'Edit Experience Entry' : 'Add Experience Entry'}
        </h2>

        <form onSubmit={onSaveExperience} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
              <input
                type="text"
                value={experienceForm.company}
                onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="Tech Global Corp"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Role / Title</label>
              <input
                type="text"
                value={experienceForm.role}
                onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="Lead Engineer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Duration</label>
            <input
              type="text"
              value={experienceForm.duration}
              onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              placeholder="2022 - Present or Jan 2020 - Dec 2022"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Achievements / Bullet Points (One per line)</label>
            <textarea
              value={experienceForm.achievements}
              onChange={(e) => setExperienceForm({ ...experienceForm, achievements: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none h-28 font-sans text-sm"
              placeholder="Spearheaded migration to microservices.&#10;Managed a team of developers.&#10;Optimized queries."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-white cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {experienceForm.id ? 'Save Experience' : 'Add Experience'}
            </button>
            {experienceForm.id && (
              <button
                type="button"
                onClick={() => setExperienceForm({ id: null, company: '', role: '', duration: '', achievements: '' })}
                className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Experience items table */}
        <div className="mt-8 border-t border-white/5 pt-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Current Experience List</h3>
          <div className="space-y-3">
            {experience.map(exp => (
              <div key={exp.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{exp.role}</h4>
                  <span className="text-xs text-slate-400">{exp.company} | {exp.duration}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExperienceForm({
                      id: exp.id,
                      company: exp.company,
                      role: exp.role,
                      duration: exp.duration,
                      achievements: exp.achievements_array ? exp.achievements_array.join('\n') : ''
                    })}
                    className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg text-slate-400 transition-all cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteExperience(exp.id)}
                    className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-slate-400 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <GraduationCap size={20} style={{ color: 'var(--primary-color)' }} />
          {educationForm.id ? 'Edit Education Entry' : 'Add Education Entry'}
        </h2>

        <form onSubmit={onSaveEducation} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Institution Name</label>
              <input
                type="text"
                value={educationForm.institution}
                onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="Stanford University"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Degree / Qualification</label>
              <input
                type="text"
                value={educationForm.degree}
                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="B.S. Computer Science"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Start Year</label>
              <input
                type="text"
                value={educationForm.start_year}
                onChange={(e) => setEducationForm({ ...educationForm, start_year: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="2016"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">End Year</label>
              <input
                type="text"
                value={educationForm.end_year}
                onChange={(e) => setEducationForm({ ...educationForm, end_year: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="2020 or Present"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Short Description / Grade Details</label>
            <textarea
              value={educationForm.description}
              onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none h-24"
              placeholder="Graduated with honors, specialized in software databases..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-white cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {educationForm.id ? 'Save Education' : 'Add Education'}
            </button>
            {educationForm.id && (
              <button
                type="button"
                onClick={() => setEducationForm({ id: null, institution: '', degree: '', start_year: '', end_year: '', description: '' })}
                className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Education items list */}
        <div className="mt-8 border-t border-white/5 pt-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Current Education List</h3>
          <div className="space-y-3">
            {education.map(ed => (
              <div key={ed.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{ed.degree}</h4>
                  <span className="text-xs text-slate-400">{ed.institution} | {ed.start_year} - {ed.end_year}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEducationForm({
                      id: ed.id,
                      institution: ed.institution,
                      degree: ed.degree,
                      start_year: ed.start_year,
                      end_year: ed.end_year,
                      description: ed.description || ''
                    })}
                    className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg text-slate-400 transition-all cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteEducation(ed.id)}
                    className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-slate-400 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
