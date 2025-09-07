'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLogo, useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { logoSrc, logoAlt } = useLogo();
  const { isDark } = useTheme();

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-lg border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 xl:px-0 py-4 ${className}`}>
        {/* Logo */}
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </motion.div>
      
      {/* Navigation Items & Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-8"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-base font-medium transition-colors duration-300 hover:text-gradient"
                style={{
                  color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
                }}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Sign In
          </Button>
        </div>
      </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;
