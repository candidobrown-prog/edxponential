import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryLabels = {
  charter_schools: 'Charter Schools',
  public_schools: 'Public Schools',
  private_schools: 'Private Schools',
  higher_ed: 'Higher Ed',
  edtech: 'EdTech',
  policy: 'Policy',
  general: 'General',
};

export default function CommunityCard({ community }) {
  const VisibilityIcon = community.visibility === 'public' ? Globe : Lock;

  return (
    <Link
      to={`/communities/${community.id}`}
      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
    >
      <div className="h-32 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent relative overflow-hidden">
        {community.cover_image ? (
          <img src={community.cover_image} alt={community.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-12 h-12 text-primary/15" />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs bg-accent/50 border-border/50">
            {categoryLabels[community.category] || community.category}
          </Badge>
          <VisibilityIcon className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {community.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
          {community.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            {community.member_count || 0} members
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}