import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SmartPageNotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const popularLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: HelpCircle },
    { label: 'Pricing', path: '/pricing', icon: HelpCircle },
    { label: 'Courses', path: '/courses', icon: HelpCircle },
    { label: 'Communities', path: '/communities', icon: HelpCircle },
    { label: 'Ask Eddy', path: '/ask-eddy', icon: HelpCircle },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You could implement a real search here
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* 404 Visualization */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-8xl font-black text-primary/20 mb-4">404</div>
        </motion.div>

        {/* Content */}
        <h1 className="heading-1 text-white mb-3">Page Not Found</h1>
        <p className="text-text-secondary mb-8">
          This page is still being built or has moved. No worries—let's get you back on track.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search edXponential..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-10 w-full"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="space-y-3 mb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition glow-crimson-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 border border-border text-white rounded-lg font-semibold hover:bg-surface/50 transition"
          >
            Go to Dashboard
          </motion.button>
        </div>

        {/* Popular Links */}
        <div className="border-t border-border pt-8">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Popular Pages
          </p>
          <div className="grid grid-cols-2 gap-2">
            {popularLinks.slice(0, 4).map((link) => (
              <motion.button
                key={link.path}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(link.path)}
                className="py-2 px-3 rounded-lg bg-card border border-border text-white text-xs font-medium hover:border-primary/50 transition"
              >
                {link.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-text-tertiary mb-3">
            Still need help?
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/ask-eddy')}
            className="text-primary hover:text-primary-light font-semibold text-sm transition flex items-center justify-center gap-2 mx-auto"
          >
            <HelpCircle className="w-4 h-4" />
            Ask Eddy
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}