#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

function git(args, fallback) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const actor = process.env.GITHUB_ACTOR || git(["config", "user.name"], "Unknown Survivor");
const repo = process.env.GITHUB_REPOSITORY || "local/ritual";
const sha = (process.env.GITHUB_SHA || git(["rev-parse", "HEAD"], "0000000")).slice(0, 12);
const date = new Date().toISOString().slice(0, 10);

mkdirSync("artifacts", { recursive: true });

const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Permanent-Deaht-Git Certificate</title>
<style>
  body {
    margin: 0;
    display: grid;
    min-height: 100vh;
    place-items: center;
    background: #090b0f;
    font-family: Inter, system-ui, sans-serif;
  }
  main {
    width: min(900px, calc(100% - 32px));
    padding: 48px;
    color: #17110d;
    background: #f6efe2;
    border: 10px solid #9d1d16;
    box-shadow: 0 24px 90px rgba(0, 0, 0, 0.55);
  }
  p { color: #53463d; font-size: 20px; }
  h1 { margin: 0 0 24px; font-size: 64px; line-height: 0.95; }
  .kicker { color: #9d1d16; font-weight: 900; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
  .cell { padding-top: 16px; border-top: 1px solid rgba(23, 17, 13, 0.2); }
  strong { display: block; font-size: 22px; }
</style>
<main>
  <p class="kicker">Permanent-Deaht-Git</p>
  <h1>Certificate of Completion</h1>
  <p>This certifies that <strong>${escapeHtml(actor)}</strong> survived the guillotine in <strong>${escapeHtml(repo)}</strong>.</p>
  <div class="grid">
    <div class="cell">Errors<strong>0</strong></div>
    <div class="cell">Mercy<strong>None</strong></div>
    <div class="cell">Commit<strong>${escapeHtml(sha)}</strong></div>
  </div>
  <p>Issued ${escapeHtml(date)}. Ponytail spiritually awarded.</p>
</main>
</html>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#090b0f"/>
  <rect x="70" y="60" width="1060" height="510" rx="8" fill="#f6efe2" stroke="#9d1d16" stroke-width="16"/>
  <text x="110" y="135" fill="#9d1d16" font-family="Arial, sans-serif" font-size="34" font-weight="900">PERMANENT-DEAHT-GIT</text>
  <text x="110" y="245" fill="#17110d" font-family="Arial, sans-serif" font-size="76" font-weight="900">Certificate of Completion</text>
  <text x="110" y="330" fill="#53463d" font-family="Arial, sans-serif" font-size="34">This certifies that ${escapeHtml(actor)} survived the guillotine.</text>
  <text x="110" y="430" fill="#17110d" font-family="Arial, sans-serif" font-size="30" font-weight="700">Errors: 0</text>
  <text x="430" y="430" fill="#17110d" font-family="Arial, sans-serif" font-size="30" font-weight="700">Mercy: None</text>
  <text x="760" y="430" fill="#17110d" font-family="Arial, sans-serif" font-size="30" font-weight="700">Commit: ${escapeHtml(sha)}</text>
  <text x="110" y="515" fill="#9d1d16" font-family="Arial, sans-serif" font-size="28" font-weight="900">Survive the workflow. Earn the ponytail.</text>
</svg>`;

writeFileSync("artifacts/certificate.html", html);
writeFileSync("artifacts/certificate.svg", svg);

console.log("Certificate minted in artifacts/");

