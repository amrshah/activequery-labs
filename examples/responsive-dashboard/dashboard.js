(() => {
  const output = document.querySelector("#viewport-label");
  if (!output) return;
  const update = () => {
    output.textContent = `Viewport: ${window.innerWidth} × ${window.innerHeight}px`;
  };
  update();
  window.addEventListener("resize", update, { passive: true });
})();