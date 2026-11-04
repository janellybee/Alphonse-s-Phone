// Load local features after the phone's inline UI is ready; no live AI endpoint is used.
window.STORY_API_URL = '';
window.STORY_MESSAGE_API_URL = '';
document.addEventListener('DOMContentLoaded', () => {
  ['story-engine.js', 'phone-enhancer.js'].forEach((file) => {
    const script = document.createElement('script');
    script.src = `./${file}`;
    document.body.appendChild(script);
  });
}, { once: true });
