import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ChevronDown, X, Eye, RotateCcw, Zap, Shield, Users, GraduationCap, BookOpen, DollarSign, Briefcase, Star, User, School, Brain, UserCheck } from 'lucide-react';

const ROLES = [
  { id: 'ceo', label: 'Founder / CEO', sublabel: 'Full platform access', icon: Crown, color: '#ffffff', tier: 'god' },
  { id: 'super_admin', label: 'Super Admin', sublabel: 'Administrative control', icon: Shield, color: '#e2e8f0', tier: 'admin' },
  { id: 'exec_entourage', label: 'Executive Entourage', sublabel: 'C-suite member', icon: Briefcase, color: '#cbd5e1', tier: 'exec' },
  { id: 'founders_sphere', label: 'Founders Sphere', sublabel: 'School founder member', icon: Zap, color: '#94a3b8', tier: 'founder' },
  { id: 'principal_park', label: 'Principal Park', sublabel: 'School leader member', icon: School, color: '#94a3b8', tier: 'principal' },
  { id: 'edvisor', label: 'edVisor', sublabel: 'Advisor / Coach', icon: Star, color: '#64748b', tier: 'advisor' },
  { id: 'edvestor', label: 'edVestor', sublabel: 'Investor member', icon: DollarSign, color: '#64748b', tier: 'investor' },
  { id: 'tutor', label: 'Tutor', sublabel: 'TwotrX tutor', icon: GraduationCap, color: '#475569', tier: 'tutor' },
  { id: 'teacher', label: 'Teacher', sublabel: 'Classroom educator', icon: BookOpen, color: '#475569', tier: 'teacher' },
  { id: 'school_founder', label: 'School Founder', sublabel: 'Building a new school', icon: Brain, color: '#334155', tier: 'founder' },
  { id: 'board_member', label: 'Board Member', sublabel: 'Governance role', icon: UserCheck, color: '#334155', tier: 'board' },
  { id: 'parent', label: 'Parent', sublabel: 'Family portal', icon: Users, color: '#1e293b', tier: 'parent' },
  { id: 'student', label: 'Student', sublabel: 'Learner access', icon: GraduationCap, color: '#1e293b', tier: 'student' },
  { id: 'guest', label: 'Guest User', sublabel: 'Public view', icon: User, color: '#0f172a', tier: 'guest' },
];

export const RoleContext = createContext({ activeRole: 'ceo', setActiveRole: () => {} });
export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }) {
  const [activeRole, setActiveRole] = useState('ceo');
  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export default function RoleSwitcher({ userEmail }) {
  const [open, setOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const { activeRole, setActiveRole } = useRole();

  // Only show for admin/founder emails
  const isFounder = userEmail?.includes('admin') || userEmail?.endsWith('@edxponential.com') || true; // visible for demo
  if (!isFounder) return null;

  const current = ROLES.find(r => r.id === activeRole) || ROLES[0];
  const isDefaultCEO = activeRole === 'ceo';

  const switchRole = async (roleId) => {
    setTransitioning(true);
    setOpen(false);
    await new Promise(r => setTimeout(r, 400));
    setActiveRole(roleId);
    setTransitioning(false);
  };

  return (
    <>
      {/* Transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm font-medium tracking-wide">Switching perspective…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
        {/* Viewing-as banner */}
        <AnimatePresence>
          {!isDefaultCEO && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/60 text-xs font-medium"
            >
              <Eye className="w-3 h-3" />
              Viewing as {current.label}
              <button onClick={() => switchRole('ceo')} className="ml-1 text-white/40 hover:text-white transition-colors">
                <RotateCcw className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main trigger */}
        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0a0a0a] border border-white/12 shadow-2xl shadow-black/50 hover:border-white/20 transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
            <current.icon className="w-3.5 h-3.5 text-white/70" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white leading-none">{current.label}</div>
            <div className="text-[9px] text-white/35 mt-0.5">{current.sublabel}</div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
          {isDefaultCEO && <Crown className="w-3 h-3 text-white/30" />}
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 right-0 w-72 rounded-2xl bg-[#0d0d0d] border border-white/8 shadow-2xl shadow-black/60 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-white tracking-wide">Role Simulator</p>
                  <p className="text-[10px] text-white/30 mt-0.5">CEO Mode · edXponential</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/20 hover:text-white/60 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto py-1.5">
                {ROLES.map((role) => {
                  const isActive = activeRole === role.id;
                  return (
                    <button key={role.id} onClick={() => switchRole(role.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all group ${isActive ? 'bg-white/8' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-white/15' : 'bg-white/6 group-hover:bg-white/10'}`}>
                        <role.icon className="w-3.5 h-3.5 text-white/60" />
                      </div>
                      <div className="text-left">
                        <div className={`text-xs font-semibold leading-none ${isActive ? 'text-white' : 'text-white/60'}`}>{role.label}</div>
                        <div className="text-[10px] text-white/25 mt-0.5">{role.sublabel}</div>
                      </div>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-4 py-3 border-t border-white/5">
                <a href="/ceo-command" className="flex items-center gap-2 text-[10px] text-white/30 hover:text-white/60 transition-colors">
                  <Crown className="w-3 h-3" /> Open CEO Command Center
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}