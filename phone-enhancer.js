/* Adds the Beacon and AU encyclopedia as phone apps. */
document.addEventListener('DOMContentLoaded', () => {
  const screen = document.querySelector('.screen');
  const grid = document.querySelector('.app-grid') || document.querySelector('[data-app="messages"]')?.parentElement;
  if (!screen || !grid) return;

  const stories = [
    ['campus','CAMPUS','Between algebra and the spotlight','Starlight students balance classwork, rehearsals, and memorizing lines on the train. Teachers say the goal is to make room for the art and the student.'],
    ['arts','ARTS','After “cut,” the crew keeps working','Lighting, costumes, and set teams make the scenes audiences remember. At a recent wrap, one young performer stayed late to thank each department.'],
    ['city','CITY','A café becomes a rehearsal refuge','A family-run café near school is a quiet spot for scripts and sketchbooks. The owner asks visitors to respect customers’ privacy.'],
    ['campus','STUDENT LIFE','Lost script found under snack box','A backstage search ended when a co-star found the missing pages beneath a box of crackers. The student involved declined to comment, then admitted the snack box was his.'],
    ['odd','UNEXPLAINED · DEVELOPING','Park lights leave witnesses with questions','Walkers reported a flash near the riverside path. One Starlight student called it “like a film effect, except nobody was filming.”']
  ];
  function openView(id, label, title, inlineNews = false) {
    if (document.querySelector(`[data-app="${id}"]`)) return;
    const icon = document.createElement('button');
    icon.className = 'app-icon'; icon.dataset.app = id;
    icon.innerHTML = `<span class="icon-tile" style="background:linear-gradient(145deg,#fff1ce,#c99b61)">${id === 'newspaper' ? '📰' : 'W'}</span>${label}`;
    grid.appendChild(icon);
    const view = document.createElement('section');
    view.className = 'app-view'; view.id = `view-${id}`;
    const header = `<header class="app-header"><button class="back-btn">‹ Home</button><h2>${title}</h2><span></span></header>`;
    view.innerHTML = header + (inlineNews ? `
      <style>.beacon{flex:1;overflow:auto;background:#f4f0e7;color:#20232b;padding:12px;font:14px Georgia,serif}.beacon h1{text-align:center;font-size:30px;margin:6px}.beacon .dek{text-align:center;color:#555}.beacon nav{display:flex;gap:5px;overflow:auto;padding:8px 0}.beacon button{border:1px solid #999;background:#fff;padding:7px;border-radius:16px;white-space:nowrap}.beacon .selected{background:#17233d;color:#fff}.beacon input{width:100%;padding:9px;margin:7px 0}.beacon article{border-bottom:1px solid #aaa;padding:12px 0}.beacon h3{font-size:21px;margin:5px 0}.beacon p{line-height:1.45}.beacon small{color:#765044}.beacon .comments{font:12px Arial,sans-serif}.beacon .comments p{border-top:1px solid #ccc;padding-top:5px}.beacon form{display:flex;gap:5px}.beacon form input{flex:1;min-width:0}.beacon .story-actions{display:flex;gap:6px}.beacon .hide{display:none!important}</style>
      <div class="beacon"><p class="dek">NEW YORK · CAMPUS · CULTURE · CITY</p><h1>The Borough Beacon</h1><p class="dek">A fictional newspaper from Alfie's AU</p><nav>${[['all','Top Stories'],['campus','Campus'],['arts','Arts'],['city','City'],['odd','Unexplained']].map(([key,name])=>`<button data-filter="${key}" class="${key==='all'?'selected':''}">${name}</button>`).join('')}</nav><input type="search" placeholder="Search this edition" aria-label="Search articles"><div class="beacon-stories"></div><p class="dek">Fictional AU news · Comments stay on this device.</p></div>` : `<iframe title="${title}" src="./wiki.html" style="border:0;width:100%;height:100%;flex:1;background:#f4f0e7"></iframe>`);
    screen.appendChild(view);
    icon.addEventListener('click', () => {
      document.querySelector('#home').style.display = 'none';
      document.querySelectorAll('.app-view').forEach((app) => app.classList.remove('active'));
      view.classList.add('active');
    });
    view.querySelector('.back-btn').addEventListener('click', () => {
      view.classList.remove('active'); document.querySelector('#home').style.display = 'flex';
    });
    if (!inlineNews) return;
    const root = view.querySelector('.beacon-stories');
    stories.forEach(([category, tag, title, body]) => {
      const article = document.createElement('article'); article.dataset.category = category;
      article.innerHTML = `<small>${tag}</small><h3></h3><p></p><div class="story-actions"><button class="like">♡ <span>0</span></button><button class="comment-toggle">Comment</button></div><div class="comments" hidden><form><input placeholder="Add a thought" aria-label="Comment"><button>Send</button></form><div></div></div>`;
      article.querySelector('h3').textContent = title; article.querySelector('p').textContent = body; root.appendChild(article);
    });
    const filter = (category, query = '') => root.querySelectorAll('article').forEach((article) => article.classList.toggle('hide', !(category === 'all' || article.dataset.category === category) || !article.textContent.toLowerCase().includes(query)));
    view.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      view.querySelector('.selected')?.classList.remove('selected'); button.classList.add('selected');
      filter(button.dataset.filter, view.querySelector('input[type=search]').value.toLowerCase());
    }));
    view.querySelector('input[type=search]').addEventListener('input', (event) => filter(view.querySelector('.selected').dataset.filter, event.target.value.toLowerCase()));
    root.addEventListener('click', (event) => {
      const article = event.target.closest('article'); if (!article) return;
      if (event.target.closest('.like')) { const button = event.target.closest('.like'), count = button.querySelector('span'), liked = button.dataset.liked === '1'; button.dataset.liked = liked ? '0' : '1'; count.textContent = String(Number(count.textContent) + (liked ? -1 : 1)); button.firstChild.textContent = liked ? '♡ ' : '♥ '; }
      if (event.target.closest('.comment-toggle')) article.querySelector('.comments').hidden = !article.querySelector('.comments').hidden;
    });
    root.addEventListener('submit', (event) => {
      if (!event.target.matches('form')) return; event.preventDefault();
      const input = event.target.querySelector('input'), text = input.value.trim(); if (!text) return;
      const comments = event.target.nextElementSibling;
      for (const line of [`Reader: ${text}`, /ring|light|park|alien/i.test(text) ? 'Alfie: I saw something too, but I’m still figuring out what it was. Did you see it yourself?' : /school|class|homework|rehears/i.test(text) ? 'Alfie: Yeah, the schedule gets intense. Trying to keep school from becoming the thing I only do between jobs.' : 'Alfie: I’m not sure I understood—which part caught your attention?']) { const p = document.createElement('p'); p.textContent = line; comments.appendChild(p); }
      input.value = '';
    });
  }
  openView('newspaper', 'Beacon', 'The Borough Beacon', true);
  openView('wiki', 'Wikipedia', 'Alphonse Summers · AU Wiki');
});
