/* Phone pulse: Alfie and everyone around him keep posting, so the phone buzzes every 2-3 minutes.
   Each pulse picks an app (Messages, Discord, AfterHours, Backstage Pass, the Beacon, Alfie's Corner),
   writes a fresh update with live AI (scripted lines if it's offline), and notifies like a real phone.
   Story chapters can queue their own in-world updates with PhonePulse.storyPings(). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const A = () => window.Alfie;

  const MIN_GAP = 120000; // 2 minutes
  const MAX_GAP = 180000; // 3 minutes

  /* ---------- Who posts where ---------- */
  const PEOPLE = {
    alfie: 'Alfie himself',
    charlotte: 'Charlotte Sanders, Alfie\'s girlfriend (goes to a different school, warm, teasing, sharp)',
    maya: 'Maya, Alfie\'s co-star and friend (dry, practical, always has snacks)',
    nate: 'nate, a theatre kid who is always late and dramatic about it',
    'priya.sings': 'priya.sings, a choir kid who writes songs and organizes everyone',
    jules_tech: 'jules_tech, stage crew kid, blunt, protective of the equipment'
  };
  const READERS = ['riverwalker88', 'theatre_mom_ny', 'bk_bagel_guy', 'queensreader', 'subway_poet', 'starlight_parent'];

  const APPS = [
    { app: 'messages', weight: 26 },
    { app: 'discord', weight: 30 },
    { app: 'forums', weight: 12 },
    { app: 'school', weight: 10 },
    { app: 'newspaper', weight: 10 },
    { app: 'neoblog', weight: 12 }
  ];

  // Offline lines, so the phone still feels alive without live AI.
  const SCRIPTED = {
    messages: [
      'the train has been stopped for 10 min and a guy is playing harmonica. i\'m in hell',
      'anne-marie just knocked my water onto my script. again',
      'riley sent me a 6 paragraph email titled "quick note"',
      'do you think it\'s weird to eat a donut for dinner if it\'s a big donut',
      'charlotte said hi btw',
      'ring did the glowy thing again. ignoring it. ignoring it',
      'rehearsal ran late. i forgot what the sun looks like'
    ],
    discord: [
      ['charlotte', 'alfie you left your water bottle in the rehearsal room again. it\'s by the stage door'],
      ['maya', 'they moved the prop table btw. your script\'s fine'],
      ['nate', 'does anyone have the revised pages or am i just cooked'],
      ['jules_tech', 'reminder that the fog machine is NOT a toy. looking at the sophomores'],
      ['alfie', 'who took the last donut from the green room. i\'m not mad i just want to talk'],
      ['priya.sings', 'choir got moved to 3:30 tomorrow fyi'],
      ['maya', 'alfie did you see the email, they added a scene'],
      ['alfie', 'i did not see the email'],
      ['nate', 'did anyone else see those lights by the river last night or am i losing it'],
      ['charlotte', 'tell alfie to eat something that isn\'t sugar pls'],
      ['jules_tech', 'lost and found has 3 hoodies and a single shoe. claim them'],
      ['alfie', 'anne-marie sat on my laptop and sent half an essay to my teacher. great day']
    ],
    forums: [
      'is it normal to cry in the practice rooms or is that just me',
      'whoever left cookies on the 3rd floor piano. thank you. i love you',
      'the vending machine on 2 ate my dollar for the third time this week',
      'does anyone know if callbacks went out yet. asking for my sanity',
      'saw a blue light in the black box after everyone left. probably the exit sign. probably'
    ],
    school: [
      ['priya.sings', 'this is so real'],
      ['nate', 'i was there and can confirm'],
      ['maya', 'he left out the part where he tripped on the cable'],
      ['jules_tech', 'thank you for mentioning crew. nobody ever does'],
      ['Alfie', 'lol i forgot i posted this']
    ],
    newspaper: [
      'great piece. we need more local arts coverage',
      'i walk that path every night and yes the lights are real',
      'my kid goes to starlight and they never tell me anything this interesting',
      'the café mentioned here has the best hot chocolate in the borough fr'
    ],
    neoblog: [
      'mood update: tired but good',
      'listening to the same song on repeat. i\'m not okay (in a fun way)',
      'quick update: survived the day. barely. ate 2 donuts',
      'charlotte made me watch a horse documentary. 10/10',
      'if you sent an ask today i\'m getting to it, i promise'
    ]
  };
  const MOODS = ['sleepy', 'running on donuts', 'chaotic', 'happy', 'homesick', 'nervous', 'creative', 'hungry', 'overbooked', 'weirdly calm'];

  /* ---------- Helpers ---------- */
  function cleanAI(text, name) {
    let t = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
    t = t.replace(/^["“]|["”]$/g, '');
    if (name) t = t.replace(new RegExp(`^@?${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:\\-–]\\s*`, 'i'), '');
    t = t.replace(/^(anonymous|anon)\s*:\s*/i, '');
    return t.slice(0, 240);
  }
  async function write(where, who, context, fallback) {
    const ai = await A()?.ask('pulse', `[App: ${where}. Posting as: ${who}. Write their next post.]`, { context });
    return cleanAI(ai, who.split(/[ ,(]/)[0]) || fallback;
  }
  function alert(app, title, text, icon) {
    if (A()?.isVisible(app)) return;
    A()?.bumpBadge(app);
    A()?.notify(title, text, app, icon);
  }
  const weighted = (list) => {
    let r = Math.random() * list.reduce((n, x) => n + x.weight, 0);
    return list.find((x) => (r -= x.weight) < 0) || list[0];
  };
  const recentText = (nodes, n = 8) => nodes.slice(-n).map((x) => x.textContent.trim()).join('\n');

  /* ---------- One update per app ---------- */
  const POSTERS = {
    async messages(item) {
      if (!A()?.canTextFirst()) return false;
      return A().textFirst(item?.text);
    },

    async discord(item) {
      const name = item?.from || pick(['alfie', 'alfie', 'charlotte', 'maya', 'nate', 'priya.sings', 'jules_tech']);
      const recent = recentText($$('#discord-chat .dc-line'));
      const scripted = pick(SCRIPTED.discord.filter(([n]) => n === name).concat([[name, pick(SCRIPTED.discord)[1]]]))[1];
      const text = item?.text || await write('Discord #general on the Starlight backstage student server', `${name} (${PEOPLE[name] || 'a Starlight student'})`, `Recent messages in #general:\n${recent}`, scripted);
      A()?.discordLine(name, text);
      alert('discord', `#general · ${name}`, text, '🎮');
      return true;
    },

    async forums(item) {
      const root = $('#forum-posts');
      if (!root) return false;
      const posts = $$('.forum-post', root);
      // Mostly new anonymous posts, sometimes a reply under an existing one.
      if (!item && posts.length && Math.random() < 0.4) {
        const post = pick(posts.slice(0, 5));
        const text = await write('AfterHours, an anonymous forum for Starlight students. Replying to a post', 'an anonymous Starlight student', `The post: ${post.querySelector('p')?.textContent}`, 'same honestly');
        const reply = document.createElement('div');
        reply.className = 'reply';
        reply.textContent = `Anonymous: ${text}`;
        post.querySelector('.forum-replies')?.appendChild(reply);
        alert('forums', 'AfterHours · new reply', text, '🕶️');
        return true;
      }
      const dept = pick(['Theatre', 'Choir', 'Dance', 'Props', 'Film', 'Sophomores', 'Late night']);
      const text = item?.text || await write('AfterHours, an anonymous forum for Starlight students. A new post', 'an anonymous Starlight student', `Recent posts:\n${recentText(posts.slice(0, 4).map((p) => p.querySelector('p')).filter(Boolean), 4)}`, pick(SCRIPTED.forums));
      const article = document.createElement('article');
      article.className = 'forum-post pulse-new';
      article.innerHTML = '<span class="anon"></span><p></p><button class="header-action forum-reply">Reply</button><div class="forum-replies"></div>';
      article.querySelector('.anon').textContent = `🕶️ Anonymous · ${dept} · just now`;
      article.querySelector('p').textContent = text;
      root.prepend(article);
      alert('forums', 'AfterHours · new post', text, '🕶️');
      return true;
    },

    async school(item) {
      const posts = $$('#school-posts article');
      if (!posts.length) return false;
      const post = pick(posts.slice(0, 4));
      const [fallbackName, fallbackText] = pick(SCRIPTED.school);
      const name = item?.from || (Math.random() < 0.25 ? 'Alfie' : pick(['priya.sings', 'nate', 'maya', 'jules_tech', 'charlotte']));
      const who = name === 'Alfie' ? 'Alfie, replying on his own post' : `${name} (${PEOPLE[name]})`;
      const text = item?.text || await write('Backstage Pass, the Starlight student blog. A comment on a post', who, `Post "${post.querySelector('h3')?.textContent}": ${post.querySelector('p')?.textContent}`, name === fallbackName ? fallbackText : 'lol this is so real');
      const reply = document.createElement('div');
      reply.className = name === 'Alfie' ? 'reply alfie-reply' : 'reply';
      reply.textContent = `${name}: ${text}`;
      post.querySelector('.school-replies')?.appendChild(reply);
      alert('school', `Backstage Pass · ${name} commented`, text, '⭐');
      return true;
    },

    async newspaper(item) {
      const articles = $$('#view-newspaper article').filter((a) => a.querySelector('.comments'));
      if (!articles.length) return false;
      const article = pick(articles);
      const verified = !item && Math.random() < 0.2;
      const name = verified ? 'Alfie Summers ✓' : item?.from || pick(READERS);
      const title = article.querySelector('h3')?.textContent || 'a story';
      const text = item?.text || await write('The Borough Beacon, a local New York paper. A reader comment on an article', verified ? 'Alfie, from his verified account (careful, polite, still casual)' : `${name}, a local reader (adult New Yorker, chatty)`, `Article "${title}": ${article.querySelector('p')?.textContent}`, pick(SCRIPTED.newspaper));
      const list = article.querySelector('.comments > div');
      const p = document.createElement('p');
      p.textContent = `${name}: ${text}`;
      list?.appendChild(p);
      const toggle = article.querySelector('.comment-toggle');
      if (toggle) toggle.textContent = `Comments · ${list?.children.length || 1}`;
      const like = article.querySelector('.like span');
      if (like) like.textContent = String(Number(like.textContent || 0) + 1 + Math.floor(Math.random() * 4));
      alert('newspaper', `Beacon · ${name} on "${title}"`, text, '📰');
      return true;
    },

    async neoblog(item) {
      const root = $('.neo-posts');
      if (!root) return false;
      const mood = pick(MOODS);
      const moodEl = $('.neo-mood');
      if (moodEl) moodEl.textContent = mood;
      const text = item?.text || await write('Alfie\'s Corner, his own Neocities-style blog. A tiny status update post', 'Alfie', `Current mood on the site: ${mood}`, pick(SCRIPTED.neoblog));
      const post = document.createElement('article');
      post.className = 'neo-post pulse-new';
      post.dataset.tag = 'daily';
      post.innerHTML = '<h3>quick update</h3><div class="neo-meta"></div><p></p>';
      post.querySelector('.neo-meta').textContent = `just now · mood: ${mood} · #daily`;
      post.querySelector('p').textContent = text;
      root.prepend(post);
      alert('neoblog', 'alfie\'s corner ✦ new post', text, '✦');
      return true;
    }
  };

  /* ---------- Scheduler ---------- */
  const storyQueue = [];
  let busy = false;

  async function pulse() {
    if (busy || !A()) return;
    busy = true;
    try {
      // Story chapter updates jump the line.
      if (storyQueue.length) {
        const item = storyQueue.shift();
        const ok = await POSTERS[item.app]?.(item).catch(() => false);
        if (!ok && item.app === 'messages') await POSTERS.discord({ from: 'alfie', text: item.text });
        return;
      }
      const tried = new Set();
      for (let attempt = 0; attempt < 3; attempt++) {
        const choice = weighted(APPS.filter((a) => !tried.has(a.app)));
        tried.add(choice.app);
        if (await POSTERS[choice.app]().catch((e) => { console.warn(e); return false; })) break;
      }
      // Sometimes it's a pile-on: a second app lights up right after.
      if (Math.random() < 0.35) {
        await sleep(9000 + Math.random() * 14000);
        const second = weighted(APPS.filter((a) => a.app !== 'messages' && !tried.has(a.app)));
        await POSTERS[second.app]().catch(() => false);
      }
    } finally {
      busy = false;
    }
  }

  // Waits for the tab to be visible (no point buzzing a phone nobody's looking at).
  const whenVisible = () => document.visibilityState === 'visible'
    ? Promise.resolve()
    : new Promise((r) => document.addEventListener('visibilitychange', function on() {
        if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', on); r(); }
      }));

  async function loop() {
    await sleep(35000 + Math.random() * 25000); // first buzz shortly after opening
    for (;;) {
      await whenVisible();
      await pulse();
      await sleep(MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
    }
  }

  // Story updates arrive one after another, about 20-40 seconds apart, on top of the regular feed.
  let storyTimer;
  function storyPings(items) {
    (items || []).forEach((item) => storyQueue.push(item));
    const drain = async () => {
      await whenVisible();
      await pulse();
      if (storyQueue.length) storyTimer = setTimeout(drain, 20000 + Math.random() * 20000);
    };
    clearTimeout(storyTimer);
    storyTimer = setTimeout(drain, 12000 + Math.random() * 8000);
  }

  window.PhonePulse = { pulse, storyPings };
  loop();
})();
