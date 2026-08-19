import React, { useRef, useState } from 'react';
import { Plus, Upload, ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { BACKEND_URL } from '../../config';

export default function ProjectsTab({
  projects,
  projectForm,
  setProjectForm,
  onSaveProject,
  onDeleteProject,
  onMoveProject,
  onMockImageUpload,
  onImageUpload,
  isSubmitting
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await onImageUpload(file);
      setProjectForm(prev => ({ ...prev, image_url: uploadedUrl }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Form Block */}
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus size={20} style={{ color: 'var(--primary-color)' }} />
          {projectForm.id ? 'Edit Project' : 'Add New Project'}
        </h2>

        <form onSubmit={onSaveProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Project Title</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="Enter project name..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Order Index</label>
              <input
                type="number"
                value={projectForm.order_index}
                onChange={(e) => setProjectForm({ ...projectForm, order_index: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none h-24"
              placeholder="Write brief summary about the project..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={projectForm.tech_stack}
              onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              placeholder="React, Express, PostgreSQL, Stripe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={projectForm.image_url}
                onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="https://example.com/screenshot.jpg"
              />
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 cursor-pointer transition-colors"
                title="Upload Local Image"
              >
                <Upload size={18} />
                {isUploading && <span className="text-xs">Uploading...</span>}
              </button>

              <button
                type="button"
                onClick={onMockImageUpload}
                className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors text-xs font-semibold"
                title="Generate Mock Image URL"
              >
                Mock
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Live Demo URL</label>
              <input
                type="url"
                value={projectForm.live_url || ''}
                onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">GitHub Code URL</label>
              <input
                type="url"
                value={projectForm.github_url || ''}
                onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-white cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              {projectForm.id ? 'Save Project Changes' : 'Publish Project'}
            </button>
            
            {projectForm.id && (
              <button
                type="button"
                onClick={() => setProjectForm({ 
                  id: null, 
                  title: '', 
                  description: '', 
                  tech_stack: '', 
                  image_url: '', 
                  live_url: '', 
                  github_url: '', 
                  order_index: projects.length + 1 
                })}
                className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Items List */}
      <div className="glass p-8 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-6">Manage Projects Sequence</h3>

        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={proj.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl gap-4">
              <div className="flex items-center gap-4">
                <img src={proj.image_url ? (proj.image_url.startsWith('/uploads') ? `${BACKEND_URL}${proj.image_url}` : proj.image_url) : 'https://picsum.photos/100/100?random=' + proj.id} alt={proj.title} className="w-16 h-10 object-cover rounded-md bg-slate-800" />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{proj.title}</h4>
                  <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">Order: {proj.order_index}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Ordering Actions */}
                <button
                  onClick={() => onMoveProject(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-20"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => onMoveProject(idx, 'down')}
                  disabled={idx === projects.length - 1}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-20"
                >
                  <ChevronDown size={16} />
                </button>

                {/* Edit & Delete */}
                <button
                  onClick={() => setProjectForm({
                    id: proj.id,
                    title: proj.title,
                    description: proj.description,
                    tech_stack: proj.tech_stack ? proj.tech_stack.join(', ') : '',
                    image_url: proj.image_url || '',
                    live_url: proj.live_url || '',
                    github_url: proj.github_url || '',
                    order_index: proj.order_index
                  })}
                  className="p-2 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-lg text-slate-400 transition-colors cursor-pointer"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-slate-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
