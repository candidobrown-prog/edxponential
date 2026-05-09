import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Globe, Lock, MessageSquare, Heart, Send, Search, X, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import MemberCard from '../components/communities/MemberCard';
import BulkAnnouncementModal from '../components/communities/BulkAnnouncementModal';
import MemberLeaderboard from '../components/communities/MemberLeaderboard';

const postTypeStyles = {
  discussion: 'bg-gray-100 text-gray-700',
  question: 'bg-gray-100 text-gray-700',
  resource: 'bg-gray-100 text-gray-700',
  announcement: 'bg-black text-white',
};

export default function CommunityDetail() {
  const communityId = window.location.pathname.split('/').pop();
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [activeTab, setActiveTab] = useState('discussions');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: () => base44.entities.Community.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['community-posts', communityId],
    queryFn: () => base44.entities.CommunityPost.filter({ community_id: communityId }, '-created_date', 50),
  });

  const { data: members = [] } = useQuery({
    queryKey: ['community-members', communityId],
    queryFn: () => base44.entities.CommunityMember.filter({ community_id: communityId }, '-created_date', 100),
  });

  const community = communities.find(c => c.id === communityId);

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.CommunityPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      setNewPost('');
      setPostType('discussion');
    },
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const u = await base44.auth.me();
      const existing = members.find(m => m.user_email === u.email);
      if (existing) return;
      return base44.entities.CommunityMember.create({
        community_id: communityId,
        user_email: u.email,
        user_name: u.full_name,
        user_title: u.title || '',
        user_organization: u.organization || '',
        role: 'member',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-members', communityId] }),
  });

  const handlePost = () => {
    if (!newPost.trim()) return;
    createPostMutation.mutate({
      community_id: communityId,
      content: newPost,
      post_type: postType,
      author_name: user?.full_name || 'Anonymous',
      author_email: user?.email || '',
    });
  };

  if (!community) {
    return (
      <div className="text-center py-20">
        <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading community...</p>
      </div>
    );
  }

  const VisibilityIcon = community.visibility === 'public' ? Globe : Lock;
  const isJoined = user && members.some(m => m.user_email === user.email);
  const isModerator = user && members.some(m => m.user_email === user.email && m.role === 'moderator');

  const tabs = [
    { id: 'discussions', label: 'Discussions', count: posts.length },
    { id: 'members', label: 'Members', count: members.length },
  ];

  return (
    <div className="space-y-8">
      <Link to="/communities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Communities
      </Link>

      {/* Header */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-black via-gray-800 to-gray-600 relative">
          {community.cover_image && <img src={community.cover_image} alt="" className="w-full h-full object-cover opacity-60" />}
        </div>
        <div className="p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-2xl font-bold">{community.name}</h1>
                <VisibilityIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl">{community.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <Badge variant="outline" className="capitalize">{community.category?.replace(/_/g, ' ')}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {members.length || community.member_count || 0} members
                </span>
              </div>
            </div>
            {!isJoined && (
              <Button
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className="bg-black text-white hover:bg-black/85 rounded-xl shrink-0"
              >
                {joinMutation.isPending ? 'Joining...' : 'Join Community'}
              </Button>
            )}
            {isJoined && (
              <div className="flex items-center gap-2">
                {isModerator && (
                  <Button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="bg-black text-white hover:bg-black/85 rounded-xl gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send Announcement
                  </Button>
                )}
                <Badge className="bg-black text-white border-0">{isModerator ? 'Moderator' : 'Member'}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Announcement Modal */}
      {showAnnouncementModal && (
        <BulkAnnouncementModal
          community={community}
          members={members}
          onClose={() => setShowAnnouncementModal(false)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} {tab.count > 0 && <span className="ml-1 text-xs opacity-60">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="space-y-5">
          {/* New Post */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <Textarea
              placeholder="Share an insight, ask a question, or post a resource..."
              className="mb-3 min-h-[80px] rounded-xl"
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger className="w-40 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handlePost}
                disabled={!newPost.trim() || createPostMutation.isPending}
                className="bg-black hover:bg-black/85 text-white rounded-xl gap-2"
              >
                <Send className="w-4 h-4" /> Post
              </Button>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No posts yet. Start the conversation!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white text-sm">{post.author_name?.[0] || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-sm">{post.author_name}</span>
                      <Badge className={`text-xs capitalize ${postTypeStyles[post.post_type] || ''}`}>
                        {post.post_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.created_date ? format(new Date(post.created_date), 'MMM d, h:mm a') : ''}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-black transition-colors">
                        <Heart className="w-3.5 h-3.5" /> {post.likes_count || 0}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-black transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" /> {post.replies_count || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Members Tab */}
       {activeTab === 'members' && (
         <div className="space-y-5">
           {/* Top Contributors Leaderboard */}
           <MemberLeaderboard members={members} posts={posts} />

           {members.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10 rounded-xl"
                  placeholder="Search by name, title, or organization..."
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                />
                {memberSearch && (
                  <button onClick={() => setMemberSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Select value={memberFilter} onValueChange={setMemberFilter}>
                <SelectTrigger className="w-40 rounded-xl">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(() => {
            const filteredMembers = members.filter(m => {
              const q = memberSearch.toLowerCase();
              const matchSearch = !q ||
                m.user_name?.toLowerCase().includes(q) ||
                m.user_title?.toLowerCase().includes(q) ||
                m.user_organization?.toLowerCase().includes(q);
              const matchRole = memberFilter === 'all' || m.role === memberFilter;
              return matchSearch && matchRole;
            });

            if (members.length === 0) return (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No members yet. Be the first to join!</p>
                {!isJoined && (
                  <Button onClick={() => joinMutation.mutate()} className="mt-4 bg-black text-white rounded-xl">
                    Join this Community
                  </Button>
                )}
              </div>
            );

            if (filteredMembers.length === 0) return (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No members match your search.</p>
                <button onClick={() => { setMemberSearch(''); setMemberFilter('all'); }} className="text-sm text-black underline mt-2">Clear filters</button>
              </div>
            );

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}