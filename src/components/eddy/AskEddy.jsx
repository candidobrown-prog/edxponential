import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Minimize2, RotateCcw, ThumbsUp, ThumbsDown, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EddyChatWindow from './EddyChatWindow';
import { cn } from '@/lib/utils';

export default function AskEddy() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    // Show a subtle pulse after 30s if not opened yet
    const t = setTimeout(() => { if (!open) setUnread(true); }, 30000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {!open && (
          <button
            onClick={() => { setOpen(true); setUnread(false); }}
            className="flex items-center gap-2 bg-[#0a0f1e] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-black transition-all duration-200 font-bold text-sm"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {unread && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />}
            </div>
            Ask Eddy
          </button>
        )}
      </div>

      {/* Chat window */}
      {open && (
        <EddyChatWindow user={user} onClose={() => setOpen(false)} />
      )}
    </>
  );
}