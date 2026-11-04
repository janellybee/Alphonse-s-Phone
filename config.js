// This project uses its local, character-authored story engine by default.
// Live AI endpoints are intentionally disabled; no API key or external service is used.
window.STORY_API_URL = '';
window.STORY_MESSAGE_API_URL = '';

// Load the local interaction and five-minute story-beat engine after the phone UI.
const storyEngine = document.createElement('script');
storyEngine.src = './story-engine.js';
storyEngine.defer = true;
document.head.appendChild(storyEngine);
