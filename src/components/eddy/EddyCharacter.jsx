import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function EddyCharacter({ speaking = false, mood = 'neutral', size = 'lg' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const containerRef = useRef(null);

  const sizeMap = {
    sm: { width: 100, height: 120 },
    md: { width: 150, height: 180 },
    lg: { width: 240, height: 280 },
    xl: { width: 320, height: 380 },
  };

  const currentSize = sizeMap[size];

  // Track mouse movement for eye tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        setMousePos({
          x: Math.cos(angle) * 8,
          y: Math.sin(angle) * 8,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const moodConfig = {
    neutral: { eyeScale: 1, browRotation: 0, mouthHeight: 12 },
    happy: { eyeScale: 1.1, browRotation: -5, mouthHeight: 18 },
    excited: { eyeScale: 1.2, browRotation: -8, mouthHeight: 22 },
    thinking: { eyeScale: 0.95, browRotation: 3, mouthHeight: 8 },
    sad: { eyeScale: 0.9, browRotation: 8, mouthHeight: 4 },
  };

  const current = moodConfig[mood];

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{
        width: currentSize.width,
        height: currentSize.height,
      }}
    >
      <svg
        viewBox="0 0 240 280"
        width={currentSize.width}
        height={currentSize.height}
        className="filter drop-shadow-2xl"
      >
        <defs>
          {/* Gradient for body */}
          <radialGradient id="bodyGradient" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>

          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Eye shine */}
          <radialGradient id="eyeShine" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Body - lowercase "e" */}
        <motion.g
          animate={{
            y: speaking ? [0, -5, 0] : [0, 3, 0],
          }}
          transition={{
            duration: speaking ? 0.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Main e shape */}
          <path
            d="M 120 60 Q 160 50 170 100 L 170 180 Q 160 230 120 220 Q 80 210 70 180 L 70 100 Q 80 50 120 60 Z"
            fill="url(#bodyGradient)"
            filter="url(#glow)"
          />

          {/* Center opening of e */}
          <ellipse cx="120" cy="140" rx="35" ry="40" fill="#0a0a0a" opacity="0.5" />

          {/* Highlights */}
          <ellipse cx="100" cy="90" rx="20" ry="30" fill="white" opacity="0.15" />
          <ellipse cx="130" cy="200" rx="15" ry="20" fill="white" opacity="0.08" />
        </motion.g>

        {/* Left Eye */}
        <motion.g
          animate={{
            scaleY: blink ? 0.1 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          <motion.circle
            cx={80}
            cy={80}
            r="18"
            fill="white"
            animate={{ x: mousePos.x }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Left pupil */}
          <motion.circle
            cx={80}
            cy={80}
            r="11"
            fill="#0a0a0a"
            animate={{
              x: mousePos.x * 0.6,
              y: mousePos.y * 0.6,
              scale: speaking ? 0.9 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Left pupil shine */}
          <circle cx={76} cy={76} r="5" fill="#ffffff" opacity="0.7" />

          {/* Left eye shine */}
          <circle cx="70" cy="70" r="6" fill="url(#eyeShine)" />
        </motion.g>

        {/* Right Eye */}
        <motion.g
          animate={{
            scaleY: blink ? 0.1 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          <motion.circle
            cx={160}
            cy={80}
            r="18"
            fill="white"
            animate={{ x: mousePos.x }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Right pupil */}
          <motion.circle
            cx={160}
            cy={80}
            r="11"
            fill="#0a0a0a"
            animate={{
              x: mousePos.x * 0.6,
              y: mousePos.y * 0.6,
              scale: speaking ? 0.9 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Right pupil shine */}
          <circle cx={156} cy={76} r="5" fill="#ffffff" opacity="0.7" />

          {/* Right eye shine */}
          <circle cx="150" cy="70" r="6" fill="url(#eyeShine)" />
        </motion.g>

        {/* Left Eyebrow */}
        <motion.path
          d="M 65 55 Q 80 45 95 50"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: current.browRotation,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '80px 48px' }}
        />

        {/* Right Eyebrow */}
        <motion.path
          d="M 145 50 Q 160 45 175 55"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: -current.browRotation,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '160px 48px' }}
        />

        {/* Mouth */}
        <motion.g
          animate={{
            y: speaking ? -2 : 0,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Mouth opening */}
          <motion.ellipse
            cx="120"
            cy="140"
            rx="18"
            ry={current.mouthHeight}
            fill="white"
            animate={{
              ry: speaking ? current.mouthHeight + 5 : current.mouthHeight,
            }}
            transition={{ duration: 0.05 }}
          />

          {/* Mouth detail */}
          {speaking && (
            <motion.path
              d="M 105 140 Q 120 150 135 140"
              stroke="#0a0a0a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
              animate={{
                d: [
                  'M 105 140 Q 120 150 135 140',
                  'M 105 138 Q 120 145 135 138',
                  'M 105 140 Q 120 150 135 140',
                ],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          )}
        </motion.g>

        {/* Floating Animation */}
        <motion.g
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Soft glow ring */}
          <circle
            cx="120"
            cy="140"
            r="145"
            fill="none"
            stroke="#0066ff"
            strokeWidth="0.5"
            opacity="0.2"
            filter="url(#glow)"
          />
        </motion.g>
      </svg>
    </div>
  );
}