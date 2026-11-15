import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  GitPullRequest, RefreshCw, ExternalLink, MessageSquare,
  GitCommit, FileCode, Plus, Minus, Clock, User, Tag,
  AlertCircle, CheckCircle2, GitBranch, Search, Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LABEL_COLORS = {
  bug: 'bg-red-100 text-red-700',
  enhancement: 'bg-blue-100 text-blue-700',
  documentation: 'bg-yellow-100 text-yellow-700',
  default: 'bg-gray-100 text-gray-700',
};

function getLabelClass(color) {
  // color is a hex like 'd73a4a'
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-gray-800' : 'text-white';
}

function PRCard({ pr }) {
  const age = formatDistanceToNow(new Date(pr.created_at), { addSuffix: true });
  const updated = formatDistanceToNow(new Date(pr.updated_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${pr.draft ? 'bg-gray-100' : 'bg-green-100'}`}>
            {pr.draft
              ? <GitPullRequest className="w-3.5 h-3.5 text-gray-500" />
              : <GitPullRequest className="w-3.5 h-3.5 text-green-600" />
            }
          </div>
          <div className="min-w-0">
            <a
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
            >
              {pr.title}
            </a>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="font-medium text-gray-600">{pr.repo}</span>
              {' '}· #{pr.number}
            </p>
          </div>
        </div>
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
        </a>
      </div>

      {/* Branch info */}
      <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
        <GitBranch className="w-3 h-3" />
        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{pr.head_branch}</span>
        <span>→</span>
        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{pr.base_branch}</span>
        {pr.draft && (
          <span className="ml-1 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold">Draft</span>
        )}
      </div>

      {/* Labels */}
      {pr.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pr.labels.map((label) => (
            <span
              key={label.name}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getLabelClass(label.color)}`}
              style={{ backgroundColor: `#${label.color}` }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-3 flex-wrap">
        <div className="flex items-center gap-1">
          <img src={pr.author_avatar} alt={pr.author} className="w-4 h-4 rounded-full" />
          <span>{pr.author}</span>
        </div>
        {pr.commits > 0 && (
          <div className="flex items-center gap-1">
            <GitCommit className="w-3 h-3" />
            <span>{pr.commits} commits</span>
          </div>
        )}
        {(pr.additions > 0 || pr.deletions > 0) && (
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-medium">+{pr.additions}</span>
            <span className="text-red-500 font-medium">-{pr.deletions}</span>
          </div>
        )}
        {pr.changed_files > 0 && (
          <div className="flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            <span>{pr.changed_files} files</span>
          </div>
        )}
        {(pr.comments + pr.review_comments) > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{pr.comments + pr.review_comments}</span>
          </div>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          <span>opened {age}</span>
        </div>
      </div>

      {/* Reviewers */}
      {pr.reviewers.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
          <User className="w-3 h-3" />
          <span>Reviewers: {pr.reviewers.join(', ')}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function GitHubPRDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [repoFilter, setRepoFilter] = useState('all');
  const [showDrafts, setShowDrafts] = useState(true);

  const fetchPRs = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke('getActivePullRequests', {});
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchPRs(); }, []);

  const prs = data?.prs || [];
  const repos = [...new Set(prs.map((p) => p.repo))].sort();

  const filtered = prs.filter((pr) => {
    const matchSearch = !search || pr.title.toLowerCase().includes(search.toLowerCase()) || pr.author.toLowerCase().includes(search.toLowerCase()) || pr.repo.toLowerCase().includes(search.toLowerCase());
    const matchRepo = repoFilter === 'all' || pr.repo === repoFilter;
    const matchDraft = showDrafts || !pr.draft;
    return matchSearch && matchRepo && matchDraft;
  });

  const draftCount = prs.filter((p) => p.draft).length;
  const readyCount = prs.filter((p) => !p.draft).length;

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <GitPullRequest className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pull Request Dashboard</h1>
              {data?.ghUser && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <img src={data.ghUser.avatar_url} alt="" className="w-4 h-4 rounded-full" />
                  {data.ghUser.login}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={fetchPRs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Open</p>
              <p className="text-3xl font-bold text-gray-900">{prs.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200 bg-green-50">
              <p className="text-xs text-green-700 uppercase tracking-wide font-semibold mb-1">Ready for Review</p>
              <p className="text-3xl font-bold text-green-700">{readyCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Drafts</p>
              <p className="text-3xl font-bold text-gray-400">{draftCount}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && !error && prs.length > 0 && (
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PRs, authors, repos…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <select
              value={repoFilter}
              onChange={(e) => setRepoFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Repos ({repos.length})</option>
              {repos.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDrafts}
                onChange={(e) => setShowDrafts(e.target.checked)}
                className="rounded"
              />
              Show Drafts
            </label>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Fetching pull requests…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && prs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <p className="text-lg font-semibold text-gray-700">All clear!</p>
            <p className="text-sm text-gray-400">No open pull requests found across your repositories.</p>
          </div>
        )}

        {/* PR List */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((pr, i) => (
              <motion.div key={pr.id} transition={{ delay: i * 0.03 }}>
                <PRCard pr={pr} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && prs.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No PRs match your filters.</div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Showing {filtered.length} of {prs.length} open pull requests
          </p>
        )}
      </div>
    </div>
  );
}