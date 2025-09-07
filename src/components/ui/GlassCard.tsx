'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradientBorder?: boolean;
  neonGlow?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  gradientBorder = false,
  neonGlow = false,
  onClick,
}) => {
  const { isDark } = useTheme();

  const baseClasses = `
    relative rounded-2xl transition-all duration-300
    ${isDark ? 'glass-dark' : 'glass-light'}
    ${hover ? (isDark ? 'hover:scale-105 hover:shadow-2xl' : 'hover:scale-105 hover:shadow-2xl light-border-glow') : ''}
    ${gradientBorder ? (isDark ? 'gradient-border' : 'light-gradient-border') : ''}
    ${neonGlow && isDark ? 'neon-glow' : ''}
    ${!isDark ? 'light-highlight' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick,
  } : {};

  return (
    <CardComponent
      className={`${baseClasses} ${className}`}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};

export default GlassCard;