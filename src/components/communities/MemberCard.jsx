import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function MemberCard({ member }) {
  const initials = member.user_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

  return (
    <div className="bg-white rounded-2xl border border-black/8 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Photo area */}
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {member.user_avatar ? (
          <img src={member.user_avatar} alt={member.user_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
            <span className="text-2xl font-heading font-bold text-white">{initials}</span>
          </div>
        )}
        {member.role === 'moderator' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-black text-white border-0 text-xs">Moderator</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-heading font-semibold text-base text-black">{member.user_name}</h3>
        {member.user_title && <p className="text-xs text-gray-500 mt-0.5 truncate">{member.user_title}</p>}
        {member.user_organization && <p className="text-xs text-gray-400 truncate">{member.user_organization}</p>}
        <div className="mt-auto pt-3">
          <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5 text-xs border-black/15 hover:bg-black hover:text-white transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> Connect
          </Button>
        </div>
      </div>
    </div>
  );
}