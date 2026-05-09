import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Check, Loader2 } from 'lucide-react';

export default function CoachMatchingModal({ executives, coaches, onClose, onPair, loading }) {
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [coachSearch, setCoachSearch] = useState('');
  const [pairing, setPairing] = useState(false);

  const filteredCoaches = useMemo(() => {
    if (!coachSearch.trim()) return coaches;
    const q = coachSearch.toLowerCase();
    return coaches.filter(c =>
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.specialization?.toLowerCase().includes(q)
    );
  }, [coaches, coachSearch]);

  const handlePair = async (coach) => {
    if (!selectedExecutive) return;
    setPairing(true);
    await onPair(selectedExecutive, coach);
    setPairing(false);
    setSelectedExecutive(null);
    setCoachSearch('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-3xl w-full shadow-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-black">Manual Coach Pairing</h2>
              <p className="text-sm text-muted-foreground mt-1">Match executives with specialized coaches</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-black transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Executives list */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-sm">Select Executive</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {executives.map(exec => (
                  <button
                    key={exec.id}
                    onClick={() => setSelectedExecutive(exec)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedExecutive?.id === exec.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-border hover:border-black/20 text-black'
                    }`}
                  >
                    <div className="font-medium text-sm">{exec.full_name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{exec.email}</div>
                    {exec.specialization && (
                      <Badge className="mt-2 text-[10px]" variant={selectedExecutive?.id === exec.id ? 'default' : 'outline'}>
                        {exec.specialization}
                      </Badge>
                    )}
                    {exec.goals && (
                      <p className="text-[11px] opacity-60 mt-1.5 line-clamp-2">{exec.goals}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Coaches list */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-sm">Select Coach</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or specialization..."
                  value={coachSearch}
                  onChange={e => setCoachSearch(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCoaches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No coaches found</p>
                ) : (
                  filteredCoaches.map(coach => (
                    <button
                      key={coach.id}
                      disabled={!selectedExecutive || pairing}
                      onClick={() => handlePair(coach)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between group ${
                        !selectedExecutive || pairing
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-black/20 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-black">{coach.full_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">{coach.email}</div>
                        {coach.specialization && (
                          <Badge className="mt-2 text-[10px]" variant="outline">
                            {coach.specialization}
                          </Badge>
                        )}
                        {coach.bio && (
                          <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">{coach.bio}</p>
                        )}
                      </div>
                      {selectedExecutive && !pairing && (
                        <div className="ml-2 shrink-0 w-5 h-5 rounded border border-border bg-white group-hover:bg-black group-hover:border-black flex items-center justify-center transition-all">
                          <Check className="w-3 h-3 text-black opacity-0 group-hover:text-white group-hover:opacity-100 transition-all" />
                        </div>
                      )}
                      {pairing && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0 ml-2" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {selectedExecutive && (
            <div className="sticky bottom-0 bg-muted/50 border-t border-border p-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Selected: </span>
                <span className="font-medium text-black">{selectedExecutive.full_name}</span>
              </div>
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Close
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}