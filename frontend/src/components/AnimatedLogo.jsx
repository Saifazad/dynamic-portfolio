import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedLogo({ onClick }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const roles = ['Flutter', 'React', 'Full-Stack', 'Node.js'];

  // Automatically cycle through roles every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-3 cursor-pointer select-none text-left group bg-transparent border-none p-0 outline-none"
      title="Saif Ali - Portfolio Home"
    >
      {/* Animated Glowing Code Monogram Badge */}
      <motion.div
        className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center overflow-hidden shadow-lg"
        animate={{
          boxShadow: isHovered
            ? '0 0 20px var(--primary-color)'
            : '0 4px 12px rgba(0,0,0,0.4)'
        }}
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {/* Shimmer sweep effect */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 1 }}
        />

        {/* Monogram Symbol */}
        <div className="flex items-center font-mono font-black text-xs tracking-tighter">
          <motion.span
            animate={{ x: isHovered ? -2 : 0 }}
            className="transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            &lt;
          </motion.span>
          <span className="text-white font-black text-sm tracking-normal mx-0.5">S</span>
          <motion.span
            animate={{ x: isHovered ? 2 : 0 }}
            className="transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            /&gt;
          </motion.span>
        </div>
      </motion.div>

      {/* Name and Animated Cycling Tech Tag */}
      <div className="flex flex-col items-start leading-none">
        <div className="flex items-center gap-1.5">
          <span className="text-base md:text-lg font-black tracking-tight text-white group-hover:text-white transition-colors flex items-center">
            Saif
            <span className="text-slate-300 font-bold ml-1">Ali</span>
          </span>

          {/* Pulsing Live Beacon Indicator */}
          <span className="relative flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Dynamic Morphing Tagline */}
        <div className="h-3.5 overflow-hidden flex items-center mt-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={roles[roleIndex]}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="text-[9px] font-extrabold uppercase tracking-widest"
              style={{ color: 'var(--primary-color)' }}
            >
              {roles[roleIndex]} Dev
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </button>
  );
}
