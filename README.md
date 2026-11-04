# Story engine and reader interaction

The phone uses local, character-authored dialogue (no live AI or API key). The story engine is loaded automatically by `config.js` after the page UI is ready. It answers reader messages, Ask Alfie questions, school-blog comments, and forum replies with varied dialogue based on the topic. More specific checks (like allergy or anxiety) take priority, so a response is less likely to grab the wrong topic. If a message is vague, Alfie asks for context instead of pretending he understood.

Responses vary and avoid reusing Alfie's last two lines for the same topic. Every five minutes, a new authored story beat is appended to Discord; every third beat also creates a school-blog update. These rotating events include Charlotte, family, co-stars, production staff, fans, the ring mystery, and an antagonist thread. They do not overwrite reader conversations. Since this is static hosting without a model/server, timed updates come from a curated local sequence, not genuinely generated dialogue.

Reader chat and journal content are stored in the browser's local storage. The PIN `2106` is a fictional screen-lock detail, not real device security. To test the timer without waiting, open the browser console and call `window.setInterval` is not a suitable shortcut; temporarily change the `5 * 60 * 1000` interval in `story-engine.js` to a few seconds, then restore it before publishing.

See `index.html`, `config.js`, and `story-engine.js` for the editable story and character dialogue.
