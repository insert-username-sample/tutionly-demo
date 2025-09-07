'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingElementProps {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  delay?: number;
  opacity?: number;
  className?: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  size = 'md',
  position = 'center',
  delay = 0,
  opacity = 0.1,
  className = '',
}) => {
  const { isDark } = useTheme();
  
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };
  
  const positions = {
    'top-left': 'top-20 left-20',
    'top-right': 'top-20 right-20',
    'bottom-left': 'bottom-20 left-20',
    'bottom-right': 'bottom-20 right-20',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      className={`absolute ${sizes[size]} ${positions[position]} pointer-events-none ${className}`}
      style={{ opacity }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    >
      {children || (
        <div 
          className={`w-full h-full rounded-full ${
            isDark 
              ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20' 
              : 'bg-gradient-to-br from-blue-200/30 to-purple-200/30'
          }`}
        />
      )}
    </motion.div>
  );
};

export default FloatingElement;