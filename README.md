# Alfie's iPhone 17 — Interactive AU Story

A responsive, clickable fictional iPhone for Alphonse “Alfie” Benjamin Summers, a 16-year-old Canadian-American actor and Starlight Performing Arts High School sophomore in New York. Open `index.html` directly or host it through GitHub Pages or a static front-end host.

## Screen lock

The phone has an in-universe story lock that unlocks with the passcode `2106`, which is the birthday reference for the AU.

## Live AI setup for the real 5-minute updates

This project is prepared for a secure live-AI backend without exposing a secret API key in the browser. The safe pattern is:

- front-end calls a backend endpoint like `/api/message` or `/api/story`
- backend holds the AI key in a secret environment variable
- front-end only sees the response text from the Worker

The repo already includes a Cloudflare Worker scaffold in `worker.js` and `wrangler.toml`.

## Configure the Worker URL

1. Deploy the Worker to Cloudflare:

   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```

2. Set your OpenAI key safely as a secret:

   ```bash
   wrangler secret put OPENAI_API_KEY
   ```

3. Open `config.js` and replace the placeholder URL with your deployed Worker domain.

   Example:

   ```js
   window.STORY_API_URL = 'https://alfie-story-worker.your-name.workers.dev/api/story';
   window.STORY_MESSAGE_API_URL = 'https://alfie-story-worker.your-name.workers.dev/api/message';
   ```

4. Because this is a static page, there is no secret key in the browser. The browser only fetches the backend responses.

## Local fallback

If no backend is configured, the app automatically falls back to locally authored in-character dialogue. That keeps the story playable with no live service required.

## Publishing

1. Publish the front end to GitHub Pages or any static host.
2. Make sure the Cloudflare Worker is live and reachable.
3. Keep the API key secret in the Worker, never in the browser.

The app includes Discord, a Starlight school blog, anonymous forum posts, journal, calendar, music, contacts, and chat. The story is fictional and can be edited directly in `index.html` or the Worker prompt logic.
