// Load the extra phone apps and offline dialogue after the inline UI is ready. Live replies come from /api/alfie (alfie-live.js).
window.STORY_API_URL = '';
window.STORY_MESSAGE_API_URL = '';
document.addEventListener('DOMContentLoaded', () => {
  // async=false keeps them running in this order (the Chapters app needs its arcs; the feed needs the apps).
  ['story-engine.js', 'phone-enhancer.js', 'story-arcs.js', 'chapters.js', 'phone-pulse.js'].forEach((file) => {
    const script = document.createElement('script');
    script.src = `./${file}`;
    script.async = false;
    document.body.appendChild(script);
  });
}, { once: true });
