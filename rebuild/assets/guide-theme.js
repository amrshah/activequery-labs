const toggle = document.querySelector("#theme-toggle");
function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  toggle.setAttribute("aria-pressed", String(dark));
  toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  toggle.textContent = dark ? "Light mode" : "Dark mode";
}
let theme = "light";
try {
  const saved = localStorage.getItem("aq-labs-theme");
  theme = saved === "light" || saved === "dark" ? saved : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch { theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
applyTheme(theme);
toggle.addEventListener("click", () => {
  theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try { localStorage.setItem("aq-labs-theme", theme); } catch {}
});