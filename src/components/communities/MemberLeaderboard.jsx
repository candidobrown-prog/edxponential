import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MemberLeaderboard({ members = [], posts = [] }) {
  // Calculate post counts per member
  const memberPostCounts = members.map(m => ({
    ...m,
    postCount: posts.filter(p => p.author_email === m.user_email).length,
  }));

  // Sort by post count (descending)
  const ranked = memberPostCounts
    .filter(m => m.postCount > 0) // Only show contributors
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 10); // Top 10

  if (ranked.length === 0) {
    return null; // Don't show leaderboard if no contributors
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (rank === 2) return { icon: Award, color: 'text-gray-500', bg: 'bg-gray-100' };
    if (rank === 3) return { icon: Award, color: 'text-orange-600', bg: 'bg-orange-100' };
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-muted/30 border border-border rounded-2xl p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-black" />
        <h3 className="text-lg font-bold text-black">Top Contributors</h3>
        <Badge variant="outline" className="ml-auto">{ranked.length} contributors</Badge>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {ranked.map((member, idx) => {
          const rank = idx + 1;
          const badge = getRankBadge(rank);
          const isTopThree = rank <= 3;

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isTopThree
                  ? badge
                    ? `${badge.bg} border border-current/20`
                    : 'bg-muted border border-border'
                  : 'hover:bg-muted border border-transparent hover:border-border'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                {badge ? (
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {member.user_name}
                </p>
                {member.user_title && (
                  <p className="text-xs text-muted-foreground truncate">
                    {member.user_title}
                  </p>
                )}
              </div>

              {/* Post Count */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground whitespace-nowrap">
                  {member.postCount} {member.postCount === 1 ? 'post' : 'posts'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Note */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        🎉 Thank you to our top contributors!
      </p>
    </motion.div>
  );
}