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
        viewBox="0 0 240 320"
        width={currentSize.width}
        height={currentSize.height}
        className="filter drop-shadow-2xl"
      >
        <defs>
          {/* Gradient for body */}
          <radialGradient id="bodyGradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Eye shine */}
          <radialGradient id="eyeShine" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Body - Round character */}
        <motion.g
          animate={{
            y: speaking ? [0, -4, 0] : [0, 2, 0],
          }}
          transition={{
            duration: speaking ? 0.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Main body circle */}
          <circle
            cx="120"
            cy="150"
            r="85"
            fill="url(#bodyGradient)"
            filter="url(#glow)"
          />

          {/* Body highlight */}
          <ellipse cx="95" cy="120" rx="25" ry="35" fill="white" opacity="0.08" />
        </motion.g>

        {/* Left Eye */}
        <motion.g
          animate={{
            scaleY: blink ? 0.15 : 1,
          }}
          transition={{ duration: 0.12 }}
        >
          {/* Left eye white */}
          <motion.circle
            cx={78}
            cy={110}
            r="28"
            fill="white"
            animate={{ x: mousePos.x * 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          {/* Left pupil */}
          <motion.circle
            cx={78}
            cy={110}
            r="18"
            fill="#000000"
            animate={{
              x: mousePos.x * 1.2,
              y: mousePos.y * 1.2,
              scale: speaking ? 0.85 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          {/* Left pupil shine - bright highlight */}
          <circle cx={72} cy={104} r="8" fill="#ffffff" opacity="0.8" />
          <circle cx={74} cy={106} r="3" fill="#ffffff" opacity="0.6" />
        </motion.g>

        {/* Right Eye */}
        <motion.g
          animate={{
            scaleY: blink ? 0.15 : 1,
          }}
          transition={{ duration: 0.12 }}
        >
          {/* Right eye white */}
          <motion.circle
            cx={162}
            cy={110}
            r="28"
            fill="white"
            animate={{ x: mousePos.x * 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          {/* Right pupil */}
          <motion.circle
            cx={162}
            cy={110}
            r="18"
            fill="#000000"
            animate={{
              x: mousePos.x * 1.2,
              y: mousePos.y * 1.2,
              scale: speaking ? 0.85 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          {/* Right pupil shine - bright highlight */}
          <circle cx={156} cy={104} r="8" fill="#ffffff" opacity="0.8" />
          <circle cx={158} cy={106} r="3" fill="#ffffff" opacity="0.6" />
        </motion.g>

        {/* Left Eyebrow - dark curved */}
        <motion.path
          d="M 55 80 Q 78 65 100 75"
          stroke="#000000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: current.browRotation,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '78px 72px' }}
        />

        {/* Right Eyebrow - dark curved */}
        <motion.path
          d="M 140 75 Q 162 65 185 80"
          stroke="#000000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          animate={{
            rotate: -current.browRotation,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '162px 72px' }}
        />

        {/* Mouth */}
        <motion.g
          animate={{
            y: speaking ? -3 : 0,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Mouth opening - red/pink */}
          <motion.ellipse
            cx="120"
            cy="180"
            rx="22"
            ry={current.mouthHeight * 1.2}
            fill="#ff3d4d"
            animate={{
              ry: speaking ? current.mouthHeight * 1.8 : current.mouthHeight * 1.2,
            }}
            transition={{ duration: 0.05 }}
          />

          {/* Mouth tongue hint */}
          {!speaking && (
            <ellipse
              cx="120"
              cy="188"
              rx="8"
              ry="6"
              fill="#ff5a6d"
              opacity="0.6"
            />
          )}
        </motion.g>

        {/* Hands - left waving */}
        <motion.g
          animate={{
            rotate: speaking ? [-5, 15, -5] : 0,
          }}
          transition={{
            duration: 0.6,
            repeat: speaking ? Infinity : 0,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '50px 160px' }}
        >
          {/* Left arm */}
          <rect x="30" y="140" width="25" height="60" rx="12" fill="#000000" />
          {/* Left hand */}
          <circle cx="45" cy="205" r="15" fill="#1a1a1a" />
          <circle cx="40" cy="200" r="6" fill="#1a1a1a" />
          <circle cx="50" cy="200" r="6" fill="#1a1a1a" />
        </motion.g>

        {/* Right arm */}
        <rect x="185" y="140" width="25" height="60" rx="12" fill="#000000" />
        {/* Right hand */}
        <circle cx="205" cy="205" r="15" fill="#1a1a1a" />
        <circle cx="210" cy="200" r="6" fill="#1a1a1a" />
        <circle cx="200" cy="200" r="6" fill="#1a1a1a" />

        {/* Feet - white shoes */}
        {/* Left foot */}
        <ellipse cx="90" cy="245" rx="18" ry="12" fill="#f5f5f5" />
        <rect x="78" y="254" width="24" height="8" rx="4" fill="#2a2a2a" />

        {/* Right foot */}
        <ellipse cx="150" cy="245" rx="18" ry="12" fill="#f5f5f5" />
        <rect x="138" y="254" width="24" height="8" rx="4" fill="#2a2a2a" />

        {/* Floating Animation / Aura glow */}
        <motion.g
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Soft blue glow ring */}
          <circle
            cx="120"
            cy="150"
            r="100"
            fill="none"
            stroke="#4466ff"
            strokeWidth="1"
            opacity="0.15"
            filter="url(#glow)"
          />
        </motion.g>
      </svg>
    </div>
  );
}