import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const { theme } = useTheme();
  
  const [cursorType, setCursorType] = useState('default'); // 'default', 'hover', 'view'
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Buttery-smooth spring values (fast stiffness, medium damping)
  const cursorSpringX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const cursorSpringY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    if (!theme.enable_animations) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const customCursorEl = target.closest('[data-cursor]');
      const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea');

      if (customCursorEl) {
        const type = customCursorEl.getAttribute('data-cursor');
        setCursorType(type);
      } else if (interactiveEl) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [theme.enable_animations, isVisible]);

  if (!theme.enable_animations || !isVisible) return null;

  // Custom styling settings for the morphing cursor
  const variants = {
    default: {
      width: 10,
      height: 10,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '0px solid transparent'
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.7)'
    },
    view: {
      width: 72,
      height: 72,
      backgroundColor: 'var(--primary-color)',
      border: '0px solid transparent',
      boxShadow: '0 0 20px var(--primary-color)'
    }
  };

  const currentStyle = variants[cursorType] || variants.default;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
      style={{
        x: cursorSpringX,
        y: cursorSpringY,
        mixBlendMode: cursorType === 'view' ? 'normal' : 'difference',
        ...currentStyle
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {cursorType === 'view' && (
        <span className="text-[10px] font-black tracking-widest text-slate-950 uppercase animate-pulse">
          View
        </span>
      )}
    </motion.div>
  );
}
