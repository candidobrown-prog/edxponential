import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');

    // Get authenticated user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const ghUser = await userRes.json();

    // Get all repos (up to 100)
    const reposRes = await fetch('https://api.github.com/user/repos?per_page=100&sort=pushed', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) {
      console.error('Repos error:', repos);
      return Response.json({ prs: [], repos: [], ghUser });
    }

    // Fetch open PRs for each repo (in parallel, limit to 30 repos)
    const activeRepos = repos.slice(0, 30);
    const prResults = await Promise.all(
      activeRepos.map(async (repo) => {
        const prsRes = await fetch(
          `https://api.github.com/repos/${repo.full_name}/pulls?state=open&per_page=20`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          }
        );
        const prs = await prsRes.json();
        if (!Array.isArray(prs)) return [];
        return prs.map((pr) => ({
          id: pr.id,
          number: pr.number,
          title: pr.title,
          state: pr.state,
          draft: pr.draft,
          repo: repo.full_name,
          repo_url: repo.html_url,
          author: pr.user?.login,
          author_avatar: pr.user?.avatar_url,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
          url: pr.html_url,
          base_branch: pr.base?.ref,
          head_branch: pr.head?.ref,
          comments: pr.comments,
          review_comments: pr.review_comments,
          commits: pr.commits,
          additions: pr.additions,
          deletions: pr.deletions,
          changed_files: pr.changed_files,
          labels: pr.labels?.map((l) => ({ name: l.name, color: l.color })) || [],
          reviewers: pr.requested_reviewers?.map((r) => r.login) || [],
        }));
      })
    );

    const prs = prResults.flat().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return Response.json({ prs, ghUser, total: prs.length });
  } catch (error) {
    console.error('getActivePullRequests error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});