'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomePage() {
  const { isDark } = useTheme();
  
  const handleTryDemo = () => {
    // Navigate to demo page
    window.location.href = '/demo';
  };

  const handleJoinWaitlist = () => {
    // Open waitlist modal or navigate to waitlist page
    window.location.href = '/waitlist';
  };

  return (
    <main 
      className="min-h-screen transition-all duration-300" 
      style={{ 
        backgroundColor: isDark ? 'var(--dark-bg)' : 'var(--light-bg)'
      }}
    >
      <Navigation />
      <HeroSection 
        onTryDemo={handleTryDemo}
        onJoinWaitlist={handleJoinWaitlist}
      />
      <Footer />
    </main>
  );
}


