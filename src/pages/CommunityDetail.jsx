import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Globe, Lock, MessageSquare, Heart, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function CommunityDetail() {
  const communityId = window.location.pathname.split('/').pop();
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('discussion');
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

  const community = communities.find(c => c.id === communityId);

  const createPostMutation = useMutation({
    mutationFn: (data) => base44.entities.CommunityPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      setNewPost('');
      setPostType('discussion');
    },
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

  const postTypeStyles = {
    discussion: 'bg-blue-50 text-blue-700',
    question: 'bg-purple-50 text-purple-700',
    resource: 'bg-green-50 text-green-700',
    announcement: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="space-y-8">
      <Link to="/communities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Communities
      </Link>

      {/* Header */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent" />
        <div className="p-8 -mt-8">
          <div className="flex items-end gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold">{community.name}</h1>
            <VisibilityIcon className="w-4 h-4 text-muted-foreground mb-1" />
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">{community.description}</p>
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="outline" className="capitalize">{community.category?.replace(/_/g, ' ')}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {community.member_count || 0} members
            </span>
          </div>
        </div>
      </div>

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
            className="bg-primary hover:bg-primary/90 rounded-xl gap-2"
          >
            <Send className="w-4 h-4" />
            Post
          </Button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No posts yet. Start the conversation!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-primary text-sm">
                    {post.author_name?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{post.author_name}</span>
                    <Badge className={`text-xs ${postTypeStyles[post.post_type] || ''}`}>
                      {post.post_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.created_date ? format(new Date(post.created_date), 'MMM d, h:mm a') : ''}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary transition-colors">
                      <Heart className="w-3.5 h-3.5" /> {post.likes_count || 0}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> {post.replies_count || 0}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}