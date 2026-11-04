# Alfie's iPhone 17 — Interactive AU Story

A responsive, clickable fictional iPhone for Alphonse “Alfie” Benjamin Summers, a 16-year-old Canadian-American actor and Starlight Performing Arts High School sophomore in New York. Open `index.html` directly or host it with GitHub Pages; no build step or external dependencies are required.

## Local story interaction

This version intentionally does **not** call a live AI service. `story-engine.js` provides varied, authored, intent-aware dialogue for readers' messages and comments. It recognizes topics like Charlotte, the Summers family, the Stellaris ring, Starlight, production staff and co-stars, fans, antagonists, anxiety, pets, food/allergies, and music. If a message is too vague to answer accurately, Alfie asks for context rather than pretending he understood. Recent answers are tracked locally to reduce back-to-back repetition.

Every five minutes while the page is open, a different authored story beat from characters around Alfie is added to Discord. Some beats also create a school blog update. Reader messages are never overwritten by the periodic story beat. The beat sequence rotates through Charlotte, co-stars, his manager, family, the ring mystery, crew, fans, and the emerging antagonist thread. Since the page is static, this is a scripted story rotation—not live AI or a server-generated update.

Reader chat and journal content are stored in the browser's local storage. The phone lock PIN `2106` is a fictional UI detail, not real device security. `config.js` disables the unused live API endpoints by default and loads the local story engine.

## Explore

Tap the apps to browse Messages, Discord, Calendar, Photos, Music, Journal, the Starlight school blog, anonymous forums, Ask Alfie, Contacts, Clock, Phone, Mail, and About Alfie. All story and character material is fictional and editable in `index.html` and `story-engine.js`.
