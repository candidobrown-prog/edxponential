import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

// Tier-based navigation configs
const NAV_CONFIGS = {
  'Founders Sphere': {
    main: [
      { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { label: 'Charter Builder', path: '/foundaitionx', icon: '🏗️' },
      { label: 'Board Tools', path: '/foundaitionx/boaredx', icon: '👥' },
      { label: 'Funding', path: '/deal-room', icon: '💰' },
    ],
    secondary: [
      { label: 'Operations', path: '/operationx', icon: '⚙️' },
      { label: 'AI Tools', path: '/ai-insights', icon: '✨' },
      { label: 'Community', path: '/communities', icon: '🌍' },
    ],
  },
  'Executive Entourage': {
    main: [
      { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { label: 'Executive Dashboard', path: '/admin/executive', icon: '📊' },
      { label: 'Analytics', path: '/admin/payments', icon: '📈' },
      { label: 'Operations', path: '/operationx', icon: '⚙️' },
    ],
    secondary: [
      { label: 'Coaching', path: '/coaching', icon: '🎯' },
      { label: 'Community', path: '/communities', icon: '🌍' },
      { label: 'Learning', path: '/courses', icon: '📚' },
    ],
  },
  'Principal Park': {
    main: [
      { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { label: 'School Tools', path: '/graiedx', icon: '🏫' },
      { label: 'Coaching', path: '/coaching', icon: '🎯' },
      { label: 'Assessments', path: '/xschores', icon: '📋' },
    ],
    secondary: [
      { label: 'SPED', path: '/perspedxtives', icon: '🎓' },
      { label: 'Marketplace', path: '/educartx', icon: '🛒' },
      { label: 'Community', path: '/communities', icon: '🌍' },
    ],
  },
  'edVisors': {
    main: [
      { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { label: 'Coaching', path: '/coaching', icon: '🎯' },
      { label: 'Community', path: '/communities', icon: '🌍' },
      { label: 'Content', path: '/educartx', icon: '📚' },
    ],
    secondary: [
      { label: 'Marketplace', path: '/educartx', icon: '🛒' },
      { label: 'AI Tools', path: '/ai-insights', icon: '✨' },
    ],
  },
};

export default function SmartNavigation({ tier = 'Principal Park' }) {
  const [expanded, setExpanded] = useState(true);
  const [showSecondary, setShowSecondary] = useState(false);
  const location = useLocation();
  const config = NAV_CONFIGS[tier];

  if (!config) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center hover:bg-black/85 transition-all shadow-soft"
      >
        {expanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: expanded ? 220 : 0 }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-white border-r border-border overflow-hidden transition-all duration-300 z-40"
      >
        <div className="w-220 p-6 space-y-8 h-full overflow-y-auto">
          {/* Logo */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              {tier}
            </p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-3 mb-3">
              My Tools
            </p>
            {config.main.map(item => (
              <Link key={item.path} to={item.path}>
                <button
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                    location.pathname === item.path
                      ? 'bg-muted text-black font-semibold'
                      : 'text-muted-foreground hover:text-black hover:bg-muted/60'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Secondary Navigation (collapsible) */}
          <div>
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-black hover:bg-muted/60 transition-all group"
            >
              <span>
                <span className="mr-2">⭐</span>
                More Tools
              </span>
              <motion.div
                animate={{ rotate: showSecondary ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            {showSecondary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mt-2 overflow-hidden"
              >
                {config.secondary.map(item => (
                  <Link key={item.path} to={item.path}>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-black hover:bg-muted/40 transition-all">
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </button>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

          {/* Settings */}
          <div className="pt-4 border-t border-border space-y-2">
            <Link to="/profile">
              <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-black hover:bg-muted/60 transition-all">
                <span className="mr-2">⚙️</span>
                Settings
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 top-14 z-30 bg-white/95 backdrop-blur-sm p-6 space-y-6 overflow-y-auto"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
              Main Tools
            </p>
            <div className="space-y-2">
              {config.main.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setExpanded(false)}>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-black hover:bg-muted/60 transition-all">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
              Explore
            </p>
            <div className="space-y-2">
              {config.secondary.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setExpanded(false)}>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-black hover:bg-muted/60 transition-all">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content margin adjustment */}
      <style>
        {`
          @media (min-width: 1024px) {
            main { margin-left: ${expanded ? '220px' : '0px'}; transition: margin-left 0.3s; }
          }
        `}
      </style>
    </>
  );
}