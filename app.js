const terminalLines = [
  "$ git push origin main",
  "> Permanent-Deaht-Git initialized",
  "> checking first commit mass...",
  "> scanning for archive necromancy...",
  "> npm run lint --if-present",
  "> npm test --if-present",
  "> npm run build --if-present",
  "> blade status: impatient",
  "> verdict: pending"
];

const deathLines = [
  "Commit failed. 0 survivors.",
  "Mercy request denied by workflow policy.",
  "Temporary runner checkout erased.",
  "Main branch remains pure.",
  "Certificate withheld. Ponytail delayed."
];

const terminalLog = document.querySelector("#terminalLog");
const deathLog = document.querySelector("#deathLog");

function renderTerminal() {
  if (!terminalLog) return;
  terminalLog.textContent = "";
  terminalLines.forEach((line, index) => {
    window.setTimeout(() => {
      terminalLog.textContent += `${line}\n`;
    }, index * 260);
  });
}

function renderDeathLog() {
  if (!deathLog) return;
  deathLog.innerHTML = deathLines.map((line) => `<li>${line}</li>`).join("");
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

renderTerminal();
renderDeathLog();
setupCopyButtons();
setupCertificatePreview();

