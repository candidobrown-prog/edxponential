import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowRight } from 'lucide-react';
import { useState } from 'react';

/**
 * 404 Not Found Page
 * Helpful navigation when users hit broken links
 */
export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularDestinations = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Coaching', path: '/coaching', icon: '🎯' },
    { name: 'Communities', path: '/communities', icon: '👥' },
    { name: 'Marketplace', path: '/educartx', icon: '🛒' },
    { name: 'School Tools', path: '/graiedx', icon: '🏫' },
    { name: 'Operations', path: '/operationx', icon: '⚙️' },
    { name: 'Pricing', path: '/pricing', icon: '💰' },
    { name: 'Help Center', path: '/', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/">
            <img
              src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential"
              className="h-8 w-auto"
            />
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-8xl font-black text-muted-foreground mb-4">404</div>
          <h1 className="text-4xl font-black text-black mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Search */}
        <div className="mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for what you need..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-white placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-3">
              Try browsing or go to a popular destination below.
            </p>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="mb-16">
          <h2 className="text-lg font-bold text-black mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest) => (
              <Link key={dest.path} to={dest.path}>
                <button className="w-full p-4 rounded-lg border border-border bg-white hover:border-foreground/30 hover:bg-muted transition-all text-center group">
                  <div className="text-3xl mb-2">{dest.icon}</div>
                  <p className="text-sm font-semibold text-black group-hover:text-primary transition-colors">
                    {dest.name}
                  </p>
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-secondary rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-black mb-3">Can't Find What You're Looking For?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help. Get in touch and we'll guide you to the right place.
          </p>
          <a href="mailto:support@edxponential.com">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 edXponential. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}