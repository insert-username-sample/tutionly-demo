'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import FloatingElement from '@/components/ui/FloatingElement';
import { useTheme } from '@/contexts/ThemeContext';

interface HeroSectionProps {
  onTryDemo?: () => void;
  onJoinWaitlist?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onTryDemo,
  onJoinWaitlist,
}) => {
  const { isDark } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <FloatingElement size="lg" position="top-left" delay={0} opacity={isDark ? 0.1 : 0.2} color={isDark ? 'white' : 'blue'} />
      <FloatingElement size="md" position="top-right" delay={1} opacity={isDark ? 0.08 : 0.15} color={isDark ? 'white' : 'purple'} />
      <FloatingElement size="xl" position="bottom-left" delay={2} opacity={isDark ? 0.06 : 0.1} color={isDark ? 'white' : 'green'} />
      <FloatingElement size="sm" position="bottom-right" delay={0.5} opacity={isDark ? 0.12 : 0.25} color={isDark ? 'white' : 'pink'} />
      
      <div className="max-w-7xl mx-auto px-6 xl:px-0 py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h1 className="text-hero font-bold leading-tight mb-8" style={{
              color: isDark ? 'var(--dark-text-primary)' : 'var(--light-text-primary)'
            }}>
              Because Every Student{' '}
              <span className="text-gradient">
                Learns Differently.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12 font-body" style={{
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'
            }}>
              Tuitionly adapts to your unique learning style — memory type, pace, and preferences — 
              so you can study smarter, not harder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onTryDemo}
                icon={<Play size={24} />}
                className="shadow-xl"
              >
                Try the Demo
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={onJoinWaitlist}
              >
                Join the Waitlist
              </Button>
            </div>
          </motion.div>
          
          {/* Right Content - Tutor Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              animate={{ rotate: [1, -1, 1] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <GlassCard 
                className={`p-8 transform ${isDark ? 'neon-glow' : 'light-glow animate-light-pulse'}`} 
                gradientBorder={true}
                neonGlow={isDark}
              >
                <div className="bg-gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
                  {/* Animated background pattern */}
                  <FloatingElement size="md" position="top-right" delay={0} opacity={0.2}>
                    <div className="w-full h-full bg-white/20 rounded-full" />
                  </FloatingElement>
                  <FloatingElement size="sm" position="bottom-left" delay={1} opacity={0.15}>
                    <div className="w-full h-full bg-white/10 rounded-full" />
                  </FloatingElement>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BookOpen size={24} />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-lg">Math Tutorly</h3>
                        <p className="text-sm opacity-90">AI Math Tutor</p>
                      </div>
                    </div>
                    
                    <motion.p 
                      className="text-base opacity-95 leading-relaxed mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                    >
                      "I notice you learn better with visual examples. Let me show you this algebra problem using shapes and interactive diagrams..."
                    </motion.p>
                    
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
