import React from 'react';
import { Outlet } from 'react-router-dom';

// Clean public layout — no sidebar, no app chrome
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}