(() => {
  const starters = {
    button: {
      html: '<main class="demo"><p class="eyebrow">COMPONENT EXAMPLE</p><h1>Button states</h1><p>Change the button classes or styles and run the preview.</p><div class="actions"><button class="btn primary">Primary action</button><button class="btn secondary">Secondary</button><button class="btn outline">Outline</button><button class="btn" disabled>Disabled</button></div></main>',
      css: 'body{font-family:system-ui,sans-serif;padding:32px;color:#172235}.demo{max-width:680px;margin:auto}.eyebrow{font-size:11px;letter-spacing:.14em;color:#3158d5;font-weight:700}.actions{display:flex;gap:10px;flex-wrap:wrap}.btn{border:1px solid #cbd3e1;border-radius:8px;padding:11px 16px;background:#fff;color:#26334b;font-weight:650;cursor:pointer}.btn.primary{background:#3158d5;color:#fff;border-color:#3158d5}.btn.secondary{background:#eaf0ff;color:#2546aa;border-color:#eaf0ff}.btn.outline{border-color:#3158d5;color:#3158d5}.btn:hover:not(:disabled){transform:translateY(-1px);filter:brightness(.97)}.btn:disabled{opacity:.45;cursor:not-allowed}',
      js: 'document.querySelectorAll(".btn").forEach(button => { button.addEventListener("click", () => console.log(button.textContent + " clicked")); });'
    },
    card: {
      html: '<main class="layout"><article class="card"><span class="tag">FEATURED</span><h1>Build a better workspace</h1><p>A flexible card layout using verified AQCSS foundations alongside a small amount of component-specific CSS.</p><a href="#">Explore features →</a></article><article class="card muted"><span class="tag">GUIDE</span><h2>Responsive by design</h2><p>Resize the preview or change the grid breakpoint in the CSS.</p><a href="#">Read the guide →</a></article></main>',
      css: 'body{font-family:system-ui,sans-serif;padding:24px;background:#f4f6fa;color:#18243a}.layout{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;max-width:850px;margin:auto}.card{padding:26px;border:1px solid #dce3ee;border-radius:14px;background:white;box-shadow:0 8px 24px #1722350c}.card.muted{background:#edf2ff}.tag{font-size:10px;letter-spacing:.12em;color:#3158d5;font-weight:800}.card h1,.card h2{margin:12px 0;font-size:25px;letter-spacing:-.04em}.card p{color:#627089;line-height:1.6}.card a{color:#3158d5;font-weight:700;text-decoration:none}',
      js: 'console.log("Card example ready");'
    },
    tabs: {
      html: '<main class="demo"><h1>Project settings</h1><div class="tabs" role="tablist"><button class="tab active" role="tab" aria-selected="true" data-tab="general">General</button><button class="tab" role="tab" aria-selected="false" data-tab="security">Security</button><button class="tab" role="tab" aria-selected="false" data-tab="billing">Billing</button></div><section class="tab-panel" id="general" role="tabpanel"><h2>General settings</h2><p>Manage your workspace name and preferences.</p></section><section class="tab-panel" id="security" role="tabpanel" hidden><h2>Security</h2><p>Manage passwords and authentication.</p></section><section class="tab-panel" id="billing" role="tabpanel" hidden><h2>Billing</h2><p>Manage payment methods and invoices.</p></section></main>',
      css: 'body{font-family:system-ui,sans-serif;padding:30px;color:#172235}.demo{max-width:680px;margin:auto}.tabs{display:flex;gap:5px;border-bottom:1px solid #dce2ec}.tab{padding:11px 16px;border:0;background:transparent;color:#68758a;cursor:pointer;border-bottom:2px solid transparent}.tab.active{color:#3158d5;border-color:#3158d5;font-weight:700}.tab:focus-visible{outline:2px solid #3158d5;outline-offset:2px}.tab-panel{padding:18px 4px}',
      js: 'const tabs = [...document.querySelectorAll("[data-tab]")];\ntabs.forEach((tab, index) => {\n  tab.addEventListener("click", () => {\n    tabs.forEach(item => { item.classList.toggle("active", item === tab); item.setAttribute("aria-selected", String(item === tab)); });\n    document.querySelectorAll(".tab-panel").forEach(panel => panel.hidden = panel.id !== tab.dataset.tab);\n  });\n  tab.addEventListener("keydown", event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].focus(); } });\n});'
    },
    aqjs: {
      html: '<main style="font-family:system-ui;padding:28px"><h1>AQJS module starter</h1><p id="aqjs-status">Waiting for the AQJS module…</p><button id="aqjs-check">Check instance</button><p>Open the browser console to inspect the module import and instance.</p></main>',
      css: 'body{color:#172235}button{padding:10px 14px;border-radius:7px;border:1px solid #3158d5;background:#3158d5;color:white;cursor:pointer}',
      js: 'window.addEventListener("load", () => {\n  const status = window.AQ ? window.AQ.DOM("#aqjs-status") : null;\n  if (status) status.textContent = "AQJS loaded. Its instance DOM helper selected this element.";\n});\ndocument.querySelector("#aqjs-check").addEventListener("click", () => {\n  const status = window.AQ ? window.AQ.DOM("#aqjs-status") : null;\n  if (status) status.textContent = "AQJS instance is available. DOM helper returned this element.";\n});'
    }
  };
  const initial = starters.card;
  const fields = {html:document.querySelector("#code-html"),css:document.querySelector("#code-css"),js:document.querySelector("#code-js")};
  const frame = document.querySelector("#preview-frame");
  const status = document.querySelector("#preview-status");
  const dirty = document.querySelector("#dirty-state");
  let active = "html", timer;
  Object.keys(fields).forEach(key => fields[key].value = initial[key]);
  function buildDocument() {
    const aqcss = document.querySelector("#load-aqcss").checked ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ActiveQuery/CSS@main/ActiveQuery.css">' : "";
    const aqjs = document.querySelector("#load-aqjs").checked ? '<script type="module">import { ActiveQuery } from "https://cdn.jsdelivr.net/gh/ActiveQuery/JS@main/ActiveQuery.js"; window.AQ = new ActiveQuery(); window.dispatchEvent(new Event("aqjs-ready"));<\/script>' : "";
    const html = fields.html.value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const css = fields.css.value.replace(/<\/style/gi,"<\\/style");
    const js = fields.js.value.replace(/<\/script/gi,"<\\/script");
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+aqcss+'<style>body{margin:0}'+css+'</style></head><body>'+html+aqjs+'<script type="module">try{'+js+'}catch(error){document.body.insertAdjacentHTML("beforeend", "<pre style=\'white-space:pre-wrap;color:#b42318;padding:12px\'></pre>");document.querySelector("pre").textContent=error.stack||error.message;console.error(error);}<\/script></body></html>';
  }
  function run(){ frame.srcdoc=buildDocument(); status.textContent="Preview updated · "+new Date().toLocaleTimeString(); dirty.textContent="● Synced"; }
  function schedule(){dirty.textContent="● Editing";clearTimeout(timer);timer=setTimeout(run,450);}
  Object.values(fields).forEach(field=>field.addEventListener("input",schedule));
  document.querySelector("#run-code").addEventListener("click",run);
  document.querySelector("#reset-code").addEventListener("click",()=>{Object.keys(fields).forEach(k=>fields[k].value=initial[k]);run();});
  document.querySelectorAll(".editor-tab").forEach(tab=>tab.addEventListener("click",()=>{active=tab.dataset.editor;document.querySelectorAll(".editor-tab").forEach(t=>{const on=t===tab;t.classList.toggle("active",on);t.setAttribute("aria-selected",String(on));});Object.entries(fields).forEach(([key,field])=>field.classList.toggle("hidden",key!==active));}));
  document.querySelectorAll("[data-starter]").forEach(button=>button.addEventListener("click",()=>{const sample=starters[button.dataset.starter];Object.keys(fields).forEach(k=>fields[k].value=sample[k]);if(button.dataset.starter==="aqjs")document.querySelector("#load-aqjs").checked=true;run();}));
  document.querySelectorAll("#load-aqcss,#load-aqjs").forEach(el=>el.addEventListener("change",run));
  document.querySelector("#copy-code").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(fields[active].value);status.textContent=active.toUpperCase()+" copied";}catch{status.textContent="Clipboard unavailable in this context";}});
  document.querySelector("#preview-wide").addEventListener("click",()=>{document.querySelector(".preview-stage").classList.remove("mobile");document.querySelector("#preview-wide").classList.add("active");document.querySelector("#preview-narrow").classList.remove("active");});
  document.querySelector("#preview-narrow").addEventListener("click",()=>{document.querySelector(".preview-stage").classList.add("mobile");document.querySelector("#preview-narrow").classList.add("active");document.querySelector("#preview-wide").classList.remove("active");});
  run();
})();