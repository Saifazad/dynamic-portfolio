import React, { useRef, useState } from 'react';
import { Settings, Upload } from 'lucide-react';
import { FONT_OPTIONS } from '../../context/ThemeContext';

export default function SettingsTab({ 
  settingsForm, 
  onSettingsChange, 
  onSaveSettings, 
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
      onSettingsChange('profile_image_url', uploadedUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="glass p-8 rounded-3xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Settings size={20} style={{ color: 'var(--primary-color)' }} />
        Global Customizer & Configuration
      </h2>

      <form onSubmit={onSaveSettings} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Hero Title</label>
          <input
            type="text"
            value={settingsForm.hero_title}
            onChange={(e) => onSettingsChange('hero_title', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Enter hero main heading..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Hero Subtitle</label>
          <textarea
            value={settingsForm.hero_subtitle}
            onChange={(e) => onSettingsChange('hero_subtitle', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none h-24"
            placeholder="Enter short tagline..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Profile Image URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={settingsForm.profile_image_url || ''}
              onChange={(e) => onSettingsChange('profile_image_url', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              placeholder="https://images.unsplash.com/photo-..."
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
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 cursor-pointer transition-colors text-xs font-semibold whitespace-nowrap"
              title="Upload Local Photo"
            >
              <Upload size={16} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>

            <button
              type="button"
              onClick={() => {
                const randomId = Math.floor(Math.random() * 70) + 1;
                const url = `https://i.pravatar.cc/500?img=${randomId}`;
                onSettingsChange('profile_image_url', url);
              }}
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer transition-colors text-xs font-semibold whitespace-nowrap"
              title="Use Random Avatar"
            >
              Mock Photo
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Resume / CV URL</label>
          <input
            type="text"
            value={settingsForm.resume_url || ''}
            onChange={(e) => onSettingsChange('resume_url', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
            placeholder="https://example.com/resume.pdf"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Primary Color</label>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <input
                type="color"
                value={settingsForm.primary_color}
                onChange={(e) => onSettingsChange('primary_color', e.target.value)}
              />
              <input
                type="text"
                value={settingsForm.primary_color}
                onChange={(e) => onSettingsChange('primary_color', e.target.value)}
                className="bg-transparent text-white focus:outline-none text-sm w-full font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Font Family</label>
            <select
              value={settingsForm.font_family}
              onChange={(e) => onSettingsChange('font_family', e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.name} value={font.name}>{font.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Hero Stats Customizer */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Hero Stats Counters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Stat 1 (e.g. 4+)</span>
              <input
                type="text"
                value={settingsForm.stat_1_num || ''}
                onChange={(e) => onSettingsChange('stat_1_num', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="4+"
              />
              <input
                type="text"
                value={settingsForm.stat_1_lbl || ''}
                onChange={(e) => onSettingsChange('stat_1_lbl', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                placeholder="Years Exp"
              />
            </div>

            {/* Stat 2 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Stat 2 (e.g. 15+)</span>
              <input
                type="text"
                value={settingsForm.stat_2_num || ''}
                onChange={(e) => onSettingsChange('stat_2_num', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="15+"
              />
              <input
                type="text"
                value={settingsForm.stat_2_lbl || ''}
                onChange={(e) => onSettingsChange('stat_2_lbl', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                placeholder="Live Projects"
              />
            </div>

            {/* Stat 3 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Stat 3 (e.g. 100%)</span>
              <input
                type="text"
                value={settingsForm.stat_3_num || ''}
                onChange={(e) => onSettingsChange('stat_3_num', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="100%"
              />
              <input
                type="text"
                value={settingsForm.stat_3_lbl || ''}
                onChange={(e) => onSettingsChange('stat_3_lbl', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500"
                placeholder="Success Rate"
              />
            </div>
          </div>
        </div>

        {/* Profile Parallax Tags Customizer */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Profile Image Floating Tags</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tag 1 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Tag 1 (Green Dot)</span>
              <input
                type="text"
                value={settingsForm.profile_tag_1 || ''}
                onChange={(e) => onSettingsChange('profile_tag_1', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="React"
              />
            </div>

            {/* Tag 2 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Tag 2 (Blue Dot)</span>
              <input
                type="text"
                value={settingsForm.profile_tag_2 || ''}
                onChange={(e) => onSettingsChange('profile_tag_2', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="Node.js"
              />
            </div>

            {/* Tag 3 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Tag 3 (Lightning ⚡)</span>
              <input
                type="text"
                value={settingsForm.profile_tag_3 || ''}
                onChange={(e) => onSettingsChange('profile_tag_3', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="Full-Stack"
              />
            </div>

            {/* Tag 4 */}
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-semibold text-slate-400">Tag 4 (Purple Dot)</span>
              <input
                type="text"
                value={settingsForm.profile_tag_4 || ''}
                onChange={(e) => onSettingsChange('profile_tag_4', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="Supabase"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">

          <div>
            <h4 className="text-sm font-semibold text-white">Enable Motion Animations</h4>
            <p className="text-xs text-slate-400 mt-1">Activate transitions, scrolls, and visual hover delays.</p>
          </div>
          <button
            type="button"
            onClick={() => onSettingsChange('enable_animations', !settingsForm.enable_animations)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              settingsForm.enable_animations ? 'bg-indigo-500' : 'bg-slate-700'
            }`}
            style={settingsForm.enable_animations ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              settingsForm.enable_animations ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-white cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          {isSubmitting ? 'Saving Configuration...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
