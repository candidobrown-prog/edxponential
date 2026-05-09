import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MessageCircle } from 'lucide-react';
import EddyChatWindow from './EddyChatWindow';

const PUBLIC_PATHS = ['/', '/welcome', '/pricing', '/onboarding'];

export default function AskEddy() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unread, setUnread] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    const t = setTimeout(() => { if (!open) setUnread(true); }, 30000);
    return () => clearTimeout(t);
  }, []);

  // Hide on public pages
  if (PUBLIC_PATHS.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {!open && (
          <button
            onClick={() => { setOpen(true); setUnread(false); }}
            className="flex items-center gap-2 bg-[#0a0f1e] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-black transition-all duration-200 font-bold text-sm"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {unread && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />}
            </div>
            Ask Eddy
          </button>
        )}
      </div>
      {open && <EddyChatWindow user={user} onClose={() => setOpen(false)} />}
    </>
  );
}