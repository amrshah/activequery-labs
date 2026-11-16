const $ = (selector) => document.querySelector(selector);

const themeToggle = $("#theme-toggle");
function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
}
let preferredTheme = "light";
try {
  const savedTheme = localStorage.getItem("aq-labs-theme");
  preferredTheme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch {
  preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(preferredTheme);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try { localStorage.setItem("aq-labs-theme", nextTheme); } catch { /* Theme still works for this page session. */ }
});

const initialExample = {
  html: `<section class="demo-wrap">
  <div class="demo-intro">
    <span class="demo-kicker">AQCSS + AQJS / LIVE EXAMPLE</span>
    <h2>Build a useful interface from verified contracts.</h2>
    <p>This card uses AQCSS for its flex foundation and AQJS for the click handler.</p>
  </div>
  <div class="demo-layout aq-flexon aq-flexon--row">
    <article class="demo-card aq--padding-all" id="demo-card">
      <span class="demo-chip">SOURCE-GROUNDED</span>
      <h3>Component preview</h3>
      <p>Change the HTML, CSS or JavaScript in the editor to explore the result.</p>
      <button class="demo-button" id="toggle-details" type="button">Toggle details</button>
      <p class="demo-details" id="demo-details">The event is registered through ActiveQuery's Element.on helper.</p>
    </article>
    <aside class="demo-aside">
      <strong>Known limitation</strong>
      <p>The AQCSS third-width facet is 3.33333%, not one third. This example uses a flex layout instead.</p>
      <span class="demo-aside-foot">Evidence lives in the knowledgebase.</span>
    </aside>
  </div>
</section>`,
  css: `.demo-wrap { max-width: 760px; margin: 0 auto; padding: 26px; color: #17263d; font-family: system-ui, sans-serif; }
.demo-intro { margin-bottom: 22px; }
.demo-kicker { color: #087f75; font-size: 10px; font-weight: 800; letter-spacing: .14em; }
.demo-intro h2 { margin: 10px 0; font-size: clamp(22px, 4vw, 32px); line-height: 1.15; }
.demo-intro p, .demo-card p, .demo-aside p { color: #607087; line-height: 1.65; font-size: 13px; }
.demo-layout { align-items: stretch; gap: 14px; }
.demo-card { flex: 1.3; min-width: 0; border: 1px solid #dfe7ef; border-radius: 12px; background: #fff; box-shadow: 0 12px 32px rgba(21,34,56,.08); }
.demo-chip { display: inline-block; padding: 5px 8px; border-radius: 20px; background: #e8faf7; color: #087f75; font-size: 9px; font-weight: 800; letter-spacing: .08em; }
.demo-card h3 { margin: 14px 0 5px; font-size: 20px; }
.demo-button { border: 0; border-radius: 7px; padding: 10px 13px; background: #12243b; color: white; font-weight: 700; cursor: pointer; }
.demo-button:focus-visible { outline: 3px solid #0b8f83; outline-offset: 3px; }
.demo-details { display: none; padding-top: 10px; border-top: 1px solid #e5ebf2; }
.demo-details.is-open { display: block; }
.demo-aside { flex: .8; padding: 18px; border-radius: 12px; background: #edf3f8; }
.demo-aside strong { font-size: 13px; }
.demo-aside-foot { color: #74849a; font-size: 10px; }
@media (max-width: 620px) {
  .demo-wrap { padding: 18px; }
  .demo-layout { flex-direction: column; }
}`,
  js: `const toggle = ActiveQueryRuntime.DOM("#toggle-details");
const details = ActiveQueryRuntime.DOM("#demo-details");

toggle.on("click", () => {
  details.toggleClasses("is-open");
  parent.postMessage({ type: "demo-event", open: true }, "*");
});`
};

let example = { ...initialExample };
let activeTab = "html";
let runtimeAssets = null;
let frameReady = false;
let frameworkLoadStarted = false;
let licenseAccepted = false;
let latestToken = 0;
let debounceHandle = 0;

