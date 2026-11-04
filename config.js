/* Enable the local character dialogue and timed story beats after the page UI loads. */
(() => {
  const loadStoryEngine = () => {
    if (window.__alfieStoryEngineLoaded) return;
    window.__alfieStoryEngineLoaded = true;
    const script = document.createElement('script');
    script.src = new URL('./story-engine.js', document.currentScript?.src || location.href).href;
    script.onerror = () => { window.__alfieStoryEngineLoaded = false; console.error('Could not load story-engine.js'); };
    document.head.appendChild(script);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStoryEngine, { once: true });
  } else {
    loadStoryEngine();
  }
})();
