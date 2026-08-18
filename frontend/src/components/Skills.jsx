import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer } from './MotionProvider';
import { Cpu } from 'lucide-react';
import TiltCard from './TiltCard';
import TextReveal from './TextReveal';

export default function Skills({ skills }) {
  // Group skills by category dynamically
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          <TextReveal text="Skills Matrix" />
        </h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto">
          A dynamic breakdown of my technical proficiencies and area expertise.
        </p>
      </FadeIn>

      {skills.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No skills added yet. Click Admin Panel to add skills.
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category}>
              <FadeIn className="mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-white border-l-4 pl-3 flex items-center gap-2.5"
                  style={{ borderColor: 'var(--primary-color)' }}>
                  {category}
                </h3>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((skill) => (
                  <TiltCard
                    key={skill.id}
                    maxRotation={10}
                    className="glass p-5 rounded-2xl flex items-center gap-4 border border-white/5 relative group preserve-3d"
                  >
                    {/* SVG Icon Container - Floating Parallax */}
                    <div 
                      className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 text-slate-300 overflow-hidden p-2.5 transition-transform duration-300 group-hover:scale-105 shadow-lg"
                      style={{ 
                        color: 'var(--primary-color)',
                        transform: 'translateZ(30px)' 
                      }}
                    >
                      {skill.icon_svg ? (
                        <div 
                          className="w-full h-full flex items-center justify-center svg-icon-container" 
                          dangerouslySetInnerHTML={{ __html: skill.icon_svg }}
                        />
                      ) : (
                        <Cpu size={22} />
                      )}
                    </div>

                    {/* Skill Info - Floating Parallax */}
                    <div className="flex-grow translate-z-20 preserve-3d" style={{ transform: 'translateZ(20px)' }}>
                      <div className="flex justify-between items-center mb-2" style={{ transform: 'translateZ(10px)' }}>
                        <span className="font-semibold text-white text-sm md:text-base">{skill.name}</span>
                        <span className="text-xs font-bold text-slate-400">{skill.proficiency}%</span>
                      </div>
                      
                      {/* Viewport-Loaded Progress Bar */}
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden" style={{ transform: 'translateZ(15px)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true, margin: '-20px' }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                          className="h-full rounded-full glow-progress-fill"
                        />
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
