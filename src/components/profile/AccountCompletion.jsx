import React from 'react';
import { CheckCircle, Circle, Award } from 'lucide-react';

const SECTIONS = [
  { id: 'name', label: 'Name completed', weight: 8 },
  { id: 'photo', label: 'Profile photo uploaded', weight: 8 },
  { id: 'role', label: 'Role selected', weight: 7 },
  { id: 'organization', label: 'School or organization added', weight: 7 },
  { id: 'bio', label: 'Bio completed', weight: 8 },
  { id: 'email', label: 'Email verified', weight: 10 },
  { id: 'phone', label: 'Phone number verified', weight: 8 },
  { id: 'identity', label: 'Identity verification completed', weight: 12 },
  { id: 'billing', label: 'Billing method added', weight: 10 },
  { id: 'notifications', label: 'Notification preferences set', weight: 7 },
  { id: 'community', label: 'Community profile completed', weight: 8 },
  { id: 'availability', label: 'Availability added', weight: 7 },
];

export default function AccountCompletion({ user }) {
  const completed = new Set();
  if (user?.full_name) completed.add('name');
  if (user?.photo_url) completed.add('photo');
  if (user?.role_type) completed.add('role');
  if (user?.organization) completed.add('organization');
  if (user?.bio) completed.add('bio');
  if (user?.email) completed.add('email');
  if (user?.phone_verified) completed.add('phone');
  if (user?.identity_verified === 'verified') completed.add('identity');
  if (user?.billing_method_added) completed.add('billing');
  if (user?.notifications_set) completed.add('notifications');
  if (user?.community_profile) completed.add('community');
  if (user?.availability_set) completed.add('availability');

  const pct = Math.round(SECTIONS.filter(s => completed.has(s.id)).reduce((acc, s) => acc + s.weight, 0));
  const isComplete = pct === 100;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-sm font-bold">Account Completion</p>
            {isComplete && <Award className="w-4 h-4 text-yellow-500" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isComplete ? 'Your account is fully complete. Welcome to the edXponential community.' : `Complete your profile to unlock full platform access.`}
          </p>
        </div>
        <span className="text-2xl font-black tabular-nums">{pct}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {SECTIONS.map(s => {
          const done = completed.has(s.id);
          return (
            <div key={s.id} className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg transition-colors ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
              {done
                ? <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                : <Circle className="w-3.5 h-3.5 flex-shrink-0 opacity-40" />}
              <span className={done ? 'line-through opacity-60' : ''}>{s.label}</span>
              {done && <span className="ml-auto text-[10px] font-bold text-green-600">+{s.weight}%</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}