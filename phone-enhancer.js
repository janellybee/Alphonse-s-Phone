/* Adds the Beacon, AU encyclopedia, and interactive magazine as phone apps. */
// This file is injected after DOMContentLoaded (see config.js), so run immediately if the DOM is ready.
const initPhoneApps = () => {
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

  const magazinePages = [
    { label:'The cover', html:`<p class="eyebrow">THE SPECIAL ISSUE · A LONG-FORM CONVERSATION</p><h1>ALPHONSE<br>SUMMERS</h1><p class="cover-deck">A life between the wings, the set, the studio and home</p><div class="cover-art">✦　A performer, a student, a son, a friend—and still figuring it out.</div><p class="smallprint">A fictional AU magazine issue. Interviews and career details are in-universe storytelling, not real-world reporting.</p>` },
    { label:'Editor’s note & contents', html:`<h2>More than a call sheet</h2><p>This special issue follows Alfie from baby-commercial days to stage doors, screen roles, voice booths, music experiments and the busy sophomore life he is living now. It is an imaginative, fictional interview based on the AU details shared by the reader.</p><p><b>Reader note:</b> Specific project titles, dates, named award ceremonies and unrevealed future credits were not supplied, so this issue does not invent them. Where a detail is still open, it says so.</p><h3>Inside this issue</h3><ol class="contents"><li>First frame: commercials and family influence</li><li>Learning to take the room: stage, screen and auditions</li><li>Awards, grief and being seen</li><li>Many roles, one person</li><li>Family, Charlotte and the people behind the work</li><li>Anxiety, phobias and airports</li><li>Momosu Island: five months away</li><li>Favorites, future plans and advice</li><li>Filmography, music, honors, quiz and thank-you</li></ol>` },
    { label:'The first frame', html:`<p class="eyebrow">THE BEGINNING</p><h2>“I was on a TV screen before I understood what a TV screen was.”</h2><p><b>Q: Your story starts unusually early. What do you remember about the commercials you did as a baby?</b></p><p><b>Alfie:</b> I don't remember the shoots myself—my family tells those stories and there are old clips. I was tiny, being carried from one mark to another, while adults made sure I was comfortable. It is funny to think that my first screen credit happened before I could tell anyone I was nervous.</p><p><b>Q: Did acting feel like your own path, or something you inherited?</b></p><p><b>Alfie:</b> My older siblings Alistair and Valerie were already showing me what theatre could be. I followed their footsteps into musicals and plays, but I never felt I had to become either of them. They made the door look possible; I had to walk through it in my own shoes.</p><p>Alistair and Valerie helped make backstage life feel familiar. Tobias, a TV host and music producer, encouraged Alfie to explore music and try MC and hosting roles. Those small steps into a microphone became practice in facing a room rather than avoiding it.</p>` },
    { label:'From wings to camera', html:`<p class="eyebrow">CRAFT · AUDITIONS · RANGE</p><h2>“Every room asks for a slightly different version of brave.”</h2><p><b>Q: You have moved between Broadway musicals, stage plays, television, films and voice acting. What changes?</b></p><p><b>Alfie:</b> On stage, the story is happening with the audience in the room. You have to listen and keep the moment alive. On a set, a close-up can be quiet and still say a lot. In voice work, you build everything with breath and sound. I love that none of those jobs lets me solve the scene in exactly the same way.</p><p><b>Q: What is an audition like for you?</b></p><p><b>Alfie:</b> The waiting is usually harder than the actual scene. I try to prepare, take a breath, and treat the people in the room like collaborators, not judges behind a giant invisible desk. Sometimes the role goes somewhere else. I try to leave the room having made a clear choice and learned something.</p><p>His credits span major franchises, standalone projects and independent work, as well as stage and voice roles. The full title-by-title list has not been supplied for this AU, so the index later catalogs the formats without making up credits.</p>` },
    { label:'Awards & a difficult night', html:`<p class="eyebrow">HONORS · VULNERABILITY</p><h2>“I didn't expect the room to hold me while I cried.”</h2><p><b>Q: You have won more awards than you expected—including Kids’ Choice, Emmy, Critics Choice and BAFTA honors in this AU. Does it feel real?</b></p><p><b>Alfie:</b> Not really. I still feel like the shy kid who was hoping nobody would ask him to speak first. I am grateful for every nomination and win, but the people who make the work with me are part of those moments too.</p><p><b>Q: One Best Actor win came on the anniversary of your grandmother’s death. You broke down during your speech, and your co-stars walked with you backstage. What do you remember?</b></p><p><b>Alfie:</b> I had been trying to keep it together all evening. Then I heard my name, saw the lights, and realized what day it was. I couldn't finish the speech the way I planned. My co-stars didn't ask me to perform being okay—they just stayed beside me and got me somewhere quiet. I miss my grandmother. That night was grief and gratitude at the same time.</p><p class="pullquote">“The award mattered. Being cared for in that moment mattered more.”</p><p>The moment is presented as an intimate fictional AU memory, not as a real event or award record.</p>` },
    { label:'Choosing different roles', html:`<p class="eyebrow">ON SET · COLLABORATION</p><h2>“I don't want one character to become the only door people open for me.”</h2><p><b>Q: You have worked in franchise stories, standalone films, indie projects, television, voice acting and theatre. Is avoiding typecasting a conscious choice?</b></p><p><b>Alfie:</b> I like being surprised by a role. If I have played somebody confident, maybe I want the next person to be awkward or guarded or funny in a way I don't understand yet. I don't want to repeat a performance just because people liked it once.</p><p><b>Q: What makes a favorite set memory?</b></p><p><b>Alfie:</b> Usually it is something small: a crew member fixing a problem nobody else noticed, a co-star making a long day lighter, or a take where everybody listens and the scene becomes different from rehearsal—in a good way. I try to remember the people, not only the premiere pictures.</p><p>Alfie describes close, respectful relationships with cast and staff across projects. He values chemistry as trust and attentive work, not just getting along for a photograph. He hopes to collaborate with artists whose work excites him and whose conduct aligns with respect and safety; he does not name a wish list of celebrities in this issue.</p>` },
    { label:'Family, Charlotte & the team', html:`<p class="eyebrow">THE PEOPLE WHO KEEP HIM GROUNDED</p><h2>“My family can tell when I'm doing the ‘I'm fine’ voice.”</h2><p><b>Q: How does your family shape your life now?</b></p><p><b>Alfie:</b> It is loud in the best way. Joanne and Dakota are my parents. Tobias, Alistair, Valerie, Keira, Elias and Liliana are my siblings. Alistair and Valerie gave me a picture of stage life; Tobias made music and hosting feel like things I could try. They cheer me on, and they also tell me when I need to eat and sleep.</p><p><b>Q: You and Charlotte Sanders are the same age, but she goes to a different school. How do you make time for each other?</b></p><p><b>Alfie:</b> We work around each other's schedules. She's good at noticing when I need a quiet check-in, and she doesn't make me turn it into a press conference. I want her to have her own life and space too. She is my girlfriend, not a character in my career story.</p><p>His manager, personal assistant, and production teams help coordinate work and travel. Alfie says a good team protects time to be a student and a person, not only an available performer.</p>` },
    { label:'Anxiety, fear & airports', html:`<p class="eyebrow">A PERSONAL CONVERSATION</p><h2>“Courage isn't the same thing as never getting scared.”</h2><p><b>Q: You have spoken about severe anxiety and panic attacks, and phobias connected to childhood trauma. What are you comfortable sharing?</b></p><p><b>Alfie:</b> I have coulrophobia, angrophobia, teraphobia, scopophobia and lycanthrophobia. Some of those fears connect to things I experienced when I was young. I don't owe anyone the whole story to prove that a fear is real. I work on it with support and at a pace that feels safe.</p><p><b>Q: Airports used to be frightening for you.</b></p><p><b>Alfie:</b> When I was very young, crowds and cameras would close in as I was trying to board. There could be ten bodyguards, my manager and my assistant with me, and it still felt like there was no space to breathe. I'm more comfortable with crowds now and can handle more on my own, even when anxiety shows up. I still use discreet exits. That is a boundary, not a failure.</p><p><b>Q: What helps during a panic spiral?</b></p><p><b>Alfie:</b> I try to notice what is around me, slow down, and tell someone I trust instead of hiding it until I crash. Some days the win is asking for help or getting through the next minute. Support from a qualified professional matters; a magazine interview is not treatment advice.</p>` },
    { label:'Five months on Momosu Island', html:`<p class="eyebrow">ON LOCATION · MOMOS ACADEMY FOR BOYS</p><h2>“The island felt like another character.”</h2><p><b>Q: You and your male co-stars spent five months on Momosu Island while filming season two of the coming-of-age mystery drama. What was that experience like?</b></p><p><b>Alfie:</b> We were filming and living the exchange-student rhythm at the same time. Momos Academy for Boys is an elite all-boys boarding school. Students from working- and middle-class families can apply; students from influential, royal or world-leader families may receive special invitations. That mix of backgrounds changes how the boys see the school and one another.</p><p>The cast and staff stayed on Momosu Island for five months. Between filming, the actors experienced school routines, shared meals and the strange intimacy of being away from home together. Alfie says the male co-stars became close through long days, small traditions and learning to ask one another for space when needed.</p><p><b>Q: What did the place teach you?</b></p><p><b>Alfie:</b> To be curious before deciding I understand someone. People arrive with different expectations and different kinds of pressure. The island gave us time to notice that. I miss the views and the group dinners—but I also missed my family and my own bed.</p><p class="smallprint">The academy, island and series are fictional AU settings. Details beyond the premise provided remain intentionally open.</p>` },
    { label:'Favorites & off days', html:`<p class="eyebrow">THE PERSON OFF-CAMERA</p><h2>“A day off is not a secret audition.”</h2><p><b>Q: What do you like when work pauses?</b></p><p><b>Alfie:</b> Guitar, piano, games, books, manga, anime, a good TV show or movie, and theatre when I can get to it. I like trying new things and thinking outside the obvious answer. I also like doing absolutely nothing for a bit. Rest counts.</p><p>He enjoys Broadway and stage work both as a performer and audience member. His favorite specific titles across television, film, games, books, manga, anime, songs and musicals have not all been established in the AU, so this issue leaves a reader page for them rather than inventing a definitive list.</p><p><b>Q: Where would you travel next?</b></p><p><b>Alfie:</b> Somewhere I haven't been, where I can learn a little about how people live and eat something I can't get at home. I'd rather pick the country when the schedule is real than pretend I have a booked trip.</p><p>Off days are a mix of family calls, catching up on school, music, sleep and low-key time with Charlotte or friends. Festivals for film and music are goals to attend and learn from, not a confirmed itinerary.</p>` },
    { label:'Looking forward', html:`<p class="eyebrow">WHAT COMES NEXT</p><h2>“I want to keep making things that make me a little nervous—in a good way.”</h2><p><b>Q: What goals are on your list?</b></p><p><b>Alfie:</b> A SAG Award is a goal I really want to reach, and the EGOT is the dream written in very big letters. I know those are ambitions, not promises. I want to keep learning, make music, and help direct and film short projects with people I trust.</p><p>Upcoming music projects and short films are in development in the AU, but names, dates, collaborators and release plans have not been supplied. He is interested in film and music festivals, taking on creative challenges and continuing to move between stage, screen and voice work without being boxed into one kind of role.</p><p>Humanitarian aid and charity work matter to him. The AU establishes that he has taken part in charity visits and wants to help; specific organizations, amounts and campaigns have not been named here.</p><h3>Advice for students and new artists</h3><p><b>Alfie:</b> You are allowed to be new. Ask questions, learn people's names, respect the crew, and keep something in your life that is not for work. You can be ambitious and still set boundaries. If you feel anxious, you do not have to turn it into a performance—ask someone safe for help.</p>` },
    { label:'Credits & music index', html:`<p class="eyebrow">REFERENCE PAGES</p><h2>Filmography & stage work</h2><p>This AU career index reflects the formats and timeline described by the reader. A complete named title list was not supplied, so entries are grouped rather than fabricated.</p><ul><li>Babyhood — television commercials (first screen appearances)</li><li>Early stage — Broadway musicals and stage plays, following Alistair and Valerie's example</li><li>Television — big and small roles, including a coming-of-age mystery drama</li><li>Film — franchise, standalone and independent projects</li><li>Voice acting — animated and other voice roles; titles not yet specified</li><li>Stage — musicals, plays and Broadway work across his career</li><li>Upcoming — music projects and short films he hopes to help direct and film; details unannounced</li></ul><h2>Music discography</h2><ul><li>Guitar, piano, vocals and songwriting are established interests</li><li>Half-finished lyrics and works-in-progress appear in his journal</li><li>Upcoming releases and track titles: not yet specified</li></ul><p class="smallprint">Add confirmed AU project titles, roles, years and albums as they are created. No real-world credits are implied.</p>` },
    { label:'Awards & acknowledgements', html:`<p class="eyebrow">RECOGNITION</p><h2>Nominations and wins</h2><p>In this AU, Alphonse has more wins than nominations. The reader-established honors include wins associated with the Kids’ Choice Awards, Emmy, Critics Choice and BAFTA, including a Best Actor win. Specific years, category names and ceremony editions remain unspecified.</p><ul><li>Kids’ Choice Awards — wins (categories/years not specified)</li><li>Emmy — wins (categories/years not specified)</li><li>Critics Choice — wins (categories/years not specified)</li><li>BAFTA — wins (categories/years not specified)</li><li>SAG Award — future goal</li><li>EGOT — long-term ambition</li></ul><h2>Humanitarian aid & charity</h2><p>Alfie has participated in charity visits and humanitarian aid contributions in the AU. Specific organizations and contributions have not been provided; this page avoids inventing them.</p><h2>Thank you</h2><p>To my family, Charlotte, my friends, every co-star, every crew member and everyone who has made a set, a stage or a school day feel safer: thank you. To the people reading this—thank you for caring about the work and letting me still be a person outside it. And to my grandmother, I carry you with me.</p><p class="pullquote">— Alphonse</p>` },
    { label:'Q&A, trivia & quiz', html:`<p class="eyebrow">TURN THE PAGE · TEST YOUR MEMORY</p><h2>Quick Q&A</h2><dl><dt>What school does Alfie attend?</dt><dd>Starlight Performing Arts High School in New York.</dd><dt>What instruments does he play?</dt><dd>Guitar and piano; he also sings and writes songs.</dd><dt>What is his girlfriend's name?</dt><dd>Charlotte Sanders, who attends a different school.</dd><dt>What is the island school?</dt><dd>Momos Academy for Boys, on fictional Momosu Island.</dd><dt>What award goals does he have?</dt><dd>A SAG Award and, someday, an EGOT.</dd></dl><h3>Trivia</h3><ul><li>His first TV appearances were commercials when he was a baby.</li><li>Tobias encouraged his music and hosting interests.</li><li>He still likes discreet airport exits, even though he is more comfortable with crowds now.</li><li>Anne-Marie the Persian cat has a habit of sitting on scripts.</li></ul><h3>Reader quiz</h3><p>Which sibling encouraged Alfie to explore music and hosting?</p><div class="quiz"><button data-answer="no">Alistair</button><button data-answer="yes">Tobias</button><button data-answer="no">Valerie</button><p aria-live="polite">Choose an answer.</p></div><p class="smallprint">Answers and facts on this page refer to the fictional AU issue only.</p>` }
  ];

  function openView(id, label, title, mode) {
    if (document.querySelector(`#view-${id}`)) return;
    // The home screen already has icons for these apps; only add one if it's missing.
    let icon = document.querySelector(`#home [data-app="${id}"]`);
    if (!icon) {
      icon = document.createElement('button');
      icon.className = 'app-icon';
      icon.dataset.app = id;
      icon.innerHTML = `<span class="icon-tile" style="background:linear-gradient(145deg,#fff1ce,#c99b61)">${id === 'newspaper' ? '📰' : id === 'magazine' ? '📖' : 'W'}</span>${label}`;
      grid.appendChild(icon);
    }

    const view = document.createElement('section');
    view.className = 'app-view';
    view.id = `view-${id}`;
    const header = `<header class="app-header"><button class="back-btn">‹ Home</button><h2>${title}</h2><span></span></header>`;

    if (mode === 'magazine') {
      view.innerHTML = `${header}<style>
        .flipbook{flex:1;display:flex;flex-direction:column;min-height:0;background:linear-gradient(180deg,#171a22,#10131b);padding:10px;overflow:hidden;}
        .mag-paper-wrap{position:relative;flex:1;display:grid;place-items:center;overflow:hidden;padding:6px 0;}
        .mag-paper{position:relative;width:min(100%, 690px);height:100%;max-height:100%;overflow:auto;background:#fffaf0;color:#2f2a27;box-shadow:0 20px 35px rgba(0,0,0,.35);padding:clamp(18px,4vw,38px);line-height:1.55;border:1px solid rgba(0,0,0,.08);transform-origin:center center;transition:transform .55s cubic-bezier(.24,.75,.2,1), box-shadow .55s ease, filter .55s ease;}
        .mag-paper::before{content:"";position:absolute;inset:0 0 0 auto;width:10px;background:linear-gradient(90deg,rgba(45,35,20,.08),rgba(45,35,20,.02),transparent);pointer-events:none;}
        .mag-paper.turn-left{transform:perspective(1200px) rotateY(-12deg) translateX(-12px);filter:saturate(.9);box-shadow:0 12px 26px rgba(0,0,0,.28);}
        .mag-paper.turn-right{transform:perspective(1200px) rotateY(12deg) translateX(12px);filter:saturate(.9);box-shadow:0 12px 26px rgba(0,0,0,.28);}
        .mag-paper h1{font-size:clamp(30px,8vw,62px);line-height:.94;margin:6px 0 14px;color:#642d3b;letter-spacing:-.04em;font-family:Georgia,serif;}
        .mag-paper h2{font-size:clamp(24px,6vw,34px);line-height:1.08;margin:18px 0 12px;color:#642d3b;font-family:Georgia,serif;border-bottom:1px solid #d5b89a;padding-bottom:8px;}
        .mag-paper h3{font-size:21px;margin:18px 0 8px;color:#642d3b;font-family:Georgia,serif;}
        .mag-paper p{margin:10px 0;}
        .mag-paper .eyebrow,.mag-paper .smallprint{font:10px Arial,sans-serif;letter-spacing:.12em;color:#77675d;text-transform:uppercase;}
        .mag-paper .smallprint{letter-spacing:0;text-transform:none;}
        .mag-paper .cover-deck{font-size:19px;font-style:italic;color:#473c34;}
        .mag-paper .cover-art{margin:24px 0;padding:28px 12px;border-top:1px solid #d7c1a1;border-bottom:1px solid #d7c1a1;text-align:center;font-size:19px;color:#3d302c;background:linear-gradient(180deg,#f8f1ea,#f5ebdf);}
        .mag-paper .pullquote{margin:18px 0;padding-left:14px;border-left:3px solid #b08154;font-size:22px;font-style:italic;color:#642d3b;line-height:1.3;}
        .mag-paper .contents{padding-left:24px;line-height:1.8;}
        .mag-paper dl{margin-top:12px;}
        .mag-paper dt{font-weight:700;color:#2d291f;margin-top:12px;}
        .mag-paper dd{margin:6px 0 0 0;}
        .mag-paper .quiz{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;}
        .mag-paper .quiz button{background:#fff;border:1px solid #bea98f;border-radius:18px;padding:8px 12px;cursor:pointer;font:12px Arial,sans-serif;}
        .mag-paper .quiz p[aria-live]{margin-top:10px;padding-top:10px;border-top:1px solid #d5cab6;}
        .mag-controls{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 8px 6px;color:#fff;font:12px Arial,sans-serif;}
        .mag-controls button,.mag-toc{background:#fff;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:8px 12px;color:#1b1d22;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,.15);}
        .mag-controls button:disabled{opacity:.55;cursor:not-allowed;}
        .mag-toc{display:block;margin:0 auto 4px;background:#f7f1eb;color:#222;}
        .mag-page-no{min-width:140px;text-align:center;white-space:nowrap;}
      </style><div class="flipbook"><div class="mag-paper-wrap"><article class="mag-paper" aria-live="polite"></article></div><button class="mag-toc" type="button">Issue contents</button><nav class="mag-controls" aria-label="Magazine pages"><button data-prev type="button">‹ Previous</button><span class="mag-page-no"></span><button data-next type="button">Next ›</button></nav></div>`;
    } else if (mode === 'news') {
      view.innerHTML = `${header}<style>.beacon{flex:1;overflow:auto;background:#f4f0e7;color:#20232b;padding:12px;font:14px Georgia,serif}.beacon h1{text-align:center;font-size:30px;margin:6px}.beacon .dek{text-align:center;color:#555}.beacon nav{display:flex;gap:5px;overflow:auto;padding:8px 0}.beacon button{border:1px solid #999;background:#fff;padding:7px;border-radius:16px;white-space:nowrap}.beacon .selected{background:#17233d;color:#fff}.beacon input{width:100%;padding:9px;margin:7px 0}.beacon article{border-bottom:1px solid #aaa;padding:12px 0}.beacon h3{font-size:21px;margin:5px 0}.beacon p{line-height:1.45}.beacon small{color:#765044}.beacon .comments{font:12px Arial,sans-serif}.beacon .comments p{border-top:1px solid #ccc;padding-top:5px}.beacon form{display:flex;gap:5px}.beacon form input{flex:1;min-width:0}.beacon .story-actions{display:flex;gap:6px}.beacon .hide{display:none!important}</style><div class="beacon"><p class="dek">NEW YORK · CAMPUS · CULTURE · CITY</p><h1>The Borough Beacon</h1><p class="dek">A fictional newspaper from Alfie's AU</p><nav>${[['all','Top Stories'],['campus','Campus'],['arts','Arts'],['city','City'],['odd','Unexplained']].map(([key,name])=>`<button data-filter="${key}" class="${key==='all'?'selected':''}">${name}</button>`).join('')}</nav><input type="search" placeholder="Search this edition" aria-label="Search articles"><div class="beacon-stories"></div><p class="dek">Fictional AU news · Comments stay on this device.</p></div>`;
    } else {
      view.innerHTML = `${header}<iframe title="${title}" src="./wiki.html" style="border:0;width:100%;height:100%;flex:1;background:#f4f0e7"></iframe>`;
    }

    screen.appendChild(view);
    // Opening is handled by the delegated home-screen click handler in index.html.
    view.querySelector('.back-btn').addEventListener('click', () => {
      view.classList.remove('active');
      document.querySelector('#home').style.display = 'flex';
    });

    if (mode === 'magazine') {
      let page = 0;
      const paper = view.querySelector('.mag-paper');
      const pageNo = view.querySelector('.mag-page-no');
      const prev = view.querySelector('[data-prev]');
      const next = view.querySelector('[data-next]');

      const render = () => {
        const current = magazinePages[page];
        paper.classList.remove('turn-left', 'turn-right');
        paper.innerHTML = current.html;
        pageNo.textContent = `${page + 1} / ${magazinePages.length} · ${current.label}`;
        prev.disabled = page === 0;
        next.disabled = page === magazinePages.length - 1;
      };

      const turn = (direction) => {
        if (direction === 'next' && page >= magazinePages.length - 1) return;
        if (direction === 'prev' && page <= 0) return;
        paper.classList.remove('turn-left', 'turn-right');
        void paper.offsetWidth;
        paper.classList.add(direction === 'next' ? 'turn-left' : 'turn-right');
        setTimeout(() => {
          page = direction === 'next' ? page + 1 : page - 1;
          render();
        }, 260);
      };

      prev.onclick = () => turn('prev');
      next.onclick = () => turn('next');
      view.querySelector('.mag-toc').onclick = () => {
        const list = magazinePages.map((item, index) => `${index + 1}. ${item.label}`).join('\n');
        const choice = prompt(`Go to a page:\n${list}`);
        const target = Number(choice) - 1;
        if (Number.isInteger(target) && target >= 0 && target < magazinePages.length) {
          page = target;
          render();
        }
      };

      paper.addEventListener('click', (event) => {
        const button = event.target.closest('[data-answer]');
        if (!button) return;
        const result = paper.querySelector('.quiz [aria-live]');
        result.textContent = button.dataset.answer === 'yes'
          ? 'Correct—Tobias encouraged Alfie to explore music and hosting.'
          : 'Not quite. Try another answer.';
      });

      render();
    }

    if (mode === 'news') {
      const root = view.querySelector('.beacon-stories');
      stories.forEach(([category, tag, title, body]) => {
        const article = document.createElement('article');
        article.dataset.category = category;
        article.innerHTML = `<small>${tag}</small><h3></h3><p></p><div class="story-actions"><button class="like">♡ <span>0</span></button><button class="comment-toggle">Comment</button></div><div class="comments" hidden><form><input placeholder="Add a thought" aria-label="Comment"><button>Send</button></form><div></div></div>`;
        article.querySelector('h3').textContent = title;
        article.querySelector('p').textContent = body;
        root.appendChild(article);
      });
      const filter = (category, query = '') => {
        root.querySelectorAll('article').forEach((article) => {
          article.classList.toggle('hide', !(category === 'all' || article.dataset.category === category) || !article.textContent.toLowerCase().includes(query));
        });
      };
      view.querySelectorAll('[data-filter]').forEach((button) => {
        button.addEventListener('click', () => {
          view.querySelector('.selected')?.classList.remove('selected');
          button.classList.add('selected');
          filter(button.dataset.filter, view.querySelector('input[type=search]').value.toLowerCase());
        });
      });
      view.querySelector('input[type=search]').addEventListener('input', (event) => {
        filter(view.querySelector('.selected').dataset.filter, event.target.value.toLowerCase());
      });
      root.addEventListener('click', (event) => {
        const article = event.target.closest('article');
        if (!article) return;
        if (event.target.closest('.like')) {
          const button = event.target.closest('.like');
          const count = button.querySelector('span');
          const liked = button.dataset.liked === '1';
          button.dataset.liked = liked ? '0' : '1';
          count.textContent = String(Number(count.textContent) + (liked ? -1 : 1));
          button.firstChild.textContent = liked ? '♡ ' : '♥ ';
        }
        if (event.target.closest('.comment-toggle')) {
          article.querySelector('.comments').hidden = !article.querySelector('.comments').hidden;
        }
      });
      root.addEventListener('submit', async (event) => {
        if (!event.target.matches('form')) return;
        event.preventDefault();
        const input = event.target.querySelector('input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        const comments = event.target.nextElementSibling;
        const article = event.target.closest('article');
        const mine = document.createElement('p');
        mine.textContent = `You: ${text}`;
        comments.appendChild(mine);
        const his = document.createElement('p');
        his.className = 'pending';
        his.textContent = 'Alfie Summers ✓ is replying…';
        comments.appendChild(his);
        const context = `Article: "${article.querySelector('h3').textContent}" — ${article.querySelector('p').textContent}`;
        const reply = window.Alfie ? await window.Alfie.ask('beacon_comment', text, { context }) : null;
        his.classList.remove('pending');
        his.textContent = `Alfie Summers ✓: ${reply || (/ring|light|park|alien/i.test(text) ? 'i saw something that night too. still not sure what it was tbh' : 'appreciate you reading this one')}`;
      });
    }
  }

  openView('newspaper', 'Beacon', 'The Borough Beacon', 'news');
  openView('wiki', 'Wikipedia', 'Alphonse Summers · AU Wiki', 'wiki');
  openView('magazine', 'Spotlight', 'Spotlight · Special Issue', 'magazine');
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPhoneApps, { once: true });
else initPhoneApps();
