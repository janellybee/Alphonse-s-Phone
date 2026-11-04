/* "alfie's corner": Alfie's Neocities-style personal blog, with a public AMA box answered live via /api/ama. */
(() => {
  'use strict';
  const screen = document.querySelector('.screen');
  if (!screen || document.querySelector('#view-neoblog')) return;

  const POSTS = [
    { tag: 'ring', date: 'nov 4', mood: 'confused', title: 'ok the ring thing (part 3?)',
      body: `<p>not gonna say too much here because literally anyone can read this. but the ring did the glow thing again last night while i was doing chem homework. no jellyfish this time thank god.</p><p>the archivist says it "responds to intent." i asked what that means. they said "exactly what it sounds like." super helpful, thanks.</p><p>rule i'm keeping: no testing anything near other people. or near anne-marie. she already hates me after the hair dryer incident.</p>` },
    { tag: 'daily', date: 'nov 3', mood: 'tired', title: 'monday recap',
      body: `<p>6:40 alarm. missed the train by like four seconds. got to warm-ups with my hoodie on inside out and nobody told me until lunch.</p><p>rehearsal went long, then a fitting, then homework on the subway. i ate a donut for dinner and i'm not apologizing.</p><p>good part of the day: priya taught me a harmony thing in the stairwell and it sounded SO good.</p>` },
    { tag: 'charlotte', date: 'nov 1', mood: 'happy', title: 'saturday',
      body: `<p>charlotte and i went thrifting in the east village. she found a denim jacket that fit her perfectly on the first try and i found... a mug shaped like a frog. we both won.</p><p>she always picks up on it when i'm stressed before i say anything. she didn't ask, she just bought me a hot chocolate and let me complain about algebra for ten minutes. anyway she's the best and that's the post.</p>` },
    { tag: 'abilities', date: 'oct 30', mood: 'weirded out', title: 'stuff that\'s different now',
      body: `<p>writing this down so i stop pretending none of it is happening:</p><ul><li>the white streaks in my hair showed up overnight. hairstylist thinks it's stress. it's not stress.</li><li>sometimes when i'm anxious small stuff in the room kind of... hums? pencils roll. lights flicker.</li><li>i can see stars with my eyes closed. like actual constellations. ones that aren't ours.</li></ul><p>stellaris is apparently where the ring is "from." i don't really know what that means yet. i'm being careful. promise.</p>` },
    { tag: 'family', date: 'oct 28', mood: 'homesick', title: 'family chat update',
      body: `<p>status of the summers family group chat this week:</p><ul><li>mom: 14 photos of soup</li><li>dad: one (1) thumbs up, used on everything</li><li>tobias and alistair: arguing about hockey again</li><li>valerie: "can everyone stop"</li><li>keira + elias: sent the same meme at the same time. twin thing probably</li><li>liliana: "anne-marie is a better sibling than all of you"</li></ul><p>i miss vancouver a lot this time of year. it's colder here but it rains less, which feels wrong.</p>` },
    { tag: 'projects', date: 'oct 25', mood: 'busy', title: 'what i\'m working on (that i can talk about)',
      body: `<p>can't say anything about the show except it's going well and the crew is incredible.</p><p>other stuff:</p><ul><li><b>song #31</b>: four chords, no title, half a chorus. it's about the subway at 11pm.</li><li><b>a tabletop campaign</b> for maya, nate, and jules. i'm the DM. they have already set a tavern on fire.</li><li><b>this website</b>, obviously. learning html one broken div at a time.</li></ul>` },
    { tag: 'charity', date: 'oct 20', mood: 'proud', title: 'we hit the goal!!',
      body: `<p>the arts access fundraiser hit its goal!! that money covers music and acting classes for kids whose families can't pay for lessons. i got to take lessons as a kid and a lot of people don't, so this one matters to me.</p><p>also, the horse rescue upstate needs volunteers on weekends. mayfield would want you to go. i'm going in december.</p><p>thank you to everyone who donated or shared it. seriously.</p>` },
    { tag: 'interests', date: 'oct 16', mood: 'nerdy', title: 'things i\'m into rn',
      body: `<p><b>watching:</b> rewatching a mecha anime i won't name because people in the comments will fight<br><b>reading:</b> a manga about a girl who runs a bakery for ghosts. it's so good<br><b>playing:</b> our tabletop campaign (send help)<br><b>eating:</b> fruit mochi from the place by school<br><b>listening:</b> old musical cast recordings and indie stuff on the train</p><p>also i found a vintage shop that sells old band tees for $8. i'm not telling anyone where it is.</p>` },
    { tag: 'friends', date: 'oct 12', mood: 'chaotic', title: 'appreciation post for the black box crew',
      body: `<p>maya: saved my script from under a snack box. hero.<br>nate: always late, always has gum. it balances out.<br>jules: stage crew. could probably kill me with a wrench and nobody would find out. very nice though.<br>priya: can harmonize with anything, including the fire alarm (we tested it).</p><p>i'd be lost without these people.</p>` },
    { tag: 'schedule', date: 'oct 8', mood: 'overwhelmed', title: 'my week in one picture',
      body: `<p>mon: school, rehearsal, fitting<br>tue: school, studio, homework<br>wed: school, rehearsal, lunch with charlotte (protected time, do not book)<br>thu: school, interview, guitar lesson<br>fri: school, tech, sleep???<br>sat: set day<br>sun: catch up on everything i didn't do</p><p>riley says i need a day off. riley is right. riley is also the one who booked thursday.</p>` },
    { tag: 'charlotte', date: 'mar 2 (old post)', mood: 'nervous', title: '[from the archive] there\'s this girl',
      body: `<p>not naming names. she goes to a different school. she laughed at my bad joke about the subway map, and it wasn't even a good joke.</p><p>i've rewritten a text to her four times. i'm sending it. ok i didn't send it. ok i sent it.</p><p class="neo-note">(edit from november: it worked out. hi charlotte.)</p>` }
  ];
  const TAGS = ['all', 'daily', 'charlotte', 'friends', 'family', 'interests', 'projects', 'schedule', 'charity', 'ring', 'abilities'];

  const view = document.createElement('section');
  view.className = 'app-view';
  view.id = 'view-neoblog';
  view.innerHTML = `
<header class="app-header neo-header"><button class="back-btn" data-back>‹ Home</button><h2>alfie's corner</h2><span></span></header>
<div class="app-content neo">
  <div class="neo-banner"><span class="neo-star">✦</span> alfie's corner <span class="neo-star">✦</span><small>a little website by alphonse summers</small></div>
  <div class="neo-marquee" aria-hidden="true"><span>welcome to my corner of the internet ✦ under construction forever ✦ be nice in the ask box ✦ no i will not tell you where the ring is ✦ </span></div>
  <div class="neo-box neo-about">
    <div class="neo-pfp" aria-hidden="true">🎭</div>
    <div><b>hi i'm alfie!</b><br>16 · vancouver ➜ nyc · starlight sophomore · actor/singer/guitar guy · cat dad</div>
  </div>
  <div class="neo-box neo-now"><b>~ currently ~</b><br>mood: <span class="neo-mood">running on donuts</span><br>listening: song #31 (my own demo, sorry)<br>reading: ghost bakery manga<br>status: <span class="neo-blink">●</span> online</div>
  <nav class="neo-nav" aria-label="Blog sections">
    <button data-neo-tab="posts" class="on">📝 posts</button><button data-neo-tab="ama">💌 ask me</button><button data-neo-tab="about">✦ about</button>
  </nav>
  <section data-neo-pane="posts">
    <div class="neo-tags" role="toolbar" aria-label="Filter posts">${TAGS.map((t, i) => `<button data-neo-tag="${t}"${i === 0 ? ' class="on"' : ''}>${t}</button>`).join('')}</div>
    <div class="neo-posts"></div>
  </section>
  <section data-neo-pane="ama" hidden>
    <div class="neo-box neo-ama-intro"><b>💌 ask me anything</b><br>i answer everything that isn't weird. everyone can see the answers so don't send private stuff!</div>
    <form class="neo-ama-form">
      <input class="neo-ama-name" maxlength="30" placeholder="name (or leave blank for anon)" aria-label="Your name (optional)" autocomplete="off">
      <textarea class="neo-ama-q" maxlength="400" rows="3" placeholder="ask alfie something..." aria-label="Your question" required></textarea>
      <button type="submit">send ✦</button>
      <div class="neo-ama-status" role="status" aria-live="polite"></div>
    </form>
    <div class="neo-ama-list"><p class="neo-muted">loading the ask box...</p></div>
  </section>
  <section data-neo-pane="about" hidden>
    <div class="neo-box"><b>about this site</b><p>i made this because every social app wants me to post like a brand. this is just me. i yap here about school, shows, food, my friends, my family, charlotte, and the ring situation.</p><p>coded mostly on the subway. if something's broken, that's why.</p></div>
    <div class="neo-box"><b>✦ projects</b><ul><li>song #31 (no title yet)</li><li>tabletop campaign: "the lantern of nine seas"</li><li>learning piano pieces by ear</li><li>this website!!</li></ul></div>
    <div class="neo-box"><b>♡ causes i care about</b><ul><li>arts access fund: classes for kids who can't afford them</li><li>horse rescue upstate: weekend volunteering</li><li>animal shelters (adopt don't shop, anne-marie agrees)</li><li>food bank shifts back home in vancouver over the holidays</li></ul></div>
    <div class="neo-box"><b>✦ facts</b><ul><li>birthday: june 21</li><li>allergic to seafood. please stop recommending sushi places</li><li>pets: anne-marie 🐈 dex 🐕 joyce 🐕 mayfield 🐎</li><li>dream: a sag award. bigger dream: egot (lol)</li></ul></div>
    <div class="neo-badges" aria-hidden="true"><span>BEST VIEWED ON A PHONE</span><span>HTML IS MY PASSION</span><span>NO AI ART</span><span>MAYFIELD FAN CLUB</span></div>
    <div class="neo-ring"><button data-neo-ring="prev">← prev</button> <span>✦ starlight kids webring ✦</span> <button data-neo-ring="next">next →</button></div>
  </section>
  <div class="neo-counter">you are visitor #<span class="neo-hits">000000</span></div>
</div>`;

  const style = document.createElement('style');
  style.textContent = `
.neo-header{background:#14072b;color:#ffd6f5;border-bottom:2px dashed #ff7ad9}.neo-header h2{font-family:"Courier New",monospace}
.neo{background:#0d0420 repeating-linear-gradient(45deg,#14072b 0 10px,#1a0a38 10px 20px);color:#e9ddff;font:12px/1.5 Verdana,Geneva,sans-serif}
.neo a{color:#7fff6a}
.neo-banner{text-align:center;font:700 22px "Courier New",monospace;color:#7fff6a;text-shadow:0 0 8px #7fff6a88;padding:6px 0 2px}
.neo-banner small{display:block;font:11px Verdana,sans-serif;color:#ffb3ec;text-shadow:none}
.neo-star{color:#ff7ad9}
.neo-marquee{overflow:hidden;white-space:nowrap;border:1px solid #ff7ad9;background:#000;color:#ffe56b;font:11px "Courier New",monospace;margin:6px 0;padding:3px 0}
.neo-marquee span{display:inline-block;padding-left:100%;animation:neo-scroll 18s linear infinite}
@keyframes neo-scroll{to{transform:translateX(-100%)}}
@media (prefers-reduced-motion:reduce){.neo-marquee span{animation:none;padding-left:0}.neo-blink{animation:none!important}}
.neo-box{background:#1d0c3dcc;border:2px ridge #b98cff;padding:8px;margin:8px 0}
.neo-box ul{margin:4px 0;padding-left:18px}.neo-box p{margin:6px 0}
.neo-about{display:flex;gap:9px;align-items:center}
.neo-pfp{width:48px;height:48px;flex:none;display:grid;place-items:center;font-size:26px;background:#ffb38a;border:2px solid #fff;image-rendering:pixelated}
.neo-now{font:11px "Courier New",monospace}
.neo-blink{color:#7fff6a;animation:neo-blink 1.4s steps(2) infinite}@keyframes neo-blink{50%{opacity:0}}
.neo-nav{display:flex;gap:4px;margin:10px 0 6px}
.neo-nav button,.neo-tags button,.neo-ring button,.neo-ama-form button{border:2px outset #d6c2ff;background:#c9b6ff;color:#14072b;font:700 11px Verdana,sans-serif;padding:4px 7px;border-radius:0}
.neo-nav button.on,.neo-tags button.on{background:#ff7ad9;border-style:inset}
.neo-tags{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}.neo-tags button{font-weight:400;font-size:10px;padding:2px 6px}
.neo-post{background:#fdf6ff;color:#2a1a3a;border:2px solid #ff7ad9;box-shadow:4px 4px 0 #7fff6a55;padding:9px 10px;margin:10px 0}
.neo-post h3{margin:0 0 2px;font:700 15px "Courier New",monospace;color:#7a1fa2}
.neo-post .neo-meta{font-size:10px;color:#8a6a9c;margin-bottom:4px}
.neo-post p{margin:6px 0}.neo-post ul{padding-left:18px;margin:4px 0}
.neo-note{color:#a3008a;font-style:italic}
.neo-muted{color:#b8a6d6;font-style:italic}
.neo-ama-form{display:flex;flex-direction:column;gap:5px;margin:8px 0}
.neo-ama-form input,.neo-ama-form textarea{background:#fff;color:#2a1a3a;border:2px inset #b98cff;padding:6px;font:12px Verdana,sans-serif;border-radius:0;resize:vertical}
.neo-ama-form button{align-self:flex-end}
.neo-ama-status{min-height:15px;font-size:11px;color:#ffe56b}
.neo-ama{background:#fff8d6;color:#3a2a10;border:2px dashed #e0a800;padding:8px;margin:8px 0}
.neo-ama .q{font-weight:700}.neo-ama .q small{font-weight:400;color:#8b6b2a}
.neo-ama .a{margin-top:5px;padding-top:5px;border-top:1px dotted #e0a800}
.neo-ama .a b{color:#a3008a}
.neo-badges{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}
.neo-badges span{width:88px;height:31px;display:grid;place-items:center;text-align:center;font:700 7px/1.1 Verdana,sans-serif;background:linear-gradient(#3b1f6e,#14072b);color:#7fff6a;border:1px solid #ff7ad9;padding:2px}
.neo-ring{text-align:center;font-size:11px;margin:10px 0}
.neo-counter{text-align:center;font:11px "Courier New",monospace;color:#ffe56b;margin:14px 0 4px}
.neo-hits{background:#000;color:#7fff6a;padding:1px 4px;letter-spacing:2px}`;
  view.prepend(style);
  screen.appendChild(view);

  const $ = (s) => view.querySelector(s);
  const $$ = (s) => [...view.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Posts (authored content, so innerHTML is fine here)
  $('.neo-posts').innerHTML = POSTS.map((p) => `<article class="neo-post" data-tag="${p.tag}"><h3>${p.title}</h3><div class="neo-meta">${p.date} · mood: ${p.mood} · #${p.tag}</div>${p.body}</article>`).join('');
  view.querySelector('.neo-tags').addEventListener('click', (e) => {
    const b = e.target.closest('[data-neo-tag]');
    if (!b) return;
    $$('[data-neo-tag]').forEach((x) => x.classList.toggle('on', x === b));
    const tag = b.dataset.neoTag;
    $$('.neo-post').forEach((p) => { p.hidden = tag !== 'all' && p.dataset.tag !== tag && !(tag === 'ring' && p.dataset.tag === 'abilities'); });
  });

  // Tabs
  view.querySelector('.neo-nav').addEventListener('click', (e) => {
    const b = e.target.closest('[data-neo-tab]');
    if (!b) return;
    $$('[data-neo-tab]').forEach((x) => x.classList.toggle('on', x === b));
    $$('[data-neo-pane]').forEach((p) => { p.hidden = p.dataset.neoPane !== b.dataset.neoTab; });
    if (b.dataset.neoTab === 'ama') loadAma();
  });

  view.querySelector('.neo-ring').addEventListener('click', (e) => {
    if (e.target.closest('[data-neo-ring]')) window.toast?.('webring is down again. nate was supposed to fix it');
  });

  view.querySelector('[data-back]').addEventListener('click', () => {
    view.classList.remove('active');
    document.querySelector('#home').style.display = 'flex';
  });

  // Visitor counter (local, just for vibes)
  let hits = 4817;
  try { hits = Number(localStorage.getItem('alfie-neo-hits') || 4817) + 1; localStorage.setItem('alfie-neo-hits', hits); } catch (_) {}
  $('.neo-hits').textContent = String(hits).padStart(6, '0');

  // AMA box
  const list = $('.neo-ama-list');
  const status = $('.neo-ama-status');
  const renderAma = (q) => `<div class="neo-ama"><div class="q">Q: ${esc(q.question)} <small>— ${esc(q.asker || 'anon')}</small></div><div class="a"><b>alfie:</b> ${esc(q.answer)}</div></div>`;
  let amaLoaded = false;
  async function loadAma() {
    if (amaLoaded) return;
    amaLoaded = true;
    try {
      const res = await fetch('/api/ama');
      if (!res.ok) throw new Error(res.status);
      const { questions } = await res.json();
      list.innerHTML = questions.length ? questions.map(renderAma).join('') : '<p class="neo-muted">no questions yet. be the first!!</p>';
    } catch (error) {
      amaLoaded = false;
      list.innerHTML = '<p class="neo-muted">the ask box isn\'t loading rn. try again in a bit</p>';
    }
  }
  $('.neo-ama-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const qEl = $('.neo-ama-q');
    const question = qEl.value.trim();
    if (question.length < 3) { status.textContent = 'ask a real question lol'; return; }
    const button = $('.neo-ama-form button');
    button.disabled = true;
    status.textContent = 'sent! alfie is typing...';
    try {
      const res = await fetch('/api/ama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, asker: $('.neo-ama-name').value.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'failed');
      qEl.value = '';
      if (data.question) {
        list.querySelector('.neo-muted')?.remove();
        list.insertAdjacentHTML('afterbegin', renderAma(data.question));
        status.textContent = 'answered ✦';
      } else {
        status.textContent = 'got it! (not every question gets answered publicly)';
      }
    } catch (error) {
      status.textContent = error.message && error.message !== 'failed' ? error.message : 'that didn\'t send. try again?';
    } finally {
      button.disabled = false;
    }
  });
})();
