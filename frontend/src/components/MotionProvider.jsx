import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * Custom motion wrappers that respect site_config.enable_animations
 */

// Stagger parent container for list items
export const StaggerContainer = ({ children, className = '', delay = 0.05, ...props }) => {
  const { theme } = useTheme();
  
  if (!theme.enable_animations) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-20px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: delay
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// FadeIn element wrapper
export const FadeIn = ({ children, className = '', duration = 0.6, delay = 0, y = 20, ...props }) => {
  const { theme } = useTheme();

  if (!theme.enable_animations) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // Custom smooth easeOutQuart
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// SlideUp and scale wrapper (great for cards)
export const HoverCard = ({ children, className = '', ...props }) => {
  const { theme } = useTheme();

  if (!theme.enable_animations) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ScaleIn element wrapper (great for circular progress or images)
export const ScaleIn = ({ children, className = '', duration = 0.5, delay = 0, ...props }) => {
  const { theme } = useTheme();

  if (!theme.enable_animations) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.34, 1.56, 0.64, 1] // Playful backOut springy ease
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
