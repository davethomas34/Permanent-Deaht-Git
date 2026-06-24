const snippets = {
  workflow: `name: Permanent Deaht Git

on:
  pull_request:
  push:
    branches: [main]

jobs:
  guillotine:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: node scripts/guillotine.mjs
      - run: npm ci
        if: hashFiles('package-lock.json') != ''
      - run: npm install
        if: hashFiles('package.json') != '' && hashFiles('package-lock.json') == ''
      - run: npm run lint --if-present
        if: hashFiles('package.json') != ''
      - run: npm test --if-present
        if: hashFiles('package.json') != ''
      - run: npm run build --if-present
        if: hashFiles('package.json') != ''
      - run: node scripts/certificate.mjs
      - uses: actions/upload-artifact@v4
        with:
          name: survivor-certificate
          path: artifacts/
      - name: Theatrical runner annihilation
        if: failure()
        run: |
          echo "Commit failed. 0 survivors."
          echo "Erasing temporary GitHub Actions runner checkout only."
          find "$GITHUB_WORKSPACE" -mindepth 1 -maxdepth 1 -exec rm -rf {} +`,
  hook: `#!/usr/bin/env bash
# .git/hooks/pre-commit
set -euo pipefail

echo "Arming the guillotine..."

node scripts/guillotine.mjs || {
  echo "Guillotine engaged. Commit rejected."
  echo "0 survivors. The annihilation is theatrical."
  echo "No local files deleted."
  exit 1
}

echo "Survivor detected. Commit permitted."
exit 0`
};

const deathEvents = [
  ["12:41:02", "Commit received: 7f3c9a1", "by @dev-wannabe"],
  ["12:41:05", "Running fresh-start ritual", "Passed"],
  ["12:41:12", "Scanning for archive necromancy", "Passed"],
  ["12:41:18", "Running tests", "Failed"],
  ["12:41:18", "Guillotine engaged", ""],
  ["12:41:19", "Temporary runner checkout erased", ""],
  ["12:41:20", "Main branch remains pure", ""]
];

function renderCode(tabName) {
  const codeBlock = document.querySelector("#codeBlock");
  const lineNumbers = document.querySelector("#lineNumbers");
  if (!codeBlock || !lineNumbers) return;

  const code = snippets[tabName] || snippets.workflow;
  codeBlock.textContent = code;
  lineNumbers.textContent = code
    .split("\n")
    .map((_, index) => String(index + 1))
    .join("\n");
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      renderCode(tab.dataset.tab);
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;

      await navigator.clipboard.writeText(target.textContent.trim());
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1400);
    });
  });
}

function renderDeathLog() {
  const deathLog = document.querySelector("#deathLog");
  if (!deathLog) return;

  deathLog.innerHTML = deathEvents
    .map(([time, message, status]) => {
      const statusHtml = status ? `<strong>${status}</strong>` : "<span></span>";
      return `<li><time>${time}</time><span>${message}</span>${statusHtml}</li>`;
    })
    .join("");
}

function setupCertificatePreview() {
  const form = document.querySelector("#certificateForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const survivor = document.querySelector("#survivorName").value.trim() || "unknown survivor";
    const sha = document.querySelector("#commitSha").value.trim() || "0000000";
    document.querySelector("#certName").textContent = survivor;
    document.querySelector("#certSha").textContent = sha;
  });
}

renderCode("workflow");
renderDeathLog();
setupTabs();
setupCopyButtons();
setupCertificatePreview();
