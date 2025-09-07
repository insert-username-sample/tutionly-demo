'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-12 h-12 rounded-2xl glass backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl group ${
        isDark ? 'glass-dark neon-border' : 'glass-light'
      } ${className}`}
      aria-label="Toggle theme"
    >
      {/* Background gradient on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        whileHover={{ opacity: 0.1 }}
      />
      
      {/* Sun icon */}
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun size={20} className="text-yellow-500" />
      </motion.div>
      
      {/* Moon icon */}
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon size={20} className="text-blue-400" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;