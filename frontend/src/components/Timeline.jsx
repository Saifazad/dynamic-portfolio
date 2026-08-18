import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FadeIn, StaggerContainer } from './MotionProvider';
import { Briefcase, GraduationCap, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import TextReveal from './TextReveal';

// Sub-component to manage interactive expandable details on timeline item cards
function TimelineCard({ item, isExperience }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="glass p-6 rounded-2xl relative transition-all hover:border-white/10 group cursor-pointer select-none"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors">
            {isExperience ? item.role : item.degree}
          </h4>
          <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--primary-color)' }}>
            {isExperience ? item.company : item.institution}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/5 text-slate-300 self-start sm:self-center">
          <Calendar size={12} />
          {isExperience ? item.duration : `${item.start_year} - ${item.end_year}`}
        </div>
      </div>
      
      {/* Dynamic Collapsible Container with 3D folding perspective */}
      <div style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
        <motion.div
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : '36px', 
            opacity: isOpen ? 1 : 0.65,
            rotateX: isOpen ? 0 : -8,
            y: isOpen ? 0 : -2
          }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          style={{ transformOrigin: "top", transformStyle: 'preserve-3d' }}
          className="overflow-hidden relative"
        >
          {isExperience ? (
            <ul className="space-y-3 pt-1">
              {item.achievements_array && item.achievements_array.map((achievement, actIdx) => (
                <li key={actIdx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 bg-indigo-400 flex-shrink-0" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          ) : (
            item.description && (
              <p className="text-sm text-slate-300 leading-relaxed pt-1 whitespace-pre-wrap">
                {item.description}
              </p>
            )
          )}
          
          {/* Subtle blur fade overlay for collapsed state */}
          {!isOpen && (
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
          )}
        </motion.div>
      </div>
      
      {/* Collapse indicators */}
      <div className="mt-3.5 flex justify-end items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors">
        <span>{isOpen ? 'Collapse Details' : 'Expand Details'}</span>
        {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </div>
    </div>
  );
}

export default function Timeline({ education, experience }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // useScroll offsets map section entries to target connection lines
  const { scrollYProgress: leftProgress } = useScroll({
    target: leftRef,
    offset: ["start 65%", "end 65%"]
  });
  const { scrollYProgress: rightProgress } = useScroll({
    target: rightRef,
    offset: ["start 65%", "end 65%"]
  });

  // Spring animations to interpolate active timeline fills
  const leftScaleY = useSpring(leftProgress, { stiffness: 90, damping: 20 });
  const rightScaleY = useSpring(rightProgress, { stiffness: 90, damping: 20 });

  return (
    <section id="timeline" className="py-24 px-6 max-w-7xl mx-auto bg-slate-900/30">
      <FadeIn className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          <TextReveal text="My Journey" />
        </h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto">
          An overview of my academic credentials and professional work milestones.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column: Work Experience */}
        <div ref={leftRef} className="relative">
          <FadeIn className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-indigo-500/10 rounded-xl" style={{ color: 'var(--primary-color)' }}>
              <Briefcase size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Work Experience</h3>
          </FadeIn>

          {/* Dotted static vertical track line */}
          <div className="absolute left-[19px] top-[76px] bottom-6 w-[2px] bg-white/5 pointer-events-none rounded-full z-0" />
          {/* Active scroll overlay line */}
          <motion.div 
            className="absolute left-[19px] top-[76px] bottom-6 w-[2px] pointer-events-none rounded-full origin-top z-10 overflow-hidden"
            style={{ 
              scaleY: leftScaleY,
              backgroundColor: 'var(--primary-color)',
              boxShadow: `0 0 10px var(--primary-color)`
            }}
          >
            <div className="w-full h-1/3 absolute top-0 bg-gradient-to-b from-transparent via-white to-transparent timeline-beam" />
          </motion.div>

          <StaggerContainer className="flex flex-col relative z-20">
            {experience.length === 0 ? (
              <div className="text-slate-500 py-6 pl-10">No experience history added yet.</div>
            ) : (
              experience.map((item, idx) => (
                <FadeIn key={item.id || idx} className="relative pl-12 pb-12 last:pb-0">
                  {/* Timeline Dot Indicator with 3D hover spin */}
                  <motion.div 
                    whileHover={{ rotateY: 180, scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute left-0 top-1.5 w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer select-none"
                    style={{ zIndex: 30 }}
                  >
                    <Briefcase size={16} />
                  </motion.div>

                  <TimelineCard item={item} isExperience={true} />
                </FadeIn>
              ))
            )}
          </StaggerContainer>
        </div>

        {/* Right Column: Education */}
        <div ref={rightRef} className="relative">
          <FadeIn className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-indigo-500/10 rounded-xl" style={{ color: 'var(--primary-color)' }}>
              <GraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Education</h3>
          </FadeIn>

          {/* Dotted static vertical track line */}
          <div className="absolute left-[19px] top-[76px] bottom-6 w-[2px] bg-white/5 pointer-events-none rounded-full z-0" />
          {/* Active scroll overlay line */}
          <motion.div 
            className="absolute left-[19px] top-[76px] bottom-6 w-[2px] pointer-events-none rounded-full origin-top z-10 overflow-hidden"
            style={{ 
              scaleY: rightScaleY,
              backgroundColor: 'var(--primary-color)',
              boxShadow: `0 0 10px var(--primary-color)`
            }}
          >
            <div className="w-full h-1/3 absolute top-0 bg-gradient-to-b from-transparent via-white to-transparent timeline-beam" />
          </motion.div>

          <StaggerContainer className="flex flex-col relative z-20">
            {education.length === 0 ? (
              <div className="text-slate-500 py-6 pl-10">No education history added yet.</div>
            ) : (
              education.map((item, idx) => (
                <FadeIn key={item.id || idx} className="relative pl-12 pb-12 last:pb-0">
                  {/* Timeline Dot Indicator with 3D hover spin */}
                  <motion.div 
                    whileHover={{ rotateY: 180, scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute left-0 top-1.5 w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer select-none"
                    style={{ zIndex: 30 }}
                  >
                    <GraduationCap size={16} />
                  </motion.div>

                  <TimelineCard item={item} isExperience={false} />
                </FadeIn>
              ))
            )}
          </StaggerContainer>
        </div>

      </div>
    </section>
  );
}
