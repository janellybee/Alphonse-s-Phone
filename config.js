// Load the extra phone apps and offline dialogue after the inline UI is ready. Live replies come from /api/alfie (alfie-live.js).
window.STORY_API_URL = '';
window.STORY_MESSAGE_API_URL = '';
document.addEventListener('DOMContentLoaded', () => {
  ['story-engine.js', 'phone-enhancer.js'].forEach((file) => {
    const script = document.createElement('script');
    script.src = `./${file}`;
    document.body.appendChild(script);
  });
}, { once: true });
