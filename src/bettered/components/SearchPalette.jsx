import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { SEARCH_INDEX } from '@/bettered/data/nav';

export default function SearchPalette({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const groups = SEARCH_INDEX.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/60 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Search BetterEd Solutions" shouldFilter className="w-full">
          <div className="flex items-center gap-3 border-b border-bettered-lightgray px-4">
            <Search className="h-4 w-4 text-bettered-midgray shrink-0" aria-hidden="true" />
            <Command.Input
              autoFocus
              placeholder="Search pages, services, academies..."
              className="w-full py-4 text-sm outline-none placeholder:text-bettered-midgray"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="p-1 text-bettered-midgray hover:text-bettered-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-center text-sm text-bettered-midgray">
              No matching pages. Try "services" or "health index".
            </Command.Empty>
            {Object.entries(groups).map(([group, items]) => (
              <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-bettered-midgray">
                {items.map((item) => (
                  <Command.Item
                    key={item.to}
                    value={item.label}
                    onSelect={() => {
                      onClose();
                      navigate(item.to);
                    }}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-bettered-ink cursor-pointer data-[selected=true]:bg-bettered-offwhite data-[selected=true]:text-bettered-orange"
                  >
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
