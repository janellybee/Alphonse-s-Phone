# Story engine update

I prepared `story-engine.js` as a small, local-only enhancement. It answers reader messages/comments using topic-specific character dialogue, avoids repeating a reply until the available lines for that character/topic have been used, and asks for clarification on vague messages rather than guessing. It also appends a different in-world character beat every five minutes; some beats become school-blog entries. It does not replace readers' messages or use a live AI service.

To activate the add-on, include this line immediately before `</body>` in `index.html`, after the existing inline app script:

```html
<script src="./story-engine.js"></script>
```

The repository's `index.html` is large, so I kept this change as a small separate file instead of attempting another full-file replacement. The 2106 lock remains a fictional UI lock, not device security.
