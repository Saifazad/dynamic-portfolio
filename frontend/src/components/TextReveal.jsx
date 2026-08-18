import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function TextReveal({ text, className = '' }) {
  const { theme } = useTheme();

  if (!theme.enable_animations) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: '70%',
      rotate: 2
    },
    show: {
      opacity: 1,
      y: '0%',
      rotate: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] // Cinematic smooth easeOutQuart
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-25px' }}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="overflow-hidden inline-block mr-[0.22em] pb-[0.05em]">
          <motion.span
            variants={wordVariants}
            className="inline-block origin-bottom-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
