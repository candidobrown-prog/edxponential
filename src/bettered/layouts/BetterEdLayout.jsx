import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/bettered/components/Header';
import Footer from '@/bettered/components/Footer';

export default function BetterEdLayout() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="bettered-root font-inter antialiased text-bettered-ink bg-white min-h-screen flex flex-col">
      <Header />
      <main id="bettered-main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
