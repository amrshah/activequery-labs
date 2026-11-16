import { ActiveQuery } from "https://cdn.jsdelivr.net/gh/ActiveQuery/JS@adb1b19770ca68840dc2f9e62de556a324bee2fa/ActiveQuery.js";

// AQJS constructor takes an empty alias here: no window/Element/NodeList alias is installed.
// Importing AQJS still extends native prototypes; see the documented runtime caveats.
const aq = new ActiveQuery("");
const $ = (selector) => aq.DOM(selector);

const tabs = $('[role="tab"]');
const activateTab = (tab, focus = false) => {
  tabs.forEach((item) => {
    const active = item === tab;
    if (active) item.setClasses(["selected"]);
    else item.removeClasses(["selected"]);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
    const panel = $(item.getAttribute("aria-controls"));
    if (panel) panel.hidden = !active;
  });
  if (focus) tab.focus();
};

if (tabs && typeof tabs.forEach === "function") {
  tabs.forEach((tab, index) => {
    tab.on("click", () => activateTab(tab));
    tab.on("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      activateTab(tabs[next], true);
    });
  });
}

const form = $("#demo-form");
if (form) form.on("submit", (event) => {
  event.preventDefault();
  const feedback = $("#form-feedback");
  feedback.textContent = form.reportValidity()
    ? "Form fields are valid (demo only)."
    : "Please correct the highlighted fields.";
});

const toastRegion = $("#toast-region");
const toastTrigger = $("#toast-trigger");
if (toastTrigger) toastTrigger.on("click", () => {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.setAttribute("role", "status");
  toast.textContent = "✓ Your changes have been saved.";
  toastRegion.setContent([]);
  toastRegion.setChild(toast);
});

const dialog = $("#demo-dialog");
const dialogOpen = $("#dialog-open");
if (dialogOpen) dialogOpen.on("click", () => dialog.showModal());
["dialog-close", "dialog-cancel", "dialog-confirm"].forEach((id) => {
  const control = $("#" + id);
  if (control) control.on("click", () => dialog.close());
});

const loadingButton = $("#loading-demo");
if (loadingButton) loadingButton.on("click", () => {
  loadingButton.disabled = true;
  loadingButton.textContent = "Saving…";
  window.setTimeout(() => {
    loadingButton.disabled = false;
    loadingButton.textContent = "Show loading state";
  }, 1100);
});
