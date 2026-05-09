import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Session Expired Page
 * Shown when user's session expires
 */
export default function SessionExpired() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-black text-black mb-2">Session Expired</h1>
        <p className="text-muted-foreground mb-8">
          Your session has expired for security reasons. Please log in again to continue.
        </p>

        <div className="space-y-3 mb-8">
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Log In Again
          </Button>

          <Link to="/" className="block">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Your work is safe. We auto-save your progress.
        </p>
      </div>
    </div>
  );
}