# Alfie's iPhone 17 — Interactive AU Story

A responsive, clickable fictional iPhone for Alphonse “Alfie” Benjamin Summers, a 16-year-old Canadian-American actor and Starlight Performing Arts High School sophomore in New York. Open `index.html` directly, or host it through GitHub Pages or any static front-end host.

## Screen lock

The phone has a story lock that unlocks with the passcode `2106`, which is the date of his birthday in the AU.

## Live AI option

This project includes a secure backend endpoint pattern for a live AI model, without exposing an API key in the frontend. The safe flow is:

- front-end calls a backend endpoint like `/api/message` or `/api/story`
- backend holds the AI key in a secret environment variable
- frontend only sees the response text from the server

The repo includes a Cloudflare Worker example (`worker.js` + `wrangler.toml`) so you can deploy the backend separately, keep the key private, and let the phone refresh every five minutes with new story text.

## Local fallback

If no backend is configured, the app uses locally authored in-character responses for Alfie and the supporting cast. That keeps the experience immersive, private, and fully functional while you are setting up the live AI side.

## Deployment

1. Deploy the Worker with Wrangler.
2. Set `OPENAI_API_KEY` as a Worker secret or env variable.
3. Point the frontend to the Worker URL using `window.STORY_API_URL` or by editing the `STORY_API_URL` constant in `index.html`.
4. Publish the static front-end to GitHub Pages or a static host.

The story UI includes Instagram-style app views, Discord, school blog, anonymous forum, contact list, notes, calendar, music, and a reader dialogue system. Everything is fictional and can be edited in `index.html` or in the worker prompt logic.
