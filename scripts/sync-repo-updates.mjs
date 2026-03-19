import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const repoTargets = [
  { owner: "linksites", repo: "linksites" },
  { owner: "linksites", repo: "almeida-cunha" },
  { owner: "linksites", repo: "danilo-souza" },
  { owner: "linksites", repo: "gomes-de-deus" },
  { owner: "linksites", repo: "frigorificocarneboa" },
  { owner: "linksites", repo: "arcadenoe" },
  { owner: "linksites", repo: "democrata" },
  { owner: "linksites", repo: "sergiorodrigues" },
];

const outputPath = resolve("public", "repo-updates.json");
const githubToken = process.env.GITHUB_TOKEN?.trim();

async function readExistingUpdates() {
  try {
    const content = await readFile(outputPath, "utf8");
    const parsed = JSON.parse(content);
    return parsed.repos ?? {};
  } catch {
    return {};
  }
}

async function fetchRepoPushDateViaApi({ owner, repo }) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "linksites-repo-updates-sync",
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} for ${owner}/${repo}`);
  }

  const payload = await response.json();

  if (!payload.pushed_at) {
    throw new Error(`Missing pushed_at for ${owner}/${repo}`);
  }

  return payload.pushed_at;
}

async function fetchRepoPushDateViaGit({ owner, repo }) {
  const remoteUrl = `https://github.com/${owner}/${repo}.git`;
  const tempDir = await mkdtemp(join(tmpdir(), "linksites-repo-"));

  try {
    await execFileAsync(
      "git",
      ["clone", "--quiet", "--depth", "1", "--filter=blob:none", remoteUrl, tempDir],
      { timeout: 120000 },
    );

    const { stdout } = await execFileAsync(
      "git",
      ["-C", tempDir, "log", "-1", "--format=%cI"],
      { timeout: 15000 },
    );

    const commitDate = stdout.trim();

    if (!commitDate) {
      throw new Error(`Missing commit date for ${owner}/${repo}`);
    }

    return commitDate;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function resolveRepoPushDate(target, existingValue) {
  try {
    return await fetchRepoPushDateViaApi(target);
  } catch (apiError) {
    console.warn(`[repo-updates] API fallback for ${target.owner}/${target.repo}: ${apiError.message}`);
  }

  try {
    return await fetchRepoPushDateViaGit(target);
  } catch (gitError) {
    console.warn(`[repo-updates] Git fallback failed for ${target.owner}/${target.repo}: ${gitError.message}`);
  }

  return existingValue ?? null;
}

async function main() {
  const existingUpdates = await readExistingUpdates();
  const repoUpdates = {};

  for (const target of repoTargets) {
    const key = `${target.owner}/${target.repo}`;
    repoUpdates[key] = await resolveRepoPushDate(target, existingUpdates[key]);
  }

  await mkdir(resolve("public"), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        repos: repoUpdates,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`[repo-updates] Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error("[repo-updates] Failed to generate repo-updates.json");
  console.error(error);
  process.exitCode = 1;
});
