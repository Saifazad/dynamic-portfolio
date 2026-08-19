import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, HoverCard, StaggerContainer } from './MotionProvider';
import { ExternalLink, Github, X, Eye, Grid, List } from 'lucide-react';
import TiltCard from './TiltCard';
import TextReveal from './TextReveal';

import { BACKEND_URL } from '../config';

export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'metrics'
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getProjImage = (imgUrl, fallback) => {
    if (!imgUrl) return fallback;
    if (imgUrl.startsWith('/uploads')) {
      return `${BACKEND_URL}${imgUrl}`;
    }
    return imgUrl;
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };


  // Dynamically extract the top 5 most common tech stack tags for filtering
  const categories = useMemo(() => {
    const tagCounts = {};
    projects.forEach(p => {
      if (p.tech_stack) {
        p.tech_stack.forEach(tech => {
          tagCounts[tech] = (tagCounts[tech] || 0) + 1;
        });
      }
    });
    
    // Sort tech stack by popularity
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    return ['All', ...sortedTags.slice(0, 5)];
  }, [projects]);

  // Filter projects by active category selection
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      return activeFilter === 'All' || (p.tech_stack && p.tech_stack.includes(activeFilter));
    });
  }, [projects, activeFilter]);



  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          <TextReveal text="Featured Work" />
        </h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto">
          A showcase of recent development projects, web applications, and experimentations.
        </p>
      </FadeIn>

      {/* Category Tags & Layout Toggles */}
      {projects.length > 0 && (
        <FadeIn delay={0.15} className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 max-w-5xl mx-auto">
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                  activeFilter === cat
                    ? 'text-white border-transparent shadow-lg'
                    : 'text-slate-400 border-white/5 bg-white/5 hover:text-white hover:border-white/10'
                }`}
                style={activeFilter === cat ? { 
                  backgroundColor: 'var(--primary-color)',
                  boxShadow: `0 4px 15px -3px var(--primary-color)`
                } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid/List Switcher */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full p-1 select-none">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-2 rounded-full cursor-pointer transition-all ${
                layoutMode === 'grid' ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-2 rounded-full cursor-pointer transition-all ${
                layoutMode === 'list' ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </FadeIn>
      )}

      {/* Projects Display Wrapper */}
      {layoutMode === 'grid' ? (
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 text-center text-slate-500 text-sm font-semibold"
              >
                No projects matching "{activeFilter}" found.
              </motion.div>
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className="h-full"
                >
                  <TiltCard 
                    data-cursor="view"
                    className="glass rounded-2xl overflow-hidden flex flex-col h-full relative group hover:border-white/10 preserve-3d cursor-none"
                  >
                    <div className="relative overflow-hidden aspect-video bg-slate-850 z-10 translate-z-20 preserve-3d">
                      <img
                        src={getProjImage(project.image_url, 'https://picsum.photos/600/400?random=' + project.id)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                        <button
                          onClick={() => { setSelectedProject(project); setActiveTab('overview'); }}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-transform hover:scale-110"
                            title="Live Demo"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow relative z-10 translate-z-30 preserve-3d">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 translate-z-40">{project.title}</h3>
                      <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow translate-z-10">
                        {project.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 mb-6 translate-z-20">
                        {project.tech_stack && project.tech_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-md font-medium bg-white/5 border border-white/5 text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto translate-z-30">
                        <button
                          onClick={() => { setSelectedProject(project); setActiveTab('overview'); }}
                          className="text-sm font-semibold hover:underline cursor-pointer flex items-center gap-1.5"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          Details & Links
                        </button>
                        <div className="flex items-center gap-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-white transition-colors"
                              title="GitHub Repo"
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-white transition-colors"
                              title="Live Site"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* List View with Floating Cursor Preview */
        <div 
          onMouseMove={handleMouseMove}
          className="relative flex flex-col divide-y divide-white/5 border-t border-b border-white/5 max-w-5xl mx-auto z-10 select-none"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm font-semibold">
                No projects matching "{activeFilter}" found.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => { setSelectedProject(project); setActiveTab('overview'); }}
                  className="flex items-center justify-between py-8 px-6 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span 
                      className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase border border-slate-700/40 rounded px-2 py-0.5"
                    >
                      {project.tech_stack ? project.tech_stack[0] : 'DEV'}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-300 transition-colors group-hover:text-white group-hover:translate-x-2 duration-300">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    {project.tech_stack && (
                      <div className="hidden md:flex gap-1.5">
                        {project.tech_stack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 rounded font-mono bg-white/5 border border-white/5 text-slate-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <span 
                      className="p-2.5 rounded-full bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all duration-300"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      <Eye size={16} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </AnimatePresence>

          {/* Floating Image Preview follow container */}
          <AnimatePresence>
            {hoveredProject && (
              <motion.div
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.82, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="fixed pointer-events-none z-50 overflow-hidden w-64 aspect-video rounded-2xl border border-white/15 shadow-2xl -translate-x-1/2 -translate-y-1/2 bg-slate-900"
                style={{
                  left: mousePos.x + 20,
                  top: mousePos.y + 20,
                }}
              >
                <img 
                  src={getProjImage(hoveredProject.image_url, 'https://picsum.photos/600/400?random=' + hoveredProject.id)} 
                  alt={hoveredProject.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}


      {/* Project Detail Modal Overlay (Smooth Spring AnimatePresence) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors z-20 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto flex-grow">
                <div className="aspect-video w-full bg-slate-950 relative">
                  <img
                    src={getProjImage(selectedProject.image_url, 'https://picsum.photos/800/500?random=' + selectedProject.id)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-3xl font-extrabold text-white mb-2">{selectedProject.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tech_stack && selectedProject.tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md font-medium bg-white/5 border border-white/5 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Tabs Control Row */}
                  <div className="flex border-b border-white/5 mb-6 select-none">
                    {[
                      { id: 'overview', name: 'Overview' },
                      { id: 'architecture', name: 'Architecture' },
                      { id: 'metrics', name: 'Key Metrics' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-white'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                        style={activeTab === tab.id ? { borderBottomColor: 'var(--primary-color)' } : {}}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">About The Project</h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedProject.description}
                      </p>
                    </div>
                  )}

                  {activeTab === 'architecture' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h5 className="font-bold text-white text-sm mb-1">Obstacles & Resolution</h5>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Optimizing dynamic state handling and query resolution latency overlays under strict performance parameters. Managed atomic component re-render schedules and garbage collections in local loops.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h5 className="font-bold text-white text-sm mb-1">Architectural Design</h5>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Constructed as a decoupled React client backed by a lightweight Express server node communicating through a relational database schema interface.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'metrics' && (
                    <div className="grid grid-cols-2 gap-4 select-none">
                      <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-3xl font-black block text-indigo-400" style={{ color: 'var(--primary-color)' }}>+40%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Performance Gain</span>
                      </div>
                      <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-3xl font-black block text-indigo-400" style={{ color: 'var(--primary-color)' }}>99.9%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Operational Uptime</span>
                      </div>
                      <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-3xl font-black block text-indigo-400" style={{ color: 'var(--primary-color)' }}>-60%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Latency Reduction</span>
                      </div>
                      <div className="p-5 rounded-xl bg-white/5 border border-white/5 text-center">
                        <span className="text-3xl font-black block text-indigo-400" style={{ color: 'var(--primary-color)' }}>SEO 100</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Lighthouse Rating</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-6 mt-8 border-t border-white/5">

                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-white"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                      >
                        <ExternalLink size={18} />
                        Live Demo
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] py-3.5 px-6 rounded-xl font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white"
                      >
                        <Github size={18} />
                        GitHub Repository
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
