'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useLogo, useTheme } from '@/contexts/ThemeContext';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { logoSrc, logoAlt } = useLogo();
  const { isDark } = useTheme();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Demo', href: '/demo' },
      { label: 'API', href: '/api' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/tuitionly', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/tuitionly', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/tuitionly', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@tuitionly.com', label: 'Email' },
  ];

  return (
    <footer className={`py-16 transition-all duration-300 ${className}`} style={{ 
      backgroundColor: isDark ? 'var(--dark-bg)' : 'var(--light-card)' 
    }}>
      <div className="max-w-7xl mx-auto px-6 xl:px-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="inline-block mb-4">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              
              <p className="text-base mb-6 max-w-md leading-relaxed" style={{
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'
              }}>
                AI-powered personalized tutoring that adapts to your unique learning style. 
                Because every student learns differently.
              </p>
              
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-gradient-primary transition-all duration-300 group ${
                        isDark ? 'glass-dark' : 'glass-light'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      aria-label={social.label}
                    >
                      <Icon size={18} className={`transition-colors group-hover:text-white ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
          
          {/* Link Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4 capitalize" style={{
                color: isDark ? 'var(--dark-text-primary)' : 'var(--light-text-primary)'
              }}>
                {category}
              </h3>
              
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-base transition-colors duration-300 hover:text-gradient"
                      style={{
                        color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t"
          style={{ borderColor: isDark ? 'var(--dark-border)' : 'var(--light-border)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-base mb-4 md:mb-0" style={{
            color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'
          }}>
            © 2025 Tuitionly. All rights reserved. Built with ❤️ for personalized learning.
          </p>
          
          <div className="flex items-center gap-6 text-sm" style={{
            color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'
          }}>
            <Link href="/privacy" className="hover:text-gradient transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gradient transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-gradient transition-colors">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;