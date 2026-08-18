import React from 'react';
import { Code, Edit2, Trash2 } from 'lucide-react';

export default function SkillsTab({
  skills,
  skillForm,
  setSkillForm,
  onSaveSkill,
  onDeleteSkill,
  isSubmitting
}) {
  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Code size={20} style={{ color: 'var(--primary-color)' }} />
          {skillForm.id ? 'Edit Skill Details' : 'Add New Skill'}
        </h2>

        <form onSubmit={onSaveSkill} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Skill Name</label>
              <input
                type="text"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="React, Python, AWS..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
              <span>Proficiency Percentage</span>
              <span className="font-mono text-sm text-indigo-400" style={{ color: 'var(--primary-color)' }}>{skillForm.proficiency}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={skillForm.proficiency}
              onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              style={{ accentColor: 'var(--primary-color)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Icon SVG String (Optional)</label>
            <textarea
              value={skillForm.icon_svg}
              onChange={(e) => setSkillForm({ ...skillForm, icon_svg: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none h-28 font-mono text-xs"
              placeholder="<svg>...</svg>"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-white cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {skillForm.id ? 'Save Skill' : 'Add Skill'}
            </button>
            {skillForm.id && (
              <button
                type="button"
                onClick={() => setSkillForm({ id: null, name: '', category: 'Frontend', icon_svg: '', proficiency: 80 })}
                className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Skill Matrix List */}
      <div className="glass p-8 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-6">Current Skills Matrix</h3>

        <div className="space-y-4">
          {skills.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 p-2"
                  style={{ color: 'var(--primary-color)' }}>
                  {s.icon_svg ? (
                    <div className="w-full h-full flex items-center justify-center svg-icon-container" dangerouslySetInnerHTML={{ __html: s.icon_svg }} />
                  ) : (
                    <Code size={18} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{s.name}</h4>
                  <span className="text-xs text-slate-500 font-semibold">{s.category} | {s.proficiency}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSkillForm({
                    id: s.id,
                    name: s.name,
                    category: s.category || 'Frontend',
                    icon_svg: s.icon_svg || '',
                    proficiency: s.proficiency || 80
                  })}
                  className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg text-slate-400 transition-all cursor-pointer"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDeleteSkill(s.id)}
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
  );
}
