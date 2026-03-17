import React from 'react';
import { motion } from 'motion/react';

export const IslamicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0D0905] overflow-hidden pointer-events-none">
      {/* Deep Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A120A] via-[#0D0905] to-[#050402]" />
      
      {/* Animated Stars */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: Math.random() }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute bg-primary rounded-full"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
        />
      ))}

      {/* Floating Moons (Subtle) */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`moon-${i}`}
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 10 + i * 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute text-primary/20"
          style={{
            top: 10 + i * 30 + '%',
            left: 5 + i * 40 + '%',
            fontSize: 40 + i * 20 + 'px'
          }}
        >
          🌙
        </motion.div>
      ))}

      {/* Islamic Patterns (Animated) */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <pattern id="islamic-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      {/* Soft Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
    </div>
  );
};
