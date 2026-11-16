import { ActiveQuery } from "https://cdn.jsdelivr.net/gh/ActiveQuery/JS@adb1b19770ca68840dc2f9e62de556a324bee2fa/ActiveQuery.js";
// AQJS DOM selection and Window.on handle the live viewport readout.
const aq = new ActiveQuery("");
const output = aq.DOM("#viewport-label");
const update = () => output.setText(`Viewport: ${window.innerWidth} × ${window.innerHeight}px`);
update();
window.on("resize", update);
