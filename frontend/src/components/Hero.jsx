import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FadeIn } from './MotionProvider';
import { ArrowRight, Github, FileText } from 'lucide-react';
import { BACKEND_URL } from '../config';


// Lightweight 3D Constellation Sphere with Elastic Spring Physics and cursor repulsion
function ThreeDParticles() {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const particleCount = 130;
    const particles = [];
    const radius = Math.min(width, height) * 0.35;
    
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      particles.push({
        x: x,
        y: y,
        z: z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: 0,
        vy: 0,
        vz: 0
      });
    }
    
    let angleX = 0.0006;
    let angleY = 0.001;
    let mouse = { x: -1000, y: -1000 };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      
      // Slight base rotation based on cursor orientation
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      angleY = dx * 0.000004;
      angleX = dy * 0.000004;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const focalLength = 360;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Sort by depth (painter's algorithm)
      particles.sort((a, b) => b.z - a.z);
      
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#6366f1';
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Base orbit Y-axis rotation
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        let rx1 = p.x * cosY - p.z * sinY;
        let rz1 = p.z * cosY + p.x * sinY;
        
        // Base orbit X-axis rotation
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        let ry2 = p.y * cosX - rz1 * sinX;
        let rz2 = rz1 * cosX + p.y * sinX;
        
        // Target base rotation position
        p.baseX = rx1;
        p.baseY = ry2;
        p.baseZ = rz2;
        
        // Screen projection details
        const scale = focalLength / (focalLength + p.z + radius);
        const projX = p.x * scale + centerX;
        const projY = p.y * scale + centerY;
        
        // Cursor interaction logic (repel force in 2D projected space mapped to 3D adjustments)
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = projX - mouse.x;
          const dy = projY - mouse.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < 130) {
            const force = (130 - dist) / 130;
            const angle = Math.atan2(dy, dx);
            
            // Apply push impulse in 3D direction vector
            p.vx += Math.cos(angle) * force * 1.5;
            p.vy += Math.sin(angle) * force * 1.5;
            p.vz += (p.z > 0 ? 1 : -1) * force * 1.2;
          }
        }
        
        // Spring return to base coordinates
        const dxBase = p.baseX - p.x;
        const dyBase = p.baseY - p.y;
        const dzBase = p.baseZ - p.z;
        
        p.vx += dxBase * 0.035; // Spring stiffness
        p.vy += dyBase * 0.035;
        p.vz += dzBase * 0.035;
        
        // Friction / Damping
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.vz *= 0.86;
        
        // Apply movement velocity
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        
        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          const particleRadius = Math.max(0.6, scale * 3.8);
          const depthOpacity = ((p.z + radius) / (2 * radius)) * 0.7 + 0.15;
          
          ctx.beginPath();
          ctx.arc(projX, projY, particleRadius, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = depthOpacity * 0.5;
          ctx.fill();
          
          // Constellation linkages
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y, p.z - p2.z);
            if (dist < 80) {
              const scale2 = focalLength / (focalLength + p2.z + radius);
              const projX2 = p2.x * scale2 + centerX;
              const projY2 = p2.y * scale2 + centerY;
              
              ctx.beginPath();
              ctx.moveTo(projX, projY);
              ctx.lineTo(projX2, projY2);
              ctx.strokeStyle = primaryColor;
              ctx.globalAlpha = (1 - dist / 80) * 0.12 * Math.min(depthOpacity, scale2);
              ctx.lineWidth = 0.55;
              ctx.stroke();
            }
          }
        }
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" />;
}

