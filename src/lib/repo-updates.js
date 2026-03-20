import { localizedCases } from "../data/cases";

const repoCaseSource = localizedCases.ptBR;
const githubRepoGroups = repoCaseSource.reduce((groups, item) => {
  const existingRepos = groups[item.owner] ?? [];

  if (!existingRepos.includes(item.repo)) {
    groups[item.owner] = [...existingRepos, item.repo];
  }

  return groups;
}, {});

export function createRepoUpdateMap(defaultValue = null) {
  return repoCaseSource.reduce((repoUpdates, item) => {
    repoUpdates[`${item.owner}/${item.repo}`] = defaultValue;
    return repoUpdates;
  }, {});
}

function normalizeRepoUpdates(rawUpdates = {}) {
  const normalizedUpdates = createRepoUpdateMap();

  repoCaseSource.forEach((item) => {
    const key = `${item.owner}/${item.repo}`;
    normalizedUpdates[key] = rawUpdates[key] ?? null;
  });

  return normalizedUpdates;
}

export async function fetchLiveRepoUpdates(signal) {
  const ownerEntries = Object.entries(githubRepoGroups);
  const repoUpdatesByOwner = await Promise.all(
    ownerEntries.map(async ([owner, repos]) => {
      const response = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&type=owner`, {
        cache: "no-store",
        signal,
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error(`github_repos_unavailable:${owner}`);
      }

      const payload = await response.json();
      const repoSet = new Set(repos);

      return payload.reduce((ownerUpdates, repo) => {
        if (repoSet.has(repo.name)) {
          ownerUpdates[`${owner}/${repo.name}`] = repo.pushed_at ?? null;
        }

        return ownerUpdates;
      }, {});
    }),
  );

  return normalizeRepoUpdates(Object.assign({}, ...repoUpdatesByOwner));
}

export async function fetchSnapshotRepoUpdates(repoUpdatesUrl, signal) {
  const response = await fetch(repoUpdatesUrl, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("repo_updates_unavailable");
  }

  const payload = await response.json();
  return normalizeRepoUpdates(payload?.repos);
}
