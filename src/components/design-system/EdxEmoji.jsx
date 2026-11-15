/**
 * edXponential Premium Vector Emoji System
 * Style: minimalist, soft-geometric, monochrome-first with intelligent accents
 * No standard OS emojis — every visual is custom SVG
 */

import React from 'react';

const EmojiBase = ({ children, size = 28, className = '' }) => (
  <svg
    width={size} height={size} viewBox="0 0 32 32" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block align-middle flex-shrink-0 ${className}`}
  >
    {children}
  </svg>
);

// ✨ Spark / Inspiration
export const EmojiSpark = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="16" r="10" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M16 8v4M16 20v4M8 16h4M20 16h4" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M10.34 10.34l2.83 2.83M18.83 18.83l2.83 2.83M10.34 21.66l2.83-2.83M18.83 13.17l2.83-2.83" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="2.5" fill="#1a1a1a"/>
  </EmojiBase>
);

// 🎓 Graduation / Achievement
export const EmojiGrad = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="17" r="8" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M16 6L6 12l10 6 10-6-10-6z" fill="#1a1a1a"/>
    <path d="M26 12v6" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M11 18v3c0 1.7 2.2 3 5 3s5-1.3 5-3v-3" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
  </EmojiBase>
);

// 🚀 Launch / Ambition
export const EmojiRocket = ({ size }) => (
  <EmojiBase size={size}>
    <path d="M16 4c3 0 8 4 8 12l-4 4-4 4-4-4-4-4C8 8 13 4 16 4z" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <circle cx="16" cy="14" r="3" fill="#1a1a1a"/>
    <path d="M10 22l-4 4M22 22l4 4" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M12 26c0 1.7 1.3 3 4 3s4-1.3 4-3" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
  </EmojiBase>
);

// 💡 Insight / Idea
export const EmojiIdea = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="13" r="7" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M13 20h6v1.5a3 3 0 0 1-6 0V20z" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <line x1="13" y1="20" x2="19" y2="20" stroke="#1a1a1a" strokeWidth="1"/>
    <path d="M14 13a2 2 0 0 1 4 0" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="16" cy="15" r="1" fill="#1a1a1a"/>
  </EmojiBase>
);

// 🤝 Collaboration / Partnership
export const EmojiHandshake = ({ size }) => (
  <EmojiBase size={size}>
    <path d="M4 14h5l3-4h8l3 4h5" stroke="#1a1a1a" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
    <path d="M9 14l4 6h6l4-6" stroke="#1a1a1a" strokeWidth="1.3" strokeLinejoin="round" fill="white"/>
    <path d="M13 10l3 4 3-4" stroke="#1a1a1a" strokeWidth="1.2" strokeLinejoin="round"/>
  </EmojiBase>
);

// 🌍 Global / Worldwide
export const EmojiGlobe = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="16" r="11" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <ellipse cx="16" cy="16" rx="4.5" ry="11" fill="none" stroke="#1a1a1a" strokeWidth="1"/>
    <line x1="5" y1="16" x2="27" y2="16" stroke="#1a1a1a" strokeWidth="1"/>
    <path d="M7 11c3 1.5 5 1.5 9 0 4 1.5 6 1.5 9 0" stroke="#1a1a1a" strokeWidth="0.9" fill="none"/>
    <path d="M7 21c3-1.5 5-1.5 9 0 4-1.5 6-1.5 9 0" stroke="#1a1a1a" strokeWidth="0.9" fill="none"/>
  </EmojiBase>
);

// ⚡ Energy / Power
export const EmojiZap = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="16" r="11" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M18 7l-6 9h7l-7 9" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </EmojiBase>
);

// 🏆 Achievement / Award
export const EmojiTrophy = ({ size }) => (
  <EmojiBase size={size}>
    <path d="M10 4h12v8a6 6 0 0 1-12 0V4z" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M10 7H6a2 2 0 0 0 0 4h4" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M22 7h4a2 2 0 0 1 0 4h-4" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M16 18v4" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="11" y="22" width="10" height="2.5" rx="1" fill="#1a1a1a"/>
  </EmojiBase>
);

// 🧠 Intelligence / Mind
export const EmojiBrain = ({ size }) => (
  <EmojiBase size={size}>
    <path d="M10 20c-3.5 0-6-2.5-6-6 0-2 1-4 3-5-0.5-3 2-5 5-4.5C13 3.5 15 2 17 3c3-1 5 1 5 4 2 1 3 2.5 3 4.5 0 3.5-2.5 6-6 6" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M16 20v6" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M13 26h6" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M12 10c1 2 3 3 5 2" stroke="#1a1a1a" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M16 8v3" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/>
  </EmojiBase>
);

// 🌱 Growth / Potential
export const EmojiGrow = ({ size }) => (
  <EmojiBase size={size}>
    <path d="M16 28V14" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 14c0-5 4-9 9-9-1 5-5 9-9 9z" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M16 18c0-4-4-7-9-7 1 4 5 7 9 7z" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M10 28h12" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
  </EmojiBase>
);

// 👑 Crown / Leadership
export const EmojiCrown = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="16" r="11" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M8 20l3-8 5 5 5-5 3 8H8z" fill="#1a1a1a"/>
    <circle cx="16" cy="12" r="1.2" fill="white"/>
    <circle cx="10" cy="14" r="1" fill="white"/>
    <circle cx="22" cy="14" r="1" fill="white"/>
  </EmojiBase>
);

// 🔮 Vision / Future
export const EmojiOrb = ({ size }) => (
  <EmojiBase size={size}>
    <circle cx="16" cy="15" r="10" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
    <path d="M10 12c2-3 6-3 8 0" stroke="#1a1a1a" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
    <circle cx="16" cy="15" r="3" fill="#1a1a1a" opacity="0.15"/>
    <circle cx="14" cy="13" r="1.5" fill="#1a1a1a" opacity="0.6"/>
    <path d="M10 27h12" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M14 25v2M18 25v2" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
  </EmojiBase>
);

// Registry for dynamic usage
export const EDX_EMOJI = {
  spark: EmojiSpark, grad: EmojiGrad, rocket: EmojiRocket, idea: EmojiIdea,
  handshake: EmojiHandshake, globe: EmojiGlobe, zap: EmojiZap, trophy: EmojiTrophy,
  brain: EmojiBrain, grow: EmojiGrow, crown: EmojiCrown, orb: EmojiOrb,
};

/** Drop-in component: <EdxEmoji name="spark" size={24} /> */
export default function EdxEmoji({ name, size = 28, className }) {
  const Component = EDX_EMOJI[name];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}