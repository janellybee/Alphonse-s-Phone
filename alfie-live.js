/* Live Alfie: AI-powered replies for Messages, Ask Alfie, Discord, the blog, forums and the Beacon.
   Talks to the /api/alfie Netlify Function; falls back to local lines from story-engine.js if offline. */
(() => {
  'use strict';
  const API = '/api/alfie';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const isVisible = (id) => $(`#view-${id}`)?.classList.contains('active');
  const isLocked = () => $('#lock-screen')?.classList.contains('show');

  const offlineLine = (text) =>
    typeof window.localReply === 'function' ? window.localReply(text) : 'sorry my phone is being weird rn, give me a sec';

  async function ask(channel, text = '', { history, context } = {}) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, text, history, context })
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      if (!data.reply) throw new Error('empty reply');
      return data.reply;
    } catch (error) {
      console.warn('Live Alfie unavailable, using local reply.', error);
      return null;
    }
  }

  // Typing time that roughly tracks message length, so replies don't land instantly.
  const typingDelay = (text) => clamp(320 + text.length * 32, 650, 2400);

  /* ---------- Notifications (iOS-style banner + unread badges) ---------- */
  const screen = $('.screen');
  const banner = document.createElement('button');
  banner.className = 'notif-banner';
  banner.type = 'button';
  banner.innerHTML = '<span class="notif-icon">💬</span><span class="notif-body"><b class="notif-title"></b><span class="notif-text"></span></span><span class="notif-time">now</span>';
  screen?.appendChild(banner);
  let bannerTimer;
  function notify(title, text, app) {
    banner.querySelector('.notif-title').textContent = title;
    banner.querySelector('.notif-text').textContent = text;
    banner.dataset.app = app;
    banner.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => banner.classList.remove('show'), 4200);
  }
  banner.addEventListener('click', () => {
    banner.classList.remove('show');
    if (!isLocked() && typeof window.openApp === 'function') window.openApp(banner.dataset.app || 'messages');
  });

  let unread = 0;
  function setBadge(count) {
    unread = count;
    $$('[data-app="messages"] .icon-tile').forEach((tile) => {
      let badge = tile.querySelector('.badge');
      if (!badge) { badge = document.createElement('span'); badge.className = 'badge'; tile.appendChild(badge); }
      badge.textContent = String(count);
      badge.hidden = count < 1;
    });
  }

  /* ---------- Messages (private thread with Alfie) ---------- */
  const CHAT_KEY = 'alfie-chat-v2';
  const SEED = [
    { from: 'them', text: 'ok so i spilled coffee on my script' },
    { from: 'them', text: 'the whole second act is just brown now' },
    { from: 'me', text: 'how did you even manage that' },
    { from: 'them', text: 'i was holding it, the coffee, AND my phone. on the subway. bad plan' }
  ];
  const list = $('#chat-list');
  const chatScroller = list?.closest('.app-content');
  let thread = loadThread();

  function loadThread() {
    try {
      const saved = JSON.parse(localStorage.getItem(CHAT_KEY) || 'null');
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (_) {}
    return SEED.map((m) => ({ ...m, at: Date.now() - 20 * 60 * 1000 }));
  }
  const saveThread = () => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(thread.slice(-120))); } catch (_) {} };
  const scrollChat = () => { if (chatScroller) chatScroller.scrollTop = chatScroller.scrollHeight; };

  function addBubble(from, text) {
    const d = document.createElement('div');
    d.className = `bubble ${from}`;
    d.textContent = text;
    list.appendChild(d);
    scrollChat();
    return d;
  }
  function showTyping() {
    const d = document.createElement('div');
    d.className = 'bubble them typing';
    d.setAttribute('aria-label', 'Alfie is typing');
    d.innerHTML = '<span></span><span></span><span></span>';
    list.appendChild(d);
    scrollChat();
    return d;
  }
  function renderThread() {
    if (!list) return;
    list.innerHTML = '';
    thread.forEach((m) => addBubble(m.from, m.text));
  }

  // Queue so replies never interleave, even when the user double-texts.
  let queue = Promise.resolve();
  const enqueue = (task) => (queue = queue.then(task).catch((e) => console.warn(e)));

  async function deliver(reply, { proactive = false } = {}) {
    const lines = reply.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 4);
    for (const line of lines) {
      const typing = showTyping();
      await sleep(typingDelay(line));
      typing.remove();
      thread.push({ from: 'them', text: line, at: Date.now() });
      saveThread();
      addBubble('them', line);
      if (!isVisible('messages')) {
        setBadge(unread + 1);
        notify('Alfie 🎭', line, 'messages');
      } else if (proactive && document.visibilityState !== 'visible') {
        setBadge(unread + 1);
      }
      await sleep(250);
    }
  }

  async function respond() {
    // Everything the user sent since Alfie last spoke is answered together, like a real reply.
    let i = thread.length;
    while (i > 0 && thread[i - 1].from === 'me') i--;
    const pending = thread.slice(i).map((m) => m.text);
    if (!pending.length) return;
    const history = thread.slice(Math.max(0, i - 16), i).map((m) => ({ role: m.from === 'me' ? 'user' : 'assistant', text: m.text }));
    await sleep(500 + Math.random() * 700); // "read" pause
    const typing = showTyping();
    const reply = await ask('dm', pending.join('\n'), { history });
    typing.remove();
    await deliver(reply || offlineLine(pending[pending.length - 1]));
  }

  let respondTimer;
  $('#message-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#message-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    thread.push({ from: 'me', text, at: Date.now() });
    saveThread();
    addBubble('me', text);
    lastActivity = Date.now();
    clearTimeout(respondTimer);
    respondTimer = setTimeout(() => enqueue(respond), 900);
  });

  $('#reset-chat')?.addEventListener('click', () => {
    thread = SEED.map((m) => ({ ...m, at: Date.now() }));
    saveThread();
    renderThread();
    window.toast?.('Chat reset');
  });

  // Clear the badge when Messages opens.
  const messagesView = $('#view-messages');
  if (messagesView) {
    new MutationObserver(() => { if (isVisible('messages')) { setBadge(0); scrollChat(); } })
      .observe(messagesView, { attributes: true, attributeFilter: ['class'] });
  }

  /* Alfie texts first now and then, like a real friend. Capped per visit to stay sensible. */
  let lastActivity = Date.now();
  let proactiveSent = 0;
  const PROACTIVE_LIMIT = 4;
  async function maybeTextFirst() {
    if (proactiveSent >= PROACTIVE_LIMIT || document.visibilityState !== 'visible') return;
    const last = thread[thread.length - 1];
    if (last && last.from === 'me') return; // he's mid-reply
    const quietFor = Date.now() - Math.max(lastActivity, last?.at || 0);
    if (quietFor < 150000) return;
    let trailing = 0;
    for (let i = thread.length - 1; i >= 0 && thread[i].from === 'them'; i--) trailing++;
    if (trailing >= 5) return; // don't spam someone who isn't answering
    proactiveSent++;
    const history = thread.slice(-16).map((m) => ({ role: m.from === 'me' ? 'user' : 'assistant', text: m.text }));
    const reply = await ask('initiate', '', { history });
    if (reply) await deliver(reply, { proactive: true });
  }
  const scheduleProactive = (first) => setTimeout(() => {
    enqueue(maybeTextFirst).then(() => scheduleProactive(false));
  }, first ? 70000 + Math.random() * 40000 : 240000 + Math.random() * 180000);
  scheduleProactive(true);

  renderThread();

  /* ---------- Ask Alfie ---------- */
  $('#ask-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#ask-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const area = $('#ask-replies');
    const q = document.createElement('div');
    q.className = 'reply ask-q';
    q.textContent = `You: ${text}`;
    area.prepend(q);
    const a = document.createElement('div');
    a.className = 'reply ask-a pending';
    a.textContent = 'Alfie is typing…';
    q.after(a);
    const reply = await ask('ask', text);
    a.classList.remove('pending');
    a.textContent = `Alfie: ${reply || offlineLine(text)}`;
  });

  /* ---------- Discord #general ---------- */
  const discord = $('#discord-chat');
  function discordLine(name, text) {
    if (!discord) return;
    const p = document.createElement('p');
    p.className = 'dc-line';
    const b = document.createElement('b');
    b.textContent = name;
    if (/^alfie/i.test(name)) b.className = 'dc-alfie';
    if (name === 'you') b.className = 'dc-you';
    p.append(b, document.createTextNode(' ' + text));
    discord.appendChild(p);
    const scroller = discord.closest('.app-content');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
  if (discord && !discord.children.length) {
    [
      ['nate', 'is anyone else still in the black box or did i get locked in again'],
      ['priya.sings', 'nate it is 4pm. go home'],
      ['alfie', 'he can\'t, i have his jacket. omw back'],
      ['jules_tech', 'whoever keeps moving the ladder pls stop i\'m begging']
    ].forEach(([n, t]) => discordLine(n, t));
  }
  $('#discord-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#discord-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const recent = $$('.dc-line', discord).slice(-12).map((p) => p.textContent).join('\n');
    discordLine('you', text);
    await sleep(600 + Math.random() * 900);
    const reply = await ask('discord', text, { context: `Recent messages in #general:\n${recent}` });
    const lines = (reply || `alfie: ${offlineLine(text)}`).split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 4);
    for (const line of lines) {
      const m = line.match(/^([\w .·'-]{1,24}):\s*(.+)$/);
      await sleep(typingDelay(line) * 0.6);
      discordLine(m ? m[1].trim().toLowerCase() : 'alfie', m ? m[2] : line);
    }
  });

  /* ---------- Inline reply threads (blog + forum) ---------- */
  function threadContext(article) {
    const title = article.querySelector('h3')?.textContent || '';
    const body = article.querySelector('p')?.textContent || '';
    const replies = $$('.reply', article).slice(-6).map((r) => r.textContent).join('\n');
    return `Post${title ? ` titled "${title}"` : ''}:\n${body}${replies ? `\n\nEarlier replies:\n${replies}` : ''}`;
  }
  function toggleReplyForm(article, button, placeholder) {
    let form = article.querySelector('.inline-reply');
    if (!form) {
      form = document.createElement('form');
      form.className = 'inline-reply';
      form.innerHTML = '<input autocomplete="off"><button type="submit">Send</button>';
      form.querySelector('input').placeholder = placeholder;
      form.querySelector('input').setAttribute('aria-label', placeholder);
      button.after(form);
    } else {
      form.hidden = !form.hidden;
    }
    if (!form.hidden) form.querySelector('input').focus();
  }
  async function postReply(container, userLabel, text, alfieLabel, channel, context) {
    const mine = document.createElement('div');
    mine.className = 'reply';
    mine.textContent = `${userLabel}: ${text}`;
    container.appendChild(mine);
    const his = document.createElement('div');
    his.className = 'reply alfie-reply pending';
    his.textContent = `${alfieLabel} is typing…`;
    container.appendChild(his);
    await sleep(500 + Math.random() * 800);
    const reply = await ask(channel, text, { context });
    his.classList.remove('pending');
    his.textContent = `${alfieLabel}: ${reply || offlineLine(text)}`;
  }

  const blog = $('#school-posts');
  blog?.addEventListener('click', (event) => {
    const button = event.target.closest('.school-reply');
    if (button) toggleReplyForm(button.closest('article'), button, 'Leave a comment…');
  });
  blog?.addEventListener('submit', (event) => {
    if (!event.target.matches('.inline-reply')) return;
    event.preventDefault();
    const input = event.target.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const article = event.target.closest('article');
    const context = threadContext(article);
    postReply(article.querySelector('.school-replies'), 'You', text, 'Alfie', 'blog_reply', context);
  });
  $('#school-post')?.addEventListener('click', async () => {
    const title = prompt('Give Alfie a title for his next blog post:');
    if (!title || !title.trim()) return;
    const article = document.createElement('article');
    article.className = 'post';
    article.innerHTML = '<span class="tag">SOPHOMORE YEAR</span><h3></h3><p class="pending">Alfie is writing…</p><div class="small muted">Alfie Summers · just now</div><button class="header-action school-reply">Reply to Alfie</button><div class="school-replies"></div>';
    article.querySelector('h3').textContent = title.trim();
    blog.prepend(article);
    const body = await ask('blog_post', title.trim());
    const p = article.querySelector('p');
    p.classList.remove('pending');
    p.textContent = body || 'ok this post is going to be short because rehearsal ran late again. more soon, i promise.';
  });

  const forum = $('#forum-posts');
  forum?.addEventListener('click', (event) => {
    const button = event.target.closest('.forum-reply');
    if (button) toggleReplyForm(button.closest('article'), button, 'Reply anonymously…');
  });
  forum?.addEventListener('submit', (event) => {
    if (!event.target.matches('.inline-reply')) return;
    event.preventDefault();
    const input = event.target.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const article = event.target.closest('article');
    postReply(article.querySelector('.forum-replies'), 'You (anon)', text, 'Anonymous 🎭', 'forum_reply', threadContext(article));
  });
  $('#forum-new')?.addEventListener('click', async () => {
    const text = prompt('Post anonymously to AfterHours:');
    if (!text || !text.trim()) return;
    const article = document.createElement('article');
    article.className = 'forum-post';
    article.innerHTML = '<span class="anon">🕶️ You (anon) · Starlight</span><p></p><button class="header-action forum-reply">Reply</button><div class="forum-replies"></div>';
    article.querySelector('p').textContent = text.trim();
    forum.prepend(article);
    const replies = article.querySelector('.forum-replies');
    const his = document.createElement('div');
    his.className = 'reply alfie-reply pending';
    his.textContent = 'Anonymous 🎭 is typing…';
    await sleep(1800 + Math.random() * 2500);
    replies.appendChild(his);
    const reply = await ask('forum_reply', text.trim(), { context: 'A new anonymous post on AfterHours you just saw.' });
    his.classList.remove('pending');
    his.textContent = `Anonymous 🎭: ${reply || offlineLine(text)}`;
  });

  window.Alfie = { ask, discordLine, notify };
})();
