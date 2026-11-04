# Alphonse's Phone

A fictional interactive iPhone AU story for Alphonse “Alfie” Summers. Deployed on Netlify. Run locally with `netlify dev` so the live AI function works.

The phone includes Messages, Discord, Starlight blog, forums, Ask Alfie, an integrated Borough Beacon newspaper, an AU Wiki app, Alfie's Corner (his Neocities-style personal blog with a public AMA ask box stored in Netlify Database), and Spotlight, an interactive flipbook-style magazine. Alfie replies live through an AI-powered Netlify Function (`netlify/functions/alfie.mts`, served at `/api/alfie` via Netlify AI Gateway) in Messages, Ask Alfie, Discord, the blog, forums and Beacon comments. He also texts first now and then. If the API can't be reached, short offline lines from `story-engine.js` are used instead. PIN `2106` is fictional UI only.
