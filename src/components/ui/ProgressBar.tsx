'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        {animated ? (
          <motion.div
            className="bg-gradient-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: animated ? 1.5 : 0,
              ease: "easeInOut",
            }}
          />
        ) : (
          <div 
            className="bg-gradient-primary h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;