export default function Hero({ onNavigateToProjects }) {
  const { theme } = useTheme();

  // Framer Motion inputs for 3D Card Hover Perspective
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  // Smooth springs to avoid rigid jumps on movement
  const rotateX = useSpring(useTransform(mY, [-0.5, 0.5], [20, -20]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mX, [-0.5, 0.5], [-20, 20]), { stiffness: 120, damping: 18 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Set CSS properties for the glare highlight overlay
    e.currentTarget.style.setProperty('--mouse-x', `${(mouseX / rect.width) * 100}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${(mouseY / rect.height) * 100}%`);

    mX.set((mouseX / rect.width) - 0.5);
    mY.set((mouseY / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    // Reset to center smoothly
    mX.set(0);
    mY.set(0);
  };

  // Split-gradient text formatter for high-end look
  const formatHeroTitle = (title) => {
    if (!title) return "Hi, I'm Saif. I Build Dynamic Applications.";
    const parts = title.split('.');
    if (parts.length > 1) {
      return (
        <>
          <span className="block text-slate-100 opacity-90">{parts[0].trim()}.</span>
          <span className="block mt-2 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, #ffffff, var(--primary-color), #a5b4fc)` }}>
            {parts.slice(1).join('.').trim()}
          </span>
        </>
      );
    }
    return title;
  };

  // Staggered Container Animation Settings
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const textItemVariants = {
    hidden: { y: 35, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15
      }
    }
  };

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center items-center px-6 py-24 overflow-hidden">

      {/* Dynamic 3D constellation animation */}
      <ThreeDParticles />

      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 text-left">
        
        {/* Left Side: Copywriting (Spring reveal animations) */}
        <motion.div 
          variants={titleContainerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <motion.div variants={textItemVariants}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border mb-6 bg-white/5 border-white/10" 
              style={{ color: 'var(--primary-color)', borderColor: 'rgba(255,255,255,0.08)' }}>
              Welcome to my space
            </span>
          </motion.div>

          <motion.div variants={textItemVariants}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 select-none">
              {formatHeroTitle(theme.hero_title)}
            </h1>
          </motion.div>

          <motion.div variants={textItemVariants}>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
              {theme.hero_subtitle}
            </p>
          </motion.div>

          {/* Dynamic Stats Grid */}
          <motion.div variants={textItemVariants} className="grid grid-cols-3 gap-4 max-w-lg mb-10 text-left">
            {theme.stat_1_num && (
              <div className="glass p-4 rounded-xl border border-white/5 backdrop-blur-md relative group hover:border-white/10 transition-colors">
                <span className="block text-xl md:text-2xl font-black" style={{ color: 'var(--primary-color)' }}>
                  {theme.stat_1_num}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 whitespace-nowrap">
                  {theme.stat_1_lbl}
                </span>
              </div>
            )}
            {theme.stat_2_num && (
              <div className="glass p-4 rounded-xl border border-white/5 backdrop-blur-md relative group hover:border-white/10 transition-colors">
                <span className="block text-xl md:text-2xl font-black" style={{ color: 'var(--primary-color)' }}>
                  {theme.stat_2_num}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 whitespace-nowrap">
                  {theme.stat_2_lbl}
                </span>
              </div>
            )}
            {theme.stat_3_num && (
              <div className="glass p-4 rounded-xl border border-white/5 backdrop-blur-md relative group hover:border-white/10 transition-colors">
                <span className="block text-xl md:text-2xl font-black" style={{ color: 'var(--primary-color)' }}>
                  {theme.stat_3_num}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 whitespace-nowrap">
                  {theme.stat_3_lbl}
                </span>
              </div>
            )}
          </motion.div>

          <motion.div variants={textItemVariants} className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={onNavigateToProjects}
              className="group px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer text-white hover:brightness-110"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                boxShadow: `0 10px 30px -10px var(--primary-color)`
              }}
            >
              View Projects
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            
            <a
              href={theme.resume_url || "/resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              download={theme.resume_url ? undefined : "Saif_Ali_Resume.pdf"}
              className="px-8 py-4 rounded-xl font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-white"
            >
              <FileText size={18} />
              Download CV
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Interactive Card */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <FadeIn delay={0.3} className="w-full max-w-[360px] aspect-[4/5] relative">
            
            <motion.div
              style={{ 
                rotateX, 
                rotateY, 
                transformStyle: 'preserve-3d',
                boxShadow: `0 0 50px -15px var(--primary-color)`
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-3xl p-4 bg-gradient-to-br from-white/12 to-white/5 border border-white/10 cursor-pointer overflow-visible group transition-all duration-300 hover:border-white/20 interactive-hover"
            >
              {/* Floating Parallax Badge 1 */}
              <div 
                className="absolute top-8 -left-8 px-4 py-2 rounded-2xl bg-slate-900/85 border border-white/10 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-xl select-none"
                style={{ transform: 'translateZ(70px)' }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {theme.profile_tag_1 || 'React'}
              </div>

              {/* Floating Parallax Badge 2 */}
              <div 
                className="absolute bottom-16 -right-10 px-4 py-2 rounded-2xl bg-slate-900/85 border border-white/10 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-xl select-none"
                style={{ transform: 'translateZ(95px)' }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                {theme.profile_tag_2 || 'Node.js'}
              </div>

              {/* Floating Parallax Badge 3 */}
              <div 
                className="absolute -top-6 right-8 px-4 py-2 rounded-2xl bg-slate-900/85 border border-white/10 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-xl select-none"
                style={{ transform: 'translateZ(50px)' }}
              >
                <span className="text-yellow-400">⚡</span> {theme.profile_tag_3 || 'Full-Stack'}
              </div>

              {/* Floating Parallax Badge 4 */}
              <div 
                className="absolute bottom-24 -left-10 px-4 py-2 rounded-2xl bg-slate-900/85 border border-white/10 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-xl select-none"
                style={{ transform: 'translateZ(80px)' }}
              >
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                {theme.profile_tag_4 || 'Supabase'}
              </div>

              {/* Image Frame */}
              <div 
                className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900 border border-white/5"
                style={{ transform: 'translateZ(30px)' }}
              >
                <img 
                  src={theme.profile_image_url ? (theme.profile_image_url.startsWith('/uploads') ? `${BACKEND_URL}${theme.profile_image_url}` : theme.profile_image_url) : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"} 
                  alt="Profile" 
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating dynamic backdrop shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10" />
                
                {/* Inner information label */}
                <div 
                  className="absolute bottom-6 left-6 right-6 z-20 transition-all duration-300 group-hover:translate-y-[-2px]"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <p className="text-white text-xl font-bold tracking-wide">
                    {theme.hero_title ? theme.hero_title.split(' ')[2]?.replace(/[.,]/g, '') || 'Creative Dev' : 'Saif'}
                  </p>
                  <span className="text-xs uppercase tracking-widest font-bold mt-1.5 inline-block" style={{ color: 'var(--primary-color)' }}>
                    Available for Work
                  </span>
                </div>
              </div>

              {/* Dynamic glare shine overlay */}
              <motion.div 
                className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, transparent 65%)`,
                }}
              />
            </motion.div>
          </FadeIn>
        </div>
      </div>

      {/* Decorative mouse indicator */}
      <FadeIn delay={0.6} y={10} className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs tracking-widest uppercase">Scroll Down</span>
          <div className="w-[20px] h-[36px] border-2 border-slate-600 rounded-full flex justify-center p-1">
            <div className="w-[4px] h-[8px] bg-slate-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
