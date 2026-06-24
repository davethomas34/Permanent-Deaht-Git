#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const MAX_FIRST_COMMIT_FILES = 45;
const MAX_COMMIT_FILES = 65;
const MAX_TOTAL_FILES_EARLY = 220;
const MAX_LARGE_FILE_BYTES = 2_000_000;

const bannedPathPatterns = [
  /(^|\/)node_modules\//,
  /(^|\/)\.venv\//,
  /(^|\/)vendor\//,
  /(^|\/)dist\//,
  /(^|\/)build\//,
  /(^|\/)coverage\//,
  /(^|\/)\.next\//,
  /(^|\/)\.turbo\//,
  /(^|\/)\.cache\//
];

const bannedExtensions = [
  ".zip",
  ".tar",
  ".gz",
  ".tgz",
  ".7z",
  ".rar",
  ".sql",
  ".dump",
  ".sqlite",
  ".db"
];

function runGit(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", options.quiet ? "ignore" : "pipe"]
  }).trim();
}

function log(message) {
  console.log(`[guillotine] ${message}`);
}

function fail(message, details = []) {
  console.error("");
  console.error("CODE GUILLOTINE DEPLOYED");
  console.error(message);
  for (const detail of details) {
    console.error(`- ${detail}`);
  }
  console.error("");
  console.error("Commit failed. 0 survivors.");
  console.error("No real local files were harmed. In GitHub Actions, only the temporary runner checkout may be erased.");
  process.exit(1);
}

function listTrackedFiles() {
  const output = runGit(["ls-files"], { quiet: true });
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function commitCount() {
  try {
    return Number(runGit(["rev-list", "--count", "HEAD"], { quiet: true }));
  } catch {
    return 0;
  }
}

function filesInCommit(ref) {
  const output = runGit(["diff-tree", "--no-commit-id", "--name-only", "-r", ref], { quiet: true });
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function fileSize(path) {
  try {
    return Number(runGit(["cat-file", "-s", `HEAD:${path}`], { quiet: true }));
  } catch {
    return 0;
  }
}

function hasBannedPath(file) {
  const normalized = file.replace(/\\/g, "/");
  return bannedPathPatterns.some((pattern) => pattern.test(normalized));
}

function hasBannedExtension(file) {
  const lower = file.toLowerCase();
  return bannedExtensions.some((extension) => lower.endsWith(extension));
}

function checkFreshStart(count, files) {
  if (count === 0) {
    log("no commits detected yet; void remains pristine");
    return;
  }

  const firstCommit = runGit(["rev-list", "--max-parents=0", "HEAD"], { quiet: true }).split(/\r?\n/)[0];
  const firstFiles = filesInCommit(firstCommit);

  if (firstFiles.length > MAX_FIRST_COMMIT_FILES) {
    fail("First commit looks like an imported codebase, not a beginning.", [
      `${firstFiles.length} files appeared in the first commit`,
      `limit is ${MAX_FIRST_COMMIT_FILES}`
    ]);
  }

  if (count <= 3 && files.length > MAX_TOTAL_FILES_EARLY) {
    fail("Early repository mass exceeds allowed ritual weight.", [
      `${files.length} tracked files found after ${count} commits`,
      `limit is ${MAX_TOTAL_FILES_EARLY}`
    ]);
  }
}

function checkCommitMass(count) {
  if (count === 0) return;

  const commits = runGit(["rev-list", "HEAD"], { quiet: true }).split(/\r?\n/).filter(Boolean);
  const offenders = commits
    .map((commit) => ({ commit, files: filesInCommit(commit) }))
    .filter((entry) => entry.files.length > MAX_COMMIT_FILES);

  if (offenders.length > 0) {
    fail("A commit tried to carry too much mortal weight.", offenders.slice(0, 5).map((entry) => {
      return `${entry.commit.slice(0, 7)} changed ${entry.files.length} files`;
    }));
  }
}

function checkForbiddenArtifacts(files) {
  const forbidden = files.filter((file) => hasBannedPath(file) || hasBannedExtension(file));
  if (forbidden.length > 0) {
    fail("Forbidden artifacts detected.", forbidden.slice(0, 12));
  }
}

function checkLargeFiles(files) {
  const largeFiles = files
    .map((file) => ({ file, size: fileSize(file) }))
    .filter((entry) => entry.size > MAX_LARGE_FILE_BYTES);

  if (largeFiles.length > 0) {
    fail("Large file offerings rejected by the blade.", largeFiles.slice(0, 12).map((entry) => {
      return `${entry.file} (${entry.size} bytes)`;
    }));
  }
}

function main() {
  if (!existsSync(".git")) {
    fail("This ritual must run inside a Git repository.");
  }

  const count = commitCount();
  const files = listTrackedFiles();

  log("Permanent-Deaht-Git initialized");
  log(`commits detected: ${count}`);
  log(`tracked files detected: ${files.length}`);

  checkFreshStart(count, files);
  checkCommitMass(count);
  checkForbiddenArtifacts(files);
  checkLargeFiles(files);

  log("fresh-start verification passed");
  log("no archive necromancy detected");
  log("blade remains decorative for now");
}

main();

