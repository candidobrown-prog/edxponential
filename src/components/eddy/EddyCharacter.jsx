import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const eyeVariants = {
  blink: {
    scaleY: [1, 0.1, 1],
    transition: { duration: 0.3 },
  },
  look: {
    x: [0, 4, 0],
    transition: { duration: 0.6 },
  },
};

const bodyVariants = {
  idle: {
    y: [0, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  wave: {
    rotate: [0, 15, -10, 15, 0],
    transition: { duration: 0.8, times: [0, 0.25, 0.5, 0.75, 1] },
  },
  nod: {
    rotateZ: [0, -8, 8, -8, 0],
    transition: { duration: 0.8, times: [0, 0.25, 0.5, 0.75, 1] },
  },
};

const mouthVariants = {
  smile: { scaleY: 1, transition: { duration: 0.3 } },
  neutral: { scaleY: 0.5, transition: { duration: 0.3 } },
};

export default function EddyCharacter({ 
  size = 'md', 
  state = 'idle', 
  expression = 'friendly',
  animateEmotion = 'none',
  showText = false,
  text = ''
}) {
  const [blinkTrigger, setBlinkTrigger] = useState(0);
  const sizeMap = { sm: 80, md: 140, lg: 200, xl: 280 };
  const dimension = sizeMap[size];

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkTrigger(t => t + 1);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const expressionMap = {
    friendly: { eyeOpacity: 1, mouthScale: 1 },
    excited: { eyeOpacity: 1, mouthScale: 1.2 },
    thinking: { eyeOpacity: 0.8, mouthScale: 0.6 },
    confident: { eyeOpacity: 1, mouthScale: 0.9 },
  };

  const exp = expressionMap[expression] || expressionMap.friendly;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        style={{ width: dimension, height: dimension }}
        variants={bodyVariants}
        initial="idle"
        animate={animateEmotion === 'wave' ? 'wave' : animateEmotion === 'nod' ? 'nod' : 'idle'}
        className="relative flex items-center justify-center"
      >
        {/* Main body - lowercase e */}
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          className="drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="eGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <filter id="glossShine">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>

          {/* e shape body */}
          <path
            d="M 30 20 Q 40 15 50 15 Q 70 15 75 25 Q 80 35 75 45 L 35 45 Q 35 50 50 50 Q 70 50 75 50 L 75 60 Q 70 65 50 65 Q 30 65 25 55 Q 20 45 20 35 Q 20 25 30 20 Z"
            fill="url(#eGradient)"
            stroke="#333"
            strokeWidth="0.5"
          />

          {/* Glossy highlight */}
          <ellipse
            cx="35"
            cy="30"
            rx="8"
            ry="12"
            fill="white"
            opacity="0.15"
            filter="url(#glossShine)"
          />

          {/* Left eye */}
          <motion.g
            initial="idle"
            animate={blinkTrigger % 2 === 0 ? 'blink' : 'idle'}
            variants={eyeVariants}
            transformOrigin="40 35"
          >
            <circle cx="40" cy="35" r="6" fill="white" opacity={exp.eyeOpacity} />
            <circle cx="40" cy="35" r="3.5" fill="#0a0f1e" />
            <circle cx="41.5" cy="33" r="1.2" fill="white" />
          </motion.g>

          {/* Right eye */}
          <motion.g
            initial="idle"
            animate={blinkTrigger % 2 === 0 ? 'blink' : 'idle'}
            variants={eyeVariants}
            transformOrigin="60 35"
          >
            <circle cx="60" cy="35" r="6" fill="white" opacity={exp.eyeOpacity} />
            <circle cx="60" cy="35" r="3.5" fill="#0a0f1e" />
            <circle cx="61.5" cy="33" r="1.2" fill="white" />
          </motion.g>

          {/* Left eyebrow */}
          <motion.path
            d="M 35 28 Q 40 26 45 27"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: animateEmotion === 'excited' 
                ? "M 35 26 Q 40 23 45 24"
                : "M 35 28 Q 40 26 45 27",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Right eyebrow */}
          <motion.path
            d="M 55 27 Q 60 26 65 28"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: animateEmotion === 'excited'
                ? "M 55 24 Q 60 23 65 26"
                : "M 55 27 Q 60 26 65 28",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Mouth */}
          <motion.path
            d={expression === 'thinking' ? "M 45 52 Q 50 51 55 52" : "M 45 52 Q 50 54 55 52"}
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            animate={expression === 'friendly' ? 'smile' : 'neutral'}
            variants={mouthVariants}
            opacity={0.9}
          />
        </svg>

        {/* T-shirt with edXponential text (SVG overlay) */}
        <svg
          viewBox="0 0 100 100"
          width={dimension * 0.6}
          height={dimension * 0.4}
          className="absolute bottom-2"
          style={{ pointerEvents: 'none' }}
        >
          <rect
            x="20"
            y="50"
            width="60"
            height="35"
            rx="3"
            fill="#000"
            stroke="#333"
            strokeWidth="0.5"
          />
          <text
            x="50"
            y="72"
            textAnchor="middle"
            fontSize="6"
            fill="white"
            fontWeight="bold"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.3"
          >
            edXponential
          </text>
        </svg>
      </motion.div>

      {/* Text below character */}
      {showText && text && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xs"
        >
          <p className="text-white/90 text-sm leading-relaxed font-medium">{text}</p>
        </motion.div>
      )}
    </div>
  );
}