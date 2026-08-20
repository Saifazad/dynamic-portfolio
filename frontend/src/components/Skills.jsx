import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Cpu, Search, Award, Sparkles, Trophy } from 'lucide-react';
import TiltCard from './TiltCard';
import TextReveal from './TextReveal';
import { FadeIn } from './MotionProvider';

export default function Skills({ skills }) {
  const { theme } = useTheme();
  const animationsEnabled = theme?.enable_animations ?? true;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate dynamic metrics based on the current skills list
  const { totalCount, averageProficiency, bestCategory } = useMemo(() => {
    if (!skills || skills.length === 0) {
      return { totalCount: 0, averageProficiency: 0, bestCategory: 'N/A' };
    }
    const total = skills.length;
    const avg = Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / total);

    const categoryStats = skills.reduce((acc, s) => {
      const cat = s.category || 'Other';
      if (!acc[cat]) acc[cat] = { sum: 0, count: 0 };
      acc[cat].sum += s.proficiency;
      acc[cat].count += 1;
      return acc;
    }, {});

    let bestCat = 'N/A';
    let maxAvg = 0;
    Object.entries(categoryStats).forEach(([cat, data]) => {
      const catAvg = data.sum / data.count;
      if (catAvg > maxAvg) {
        maxAvg = catAvg;
        bestCat = cat;
      }
    });

    return { totalCount: total, averageProficiency: avg, bestCategory: bestCat };
  }, [skills]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    if (!skills || skills.length === 0) return ['All'];
    const cats = new Set(skills.map(s => s.category || 'Other'));
    return ['All', ...Array.from(cats)];
  }, [skills]);

  // Filter skills by category & search query
  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    return skills
      .filter(skill => {
        const cat = skill.category || 'Other';
        const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
        const matchesSearch =
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.proficiency - a.proficiency); // Order by proficiency (strongest first)
  }, [skills, selectedCategory, searchQuery]);

  // Get dynamic visual properties for progress tiers
  const getProficiencyTier = (val) => {
    if (val >= 90) return { label: 'Expert', classes: 'bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.1)]' };
    if (val >= 75) return { label: 'Advanced', classes: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.1)]' };
    if (val >= 60) return { label: 'Intermediate', classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' };
    return { label: 'Familiar', classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  };

  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Info */}
      <FadeIn className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          <TextReveal text="Skills Matrix" />
        </h2>
        <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm md:text-base">
          A dynamic breakdown of my technical proficiencies and area expertise, sorted dynamically.
        </p>
      </FadeIn>

      {skills.length === 0 ? (
        <div className="text-center py-12 text-slate-500 relative z-10">
          No skills added yet. Click Admin Panel to add skills.
        </div>
      ) : (
        <div className="relative z-10 space-y-10">
          
          {/* Bento-style Stats Dashboard widget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="glass p-5 rounded-2xl flex items-center gap-4 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary-color)] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0" style={{ color: 'var(--primary-color)' }}>
                <Cpu size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{totalCount}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Technologies</div>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center gap-4 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary-color)] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0" style={{ color: 'var(--primary-color)' }}>
                <Trophy size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{averageProficiency}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average Strength</div>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center gap-4 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--primary-color)] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0" style={{ color: 'var(--primary-color)' }}>
                <Award size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-xl md:text-2xl font-black text-white leading-tight truncate">{bestCategory}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Domain</div>
              </div>
            </div>
          </div>

          {/* Interactive Filtering Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-5xl mx-auto bg-slate-900/35 border border-white/5 rounded-2xl p-4">
            
            {/* Tabs Filter */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all relative whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedCategory === cat && (
                    <motion.span
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                      style={{ 
                        borderColor: 'color-mix(in srgb, var(--primary-color) 40%, rgba(255, 255, 255, 0.05))',
                        boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3)`
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search stack..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]/25 focus:outline-none focus:ring-2 rounded-xl text-xs font-semibold text-white transition-all placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer transition-colors text-sm"
                >
                  &times;
                </button>
              )}
            </div>

          </div>

          {/* Cards Grid */}
          {filteredSkills.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm max-w-5xl mx-auto">
              No matching technologies found.
            </div>
          ) : (
            <motion.div 
              layout={animationsEnabled}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => {
                  const tier = getProficiencyTier(skill.proficiency);
                  return (
                    <motion.div
                      key={skill.id}
                      layout={animationsEnabled}
                      initial={animationsEnabled ? { opacity: 0, scale: 0.9 } : false}
                      animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
                      exit={animationsEnabled ? { opacity: 0, scale: 0.9 } : false}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <TiltCard
                        maxRotation={8}
                        className="glass p-5 rounded-2xl flex items-center gap-5 border border-white/5 relative group preserve-3d overflow-hidden"
                      >
                        {/* Cursor Tracking Glow Aura */}
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--primary-color) 12%, transparent) 0%, transparent 60%)`,
                            zIndex: 1
                          }}
                        />

                        {/* Circular Radial Gauge */}
                        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center z-10 preserve-3d" style={{ transform: 'translateZ(30px)' }}>
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              className="stroke-slate-800/40"
                              strokeWidth="3.5"
                              fill="transparent"
                            />
                            <motion.circle
                              cx="32"
                              cy="32"
                              r="26"
                              className="stroke-[var(--primary-color)]"
                              strokeWidth="3.5"
                              fill="transparent"
                              strokeDasharray="163.4"
                              initial={{ strokeDashoffset: 163.4 }}
                              whileInView={{ strokeDashoffset: 163.4 * (1 - skill.proficiency / 100) }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                              strokeLinecap="round"
                              style={{ 
                                filter: 'drop-shadow(0 0 6px var(--primary-color))',
                              }}
                            />
                          </svg>

                          {/* Skill Icon Centered */}
                          <div className="absolute w-8 h-8 flex items-center justify-center text-slate-300">
                            {skill.icon_svg ? (
                              <div 
                                className="w-full h-full flex items-center justify-center svg-icon-container" 
                                dangerouslySetInnerHTML={{ __html: skill.icon_svg }}
                                style={{ color: 'var(--primary-color)' }}
                              />
                            ) : (
                              <Cpu size={18} style={{ color: 'var(--primary-color)' }} />
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-grow min-w-0 z-10 preserve-3d" style={{ transform: 'translateZ(20px)' }}>
                          <div className="flex flex-col mb-1.5">
                            <h4 className="font-extrabold text-white text-sm md:text-base tracking-tight truncate leading-tight">
                              {skill.name}
                            </h4>
                            <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">
                              {skill.category || 'Other'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${tier.classes}`}>
                              {tier.label}
                            </span>
                            <span className="text-[11px] font-black text-slate-400 ml-auto">
                              {skill.proficiency}%
                            </span>
                          </div>
                        </div>

                      </TiltCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      )}
    </section>
  );
}