const editor = $("#source-editor");
const preview = $("#live-preview");
const previewStatus = $("#preview-status");
const licenseCheckbox = $("#license-consent");
const licenseAcceptButton = $("#accept-license");
const licenseStatus = $("#license-consent-status");
const licenseConsentKey = "aq-labs-osl-3.0-assent-v1";
const editorStatus = $("#editor-status");
const editorLabel = $("#editor-label");
const tabButtons = [...document.querySelectorAll("[data-editor-tab]")];

function setPreviewStatus(message) {
  previewStatus.textContent = message;
}

function saveActiveEditor() {
  example[activeTab] = editor.value;
}

function selectTab(tab, focusEditor = true) {
  saveActiveEditor();
  activeTab = tab;
  editor.value = example[tab];
  editorLabel.textContent = tab === "js" ? "JavaScript source" : tab.toUpperCase() + " source";
  editorStatus.textContent = tab.toUpperCase() + " editor selected";
  for (const button of tabButtons) {
    const selected = button.dataset.editorTab === tab;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  if (focusEditor) editor.focus();
  else tabButtons.find((button) => button.dataset.editorTab === tab)?.focus();
}

async function loadPinnedAssets() {
  const [cssResponse, jsResponse] = await Promise.all([
    fetch("./vendor/ActiveQuery.css", { cache: "no-store" }),
    fetch("./vendor/ActiveQuery.js", { cache: "no-store" })
  ]);
  if (!cssResponse.ok || !jsResponse.ok) {
    throw new Error("Pinned AQCSS/AQJS files are not staged. Run npm run sources:fetch before previewing locally.");
  }
  const [aqcss, aqjs] = await Promise.all([cssResponse.text(), jsResponse.text()]);
  return { aqcss, aqjs };
}

function createPreviewDocument() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style id="aqcss"></style>
<style id="user-css"></style>
</head>
<body>
<div id="mount"></div>
<script>
  window.addEventListener("error", (event) => {
    parent.postMessage({ type: "preview-error", message: event.message || "Preview script error" }, "*");
  });

  window.addEventListener("aqjs-ready", () => {
    window.__aqRuntimeReady = true;
    render(window.__aqPendingPayload);
  });

  function render(payload) {
    const mount = document.getElementById("mount");
    mount.innerHTML = payload.html;
    document.getElementById("user-css").textContent = payload.css;
    document.getElementById("user-js")?.remove();
    const userScript = document.createElement("script");
    userScript.id = "user-js";
    userScript.textContent = payload.js;
    document.body.appendChild(userScript);
    parent.postMessage({
      type: "rendered",
      token: payload.token,
      textLength: mount.textContent.length
    }, "*");
  }

  window.addEventListener("message", (event) => {
    const payload = event.data;
    if (!payload) return;
    if (payload.type === "simulate-click") {
      document.getElementById("toggle-details")?.click();
      return;
    }
    if (payload.type !== "render") return;
    document.getElementById("aqcss").textContent = payload.aqcss;
    document.getElementById("user-css").textContent = payload.css;

    if (window.__aqRuntimeReady) {
      render(payload);
      return;
    }

    window.__aqPendingPayload = payload;
    if (window.__aqRuntimeLoading) return;
    window.__aqRuntimeLoading = true;

    const runtime = document.createElement("script");
    runtime.type = "module";
    runtime.textContent = payload.aqjs + "\\nwindow.ActiveQueryRuntime = ActiveQuery;\\nwindow.dispatchEvent(new Event('aqjs-ready'));";
    runtime.onerror = () => parent.postMessage({ type: "preview-error", message: "AQJS module could not be initialized" }, "*");
    document.head.appendChild(runtime);
  });

  parent.postMessage({ type: "ready" }, "*");
<\/script>
</body>
</html>`;
}

function renderPreview() {
  saveActiveEditor();
  if (!frameReady || !runtimeAssets) return;
  const token = ++latestToken;
  setPreviewStatus("Updating isolated preview…");
  preview.contentWindow.postMessage({
    type: "render",
    token,
    html: example.html,
    css: example.css,
    js: example.js,
    aqcss: runtimeAssets.aqcss,
    aqjs: runtimeAssets.aqjs
  }, "*");
}

function schedulePreview() {
  saveActiveEditor();
  window.clearTimeout(debounceHandle);
  debounceHandle = window.setTimeout(renderPreview, 250);
}

for (const button of tabButtons) {
  button.tabIndex = button.getAttribute("aria-selected") === "true" ? 0 : -1;
  button.addEventListener("click", () => selectTab(button.dataset.editorTab));
  button.addEventListener("keydown", (event) => {
    const currentIndex = tabButtons.indexOf(button);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabButtons.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabButtons.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabButtons[nextIndex].dataset.editorTab, false);
  });
}

editor.addEventListener("input", schedulePreview);
$("#run-preview").addEventListener("click", renderPreview);
$("#trigger-preview-event").addEventListener("click", () => {
  if (!frameReady) {
    setPreviewStatus("Preview is not ready yet");
    return;
  }
  preview.contentWindow.postMessage({ type: "simulate-click" }, "*");
});

$("#reset-example").addEventListener("click", () => {
  example = { ...initialExample };
  editor.value = example[activeTab];
  editorStatus.textContent = "Example reset";
  renderPreview();
});

editor.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    renderPreview();
  }
});

window.addEventListener("message", (event) => {
  if (event.source !== preview.contentWindow || !event.data) return;
  const message = event.data;
  if (message.type === "ready") {
    frameReady = true;
    renderPreview();
  } else if (message.type === "rendered" && message.token === latestToken) {
    preview.dataset.previewVersion = String(message.token);
    preview.dataset.previewTextLength = String(message.textLength);
    setPreviewStatus("Preview updated · revision " + message.token);
  } else if (message.type === "demo-event") {
    setPreviewStatus(message.open ? "AQJS event helper ran · details toggled" : "AQJS event helper ran");
  } else if (message.type === "preview-error") {
    setPreviewStatus("Preview error · " + message.message);
  }
});

editor.value = example[activeTab];
preview.srcdoc = createPreviewDocument();

function startFrameworkPreview() {
  if (frameworkLoadStarted) return;
  frameworkLoadStarted = true;
  setPreviewStatus("Loading the pinned AQCSS/AQJS assets…");
  loadPinnedAssets()
    .then((assets) => {
      runtimeAssets = assets;
      licenseStatus.textContent = "OSL-3.0 assent recorded in this browser. The pinned framework preview is enabled.";
      if (frameReady) renderPreview();
    })
    .catch((error) => {
      frameworkLoadStarted = false;
      setPreviewStatus(error.message);
      licenseStatus.textContent = "License assent is recorded, but the pinned framework assets could not be loaded.";
    });
}

let priorConsent = null;
try { priorConsent = localStorage.getItem(licenseConsentKey); } catch { /* Consent can still be recorded for this page session. */ }
if (priorConsent === "accepted") {
  licenseAccepted = true;
  licenseCheckbox.checked = true;
  licenseCheckbox.disabled = true;
  licenseAcceptButton.disabled = true;
  licenseAcceptButton.textContent = "Accepted · preview enabled";
  licenseStatus.textContent = "OSL-3.0 assent was previously recorded in this browser.";
  startFrameworkPreview();
} else {
  setPreviewStatus("Accept the OSL-3.0 terms in the licensing section to load framework assets.");
  licenseStatus.textContent = "The playground is locked until you review and accept the upstream license terms.";
}

licenseCheckbox.addEventListener("change", () => {
  licenseAcceptButton.disabled = !licenseCheckbox.checked;
});

licenseAcceptButton.addEventListener("click", () => {
  if (!licenseCheckbox.checked || licenseAccepted) return;
  licenseAccepted = true;
  try { localStorage.setItem(licenseConsentKey, "accepted"); } catch { /* The acceptance remains active for this page session. */ }
  licenseCheckbox.disabled = true;
  licenseAcceptButton.disabled = true;
  licenseAcceptButton.textContent = "Accepted · loading preview…";
  licenseStatus.textContent = "OSL-3.0 assent recorded in this browser. Loading pinned framework assets…";
  startFrameworkPreview();
});
