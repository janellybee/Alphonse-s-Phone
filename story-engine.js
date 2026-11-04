/* Alfie's story engine: all dialogue is written locally (no live AI).
   - A branching, chapter-based storyline that advances every five minutes.
   - Context-aware replies that avoid repeating themselves and remember the reader.
   - Reply choices, typing indicators, unread badges, and story beats across Messages, Discord, and Forums. */
(() => {
  'use strict';
  const BEAT_MS = 300000; // five minutes
  const STORE = 'alfie-story-v4';
  const CHAT = 'alfie-chat-v4';
  const DISCORD = 'alfie-discord-v4';
  const $ = (s) => document.querySelector(s);
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (_) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const fresh = () => ({ beat: 0, chapter: -1, flags: {}, name: '', likes: [], used: [], msgCount: 0, lastBeatAt: 0, lastPullAt: 0, unread: 0, pending: null, forum: [], ambient: [] });
  const state = Object.assign(fresh(), load(STORE, {}));
  const persist = () => save(STORE, state);

  /* ---------- small helpers ---------- */
  const fill = (s) => String(s)
    .replace(/\{name\}/g, state.name ? ` ${state.name}` : '')
    .replace(/\{like\}/g, state.likes[state.likes.length - 1] || 'that')
    .trim();
  const resolve = (v) => (typeof v === 'function' ? v(state) : v);
  const lines = (v) => [].concat(resolve(v)).filter(Boolean).map(fill);
  // Non-repeating pick: remembers recently used lines across sessions.
  function pick(pool, key) {
    const list = resolve(pool);
    if (!list || !list.length) return '';
    const unused = list.map((_, i) => i).filter((i) => !state.used.includes(`${key}:${i}`));
    const options = unused.length ? unused : list.map((_, i) => i);
    if (!unused.length) state.used = state.used.filter((u) => !u.startsWith(`${key}:`));
    const i = options[Math.floor(Math.random() * options.length)];
    state.used = [...state.used, `${key}:${i}`].slice(-260);
    return list[i];
  }
  const chance = (p) => Math.random() < p;
  const nyHour = () => Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));

  /* ---------- the storyline ---------- */
  const CHAPTERS = [
    'Chapter 1 · The prop that wasn’t',
    'Chapter 2 · Lights by the river',
    'Chapter 3 · The archivist',
    'Chapter 4 · Tech week',
    'Chapter 5 · The first tide',
    'Afterward · Between tides'
  ];
  const beats = [
    // Chapter 1
    { ch: 0, where: 'dm', key: /ring|prop|warm/i, text: ['Okay, weird question.', 'If a ring sat in your pocket all day, would it be normal for it to be *warmer* than your pocket?'],
      choices: [
        { label: 'That’s not normal 😳', flag: 'worried', reply: ['Thank you. Validation. I’ve been telling myself it’s body heat for six hours.', 'It’s not body heat. I left it on the windowsill for an hour and it stayed warm.'] },
        { label: 'Probably body heat?', reply: ['That’s what I said! Then I left it on the windowsill for an hour and it was still warm. So. Hm.'] },
        { label: 'Wait, what ring?', reply: ['The wrap party one. It was on the floor by the prop table, so I pocketed it to give back to wardrobe.', 'Then I forgot. For three days. Classic me.'] }
      ] },
    { ch: 0, where: 'discord', text: [['Priya · wardrobe', '@Alfie we inventoried all the costume jewelry. The ring you described isn’t ours. Nothing in our books even looks like it.'], ['Maya · co-star', 'so whose is it??'], ['Charlotte', 'Alfie, you’ve been typing and deleting for five minutes. I can see the dots.']] },
    { ch: 0, where: 'dm', key: /ring|wardrobe|whose/i, text: ['Wardrobe says it’s not theirs.', 'So I’ve had a mystery ring in my jacket like it’s a gum wrapper. I’m going to be very calm about this.'],
      choices: [
        { label: 'Put it somewhere safe', flag: 'safe', reply: ['Done. It’s in my guitar case. Anne-Marie immediately sat on the case.', 'She’s either guarding it or claiming it. Hard to tell with her.'] },
        { label: 'Try it on 👀', flag: 'triedOn', reply: ['Absolutely not. I’ve seen movies.', '…Okay, I tried it on for one second. It got bright. I took it off. We’re not talking about it.'] }
      ] },
    { ch: 0, where: 'forum', text: 'does anyone know why the black box lights flickered during sophomore scene study? tech crew swears the board was fine' },
    { ch: 0, where: 'discord', text: [['Charlotte', 'Fries after rehearsal? You owe me for returning your script. Twice.'], ['Alfie', 'i owe you fries for life at this point'], ['Charlotte', 'Correct. Also you’ve been weird all day. Fries and talking.']] },
    { ch: 0, where: 'dm', text: (s) => [s.flags.triedOn ? 'Remember the bright thing we weren’t talking about? It did it again. Without me touching it.' : 'The ring glowed tonight. I didn’t touch it. The guitar-case zipper was lit up like a jack-o’-lantern.', 'Charlotte saw it. She didn’t freak out. She just said “okay, so what do we do,” which is the most Charlotte thing ever.'] },
    // Chapter 2
    { ch: 1, where: 'forum', text: 'riverside path last night around 11. floating lights. like JELLYFISH?? no sound, not drones. am i losing it' },
    { ch: 1, where: 'dm', key: /river|park|light|jellyfish|forum/i, text: ['Did you see the forum post about the river lights?', 'I was there. Not on purpose! I was walking Dex. Dex was very brave. Dex hid in my hoodie.'],
      choices: [
        { label: 'What did you see?!', reply: ['Jellyfish made of light. Five or six, drifting over the water at head height.', 'And the ring hummed. Like a phone on vibrate, but in my bones.'] },
        { label: 'Are you okay?', flag: 'caring', reply: ['Yeah. Shaky. I sat on a bench and did the counting thing until my hands stopped buzzing.', 'Thanks for asking that first. Most people would ask about the lights.'] }
      ] },
    { ch: 1, where: 'dm', key: /unknown|number|text|who/i, text: ['This just came from an unknown number:', '“You should stop asking about the lights in the park.”', 'I haven’t asked anyone. Except you. And Charlotte.'],
      choices: [
        { label: 'Block them', flag: 'blocked', reply: ['Blocked.', 'Ten seconds later, a different number: “Blocking us is fair.” US?? Who is us?'] },
        { label: 'Reply: “Who is this?”', flag: 'replied', reply: ['Sent. They said: “Someone who keeps records.”', 'That’s not an answer! That’s a job description!'] },
        { label: 'Tell Riley', flag: 'toldRiley', reply: ['Told Riley. She’s looping in security and changing my route home.', 'I feel better, honestly. Adults: occasionally useful.'] }
      ] },
    { ch: 1, where: 'discord', text: [['Maya · co-star', 'the river lights are on the Borough Beacon. a student said they looked “like a film effect except nobody was filming”'], ['Alfie', '…that was me. i said that.'], ['Maya · co-star', 'ALFIE']] },
    { ch: 1, where: 'dm', key: /river|bench|spiral|park/i, text: ['I went back to the river. In daylight, with Charlotte. Don’t worry.', 'There’s a mark on the bench where I sat. Like frost, except it’s 18 degrees out. Shaped like a little spiral.', 'The ring has the same spiral. On the inside of the band. I never noticed until now.'] },
    { ch: 1, where: 'discord', text: [['Charlotte', 'Found the spiral. The public library’s reading room has an old astronomy archive. People call the archivist there “unsettlingly knowledgeable.”'], ['Alfie', 'that’s either a great lead or the start of a horror movie']] },
    // Chapter 3
    { ch: 2, where: 'dm', key: /library|archiv|bring|ring/i, text: ['We’re going to the library after school tomorrow.', 'Should I bring the ring or leave it home?'],
      choices: [
        { label: 'Bring it', flag: 'broughtRing', reply: ['Yeah. If they know what it is, they’ll want to see it.', 'Wrapping it in a sock. Very dignified.'] },
        { label: 'Leave it home', flag: 'leftRing', reply: ['Smart. I’ll take photos. Anne-Marie can guard it. She takes her duties seriously.'] }
      ] },
    { ch: 2, where: 'dm', key: /archivist|library|who|what happened/i, text: (s) => ['Okay. The archivist. Her name is Ms. Oduya. She wears gloves to touch old books, and she looked at me like she’d been expecting me.', s.flags.broughtRing ? 'The second I took the ring out of the sock, every lamp in the reading room dimmed. She just said, “Ah. So it found someone.”' : 'I showed her the photos. She went quiet and said, “You left it at home? It won’t like that.” WHAT DOES THAT MEAN', 'She called it a Stellaris key.'] },
    { ch: 2, where: 'dm', key: /stellaris|drifter|keeper|what is/i, text: ['Stellaris isn’t a company or a band, which were my two guesses.', 'Ms. Oduya says it’s a kind of current between stars. The jellyfish things are “drifters.” They follow it. The ring lets you hear it.', 'She said keepers find the ring when they’re “between one life and another.” I said I’m a sophomore, I’m between lunch and fourth period.'],
      choices: [
        { label: 'That’s terrifying', reply: ['RIGHT? Thank you. Charlotte said “that’s so cool,” and I love her, but that was the wrong reaction.'] },
        { label: 'That’s kind of amazing', flag: 'wonder', reply: ['…Yeah. Okay. It kind of is.', 'When it hums I feel less alone. Is that weird? Don’t answer that.'] }
      ] },
    { ch: 2, where: 'discord', text: [['Maya · co-star', 'why is Alfie’s guitar case GLOWING in the green room'], ['Alfie', 'new tuner'], ['Maya · co-star', 'it’s humming in C sharp, Alfie'], ['Charlotte', '😐']] },
    { ch: 2, where: 'dm', text: (s) => ['One more thing from the library. As we left, Ms. Oduya said, “I’m sorry about the texts. Keepers attract attention. I needed to see if you’d listen.”', 'SHE was the unknown number.', s.flags.replied ? '“Someone who keeps records” was literally a librarian. I’m going to scream into a pillow.' : s.flags.blocked ? 'I blocked a librarian. Twice. My mom would be so disappointed.' : s.flags.toldRiley ? 'Riley is going to have a very strange conversation with security.' : 'I can’t decide if that’s comforting or the creepiest thing that’s ever happened to me.'] },
    // Chapter 4
    { ch: 3, where: 'discord', text: [['Jonah · tech crew', 'tech week starts tomorrow. if ANYONE touches my lighting board i will haunt you'], ['Alfie', 'noted'], ['Jonah · tech crew', 'especially you, ring boy'], ['Alfie', 'HOW DO YOU KNOW ABOUT'], ['Jonah · tech crew', 'everyone knows. your guitar case glows, dude']] },
    { ch: 3, where: 'dm', key: /show|tech|rehears|ring|drifter/i, text: ['Tech run tonight. Every time I hit my mark in act two, the ring buzzes. It’s in my pocket, not on my hand.', 'I think the drifters like music. Ms. Oduya said they follow “strong currents.” Apparently a full company number counts.'],
      choices: [
        { label: 'Don’t wear it for the show', flag: 'charlotteHolds', reply: ['That’s the plan. Charlotte will hold it in the wings.', 'She called herself “the ring’s understudy.”'] },
        { label: 'Maybe it wants to help', flag: 'trust', reply: ['Maybe? It doesn’t feel mean. It feels… curious. Like a kid with its face pressed against a window.'] }
      ] },
    { ch: 3, where: 'forum', text: 'sophomore showcase opens in 2 days and the black box lights keep doing a WAVE. tech crew says it’s not them. jonah is losing it' },
    { ch: 3, where: 'dm', key: /show|opening|night|how did/i, text: (s) => ['Opening night.', s.flags.charlotteHolds ? 'Mid-song, Charlotte texted one word from the wings: “GLOWING.” I could see it from the stage. A little star in her hands.' : 'Mid-song I felt the ring warm up in my pocket, and I just… kept singing.', 'Then the drifters came through the ceiling like it wasn’t there. Floating over the audience. Soft blue.', 'Nobody screamed. People thought it was part of the show. Jonah took a bow.'] },
    { ch: 3, where: 'discord', text: [['Maya · co-star', 'THE REVIEW SAYS “innovative projection design” 😭😭'], ['Jonah · tech crew', 'accepting all compliments, answering zero questions'], ['Charlotte', 'Proud of you, Alfie. Even the glowing parts.']] },
    { ch: 3, where: 'dm', text: ['Can I be honest for a sec?', 'After the show I had a panic attack in the bathroom. A small one. Apparently good nights count too.', 'I’m okay now. Charlotte sat with me on the costume-shop floor. I just keep thinking: what if next time it isn’t a friendly crowd?'],
      choices: [
        { label: 'You’re not alone in this', flag: 'support', reply: ['…Thank you. I needed that one. Writing it in my journal.'] },
        { label: 'Talk to Ms. Oduya?', reply: ['Yeah. Next move. Ask questions before I panic about the answers.', 'Very mature of me. Gross.'] }
      ] },
    // Chapter 5
    { ch: 4, where: 'dm', key: /oduya|tide|current|what now|next/i, text: ['Ms. Oduya called. An actual phone call, like it’s 1998.', 'She says the drifters gathered at the show because the current is getting stronger near the city. A “tide” is coming. Keepers guide drifters through so they don’t get lost.', 'I asked what happens if they get lost. She said, “Blackouts, mostly. Sometimes worse.”'] },
    { ch: 4, where: 'dm', text: ['Family chat update, for normal-life balance:', 'Liliana: “Anne-Marie stole your chair again.”\nMom: “Call when you finish homework.”\nTobias: “saw the showcase clips. the blue lights?? nice”', 'My brother thinks it was lighting design. I’m letting him.'] },
    { ch: 4, where: 'forum', text: 'power flickered on the whole riverside block at 2am. my building’s lights did the blue thing. anyone else??' },
    { ch: 4, where: 'dm', key: /tide|saturday|parents|mom|river/i, text: ['The tide is Saturday night. Ms. Oduya says I need to be at the river and “listen.” That’s the whole instruction. Listen.', 'Charlotte’s coming. Maya’s coming because she “refuses to miss lore.” Jonah’s bringing a battery spotlight “for vibes.”', 'Should I tell my parents?'],
      choices: [
        { label: 'Yes, tell them', flag: 'toldMom', reply: ['…Yeah. I called Mom. I didn’t tell her everything. I said I’m doing something brave and a little scary, and I’ll call after.', 'She said, “Brave and scared at the same time is the only kind of brave there is.” I cried a normal amount.'] },
        { label: 'After it’s over', reply: ['Okay. After. When I can explain it without sounding like I need a nap. Which I do.'] }
      ] },
    { ch: 4, where: 'discord', text: [['Charlotte', 'Saturday. Snacks, blankets, emotional support.'], ['Maya · co-star', 'and LORE'], ['Jonah · tech crew', 'spotlight is charged. vibes are charged.'], ['Alfie', 'i love you all and i’m going to throw up']] },
    { ch: 4, where: 'dm', key: /tide|what happened|how did|saturday/i, text: (s) => ['11:58 p.m. The river’s quiet. Then it isn’t.', 'Hundreds of drifters, as far as I can see. The ring is so bright Charlotte’s shadow is behind her.', 'I didn’t do anything magical. I just played the four chords I always play when I’m nervous.', 'They followed the song out past the bridge, up, and gone. Jonah’s spotlight died. Every light on the river stayed on.', (s.flags.support || s.flags.caring) ? 'You told me I wasn’t alone in this. I wasn’t. Thank you.' : 'I’m shaking. The good kind, I think.'] },
    { ch: 4, where: 'dm', text: (s) => ['Ms. Oduya texted: “Well done, keeper. That was the first tide.”', 'FIRST.', s.flags.toldMom ? 'Called Mom like I promised. She said she’s proud of me and that I sound tired. Both true.' : 'Okay. Tomorrow’s problem.', 'Tonight I’m eating poutine with my friends and not thinking about it. (I’m going to think about it.)'] }
  ];
  // Once the main arc finishes, the world keeps going with non-repeating "between tides" moments.
  const ambient = [
    { where: 'dm', text: ['The ring hummed in a minor key today. That’s new. I’m choosing not to read into it. (I’m reading into it.)'] },
    { where: 'discord', text: [['Maya · co-star', 'who left a mochi on my script? not mad, just want to know who to thank'], ['Alfie', 'no idea 😇']] },
    { where: 'forum', text: 'saw one tiny drifter in the 34th st subway station. it was just floating by the platform like it was waiting for the train too' },
    { where: 'dm', text: ['Ms. Oduya gave me homework. Actual reading. A 200-year-old keeper’s journal.', 'Page one: “Do not attempt to befriend the drifters.” Page two: a drawing of a drifter with a little hat.'] },
    { where: 'discord', text: [['Jonah · tech crew', 'my spotlight still won’t turn off. it’s been 3 days. it’s just… on'], ['Charlotte', 'Maybe it’s a keeper now.'], ['Jonah · tech crew', 'don’t give it ideas']] },
    { where: 'dm', text: ['Anne-Marie has figured out the ring is warm. She sleeps on my nightstand now. She has never looked more smug.'] },
    { where: 'dm', text: ['Got a callback for a voice role today! It’s a cartoon sea creature.', 'Given recent events, I feel uniquely qualified.'] },
    { where: 'discord', text: [['Charlotte', 'Alfie wrote a song about the river. He won’t show anyone.'], ['Alfie', 'it’s not done'], ['Charlotte', 'It’s been done for a week.']] },
    { where: 'forum', text: 'is it just me or does the black box feel warmer since the showcase. like the room is in a good mood' },
    { where: 'dm', text: ['Question. If you had a ring that could hear the stars, what would you want it to tell you?'], choices: [
      { label: 'Whether we’re alone', reply: ['I asked it that once. It got warm. I’m counting that as “no.”'] },
      { label: 'Something kind', reply: ['That’s a good answer. I think it does that, sometimes. Quietly.'] }
    ] },
    { where: 'dm', text: ['Riley found a gap in my schedule and filled it with “REST.” In capitals. I’ve been told to treat it like a call time.'] },
    { where: 'discord', text: [['Priya · wardrobe', 'the costume shop smells faintly of ozone ever since your little floor sit-in, Alfie'], ['Alfie', 'sorry??'], ['Priya · wardrobe', 'don’t be. the fabric dye has never looked better']] },
    { where: 'dm', text: ['Ms. Oduya says the next tide isn’t for months. Charlotte made a countdown. It has stickers.'] },
    { where: 'forum', text: 'anonymous confession: i saw who played guitar by the river on saturday and i will take it to my grave. thank you, whoever you are' },
    { where: 'dm', text: ['Mayfield did the calm-horse thing when I visited the stables. Ring in my pocket the whole time. He just leaned his head on my shoulder.', 'Animals know stuff. That’s my official position.'] }
  ];
  const recaps = [
    'Recap: I found a ring after the wrap party, thought it was a prop, and wardrobe says it isn’t theirs. It gets warm. Sometimes it glows.',
    'So far: lights shaped like jellyfish over the river, a creepy text from an unknown number, and a spiral on the bench that matches the ring.',
    'Where we are: an archivist named Ms. Oduya says the ring is a Stellaris key, the jellyfish are “drifters,” and she was the unknown number. Long week.',
    'Latest: the drifters showed up at our opening night, everyone thought it was projection design, and I’m trying to make sure next time goes okay.',
    'Big one: a “tide” of drifters passed through the river and I… guided them with four guitar chords? Ms. Oduya says it was only the first.',
    'Between tides now. Reading an old keeper’s journal, trying to be a normal sophomore, and failing in a fun way.'
  ];

  /* ---------- conversation pools ---------- */
  const pools = {
    greet: () => {
      const h = nyHour();
      return [
        h < 5 ? 'Hey! Why are you awake? (Says me, also awake.)' : h < 12 ? 'Morning! I’ve had one coffee and three existential thoughts. What’s up?' : h < 18 ? 'Hey! Between classes. What’s up?' : 'Hey, you. Just got back from rehearsal. What’s going on?',
        'Hi{name}! Good timing. I was about to do homework, so you’re saving me.',
        'Hey! Sorry if I’m slow. Anne-Marie is lying across my keyboard in protest.',
        'Oh, hi. I was literally just thinking I should text you.'
      ];
    },
    howareyou: () => [
      ['Honestly? Fine-ish. The ring is warm, and I’m pretending that’s normal.', 'Kind of jittery. Wardrobe swore the ring isn’t theirs, so whose is it?'],
      ['A little shaky since the river, but okay. Dex is sticking to me like velcro.', 'Tired. Didn’t sleep much after the lights. You?'],
      ['My brain is full of the word “Stellaris.” Otherwise good!', 'Weirdly calm? Ms. Oduya talks like she’s known me for years. It’s grounding and creepy at the same time.'],
      ['Running on adrenaline and craft-services granola bars.', 'Tech week is eating me alive, but in a good theatre way.'],
      ['Nervous. Excited. Mostly nervous.', 'Like the moment before you walk onstage, all the time.'],
      ['Good. Actually good. Being between tides suits me.', 'Peaceful. Suspiciously peaceful. I keep waiting for a plot twist.']
    ][Math.max(0, state.chapter)],
    joy: ['Wait, that’s great! Tell me everything.', 'Okay, I’m genuinely smiling at my phone. Charlotte’s asking what’s so funny.', 'Love that for you. Can I borrow some of that energy for tech week?'],
    support: ['That sounds rough. Want to talk about it, or do you want me to distract you with Anne-Marie stories?', 'I’m sorry. You don’t have to be okay right now. I’m here.', 'Bad days count. You got through this one, even if it was messy.'],
    laugh: ['Okay, that got me. 😂', 'You’re funnier than my co-stars, and they’re paid for it.', 'Ha! Screenshotting this for Charlotte.'],
    compliment: ['Stop, I’m going to turn red and my castmates will notice. …Thank you, though. Really.', 'That’s really kind. I’m saving it for the next bad audition day.', 'You’re going to make me cry in a Starbucks. Thank you.'],
    bye: ['Okay! Text me later? Something will definitely happen with the ring by then.', 'Night! Don’t let any mysterious jewelry follow you home.', 'Bye{name}! Thanks for keeping me company.'],
    joke: ['Why did the drifter break up with the lighthouse? It needed space. …I’ll see myself out.', 'What do you call a ring that won’t stop glowing? My entire problem.', 'My acting coach says I have great timing. Not with jokes, specifically.'],
    hobbies: ['I’ve been reading manga on the train. Currently crying over one about a lighthouse keeper. Topical.', 'Game nights with the cast get dangerously competitive. Maya flips boards.', 'I rewatch the same comfort show when I’m anxious. I know every line, which is weirdly calming.'],
    home: ['Vancouver will always be home-home. I miss the rain. Nobody believes me.', 'Canadian things I miss: real poutine, people apologizing to doors, and my family’s kitchen.', 'New York’s amazing, but sometimes I just want to stand by the ocean in Vancouver and be quiet.'],
    name: ['Nice to properly meet you,{name}. I’m saving your name in my phone. Correctly, this time.', '{name}. Got it. I’m good with names. Mostly. Crew names especially, since I’m working on it.'],
    unclear: [
      'I don’t want to guess wrong. Can you say a bit more?',
      'Hmm, I might be missing context. Which part are you asking about?',
      'I read that twice and I think my brain is still in rehearsal. Try me again?',
      'Wait, say more? I want to answer the actual question, not the one in my head.'
    ],
    sharing: ['Oh, {like}? Okay, I love that. What got you into it?', 'Wait, {like} is such a good answer. Tell me more.', 'Noted: {like}. I’m adding it to my list of things I know about you.', '{like}! I don’t know much about it, so teach me something.'],
    followUp: ['Anyway, how’s your day going?', 'What about you? What’s on your mind?', 'Okay, your turn. Tell me something good.', 'Do you ever have a week like that?', 'Can I ask you something? What would you do in my shoes?']
  };
  const topicFollow = {
    ring: ['Do you think I should keep it? Be honest.', 'Would you have touched it?'],
    food: ['What’s your comfort food?', 'Settle this: are donuts breakfast?'],
    music: ['What are you listening to lately?', 'Do you play anything?'],
    school: ['What’s school like for you?', 'What’s your hardest class?'],
    pets: ['Do you have pets? Please say yes. I need photos.'],
    family: ['Are you close with your family?', 'Big family or small?']
  };
  const facts = {
    charlotte: ['Charlotte notices when I’m pretending I’m fine. It’s annoying how good she is at that. I’m glad she’s around.', 'She’s easy to be with. I don’t have to turn every conversation into an interview.', 'She stole my hoodie and now claims it was always hers. I’ve accepted it.', (s) => (s.chapter >= 3 ? 'She held the ring in the wings like it was a baby bird. She’s braver than me.' : 'She saw the ring glow and just said, “Okay, so what do we do.” That’s Charlotte.')],
    family: ['My parents are Joanne and Dakota. My siblings are Tobias, Alistair, Valerie, twins Keira and Elias, and Liliana.', 'Seven kids total, counting me. The family chat is mostly scheduling and food photos. I miss the noise when I’m away.', 'I love them. I also mute the group chat when I have homework. Both things can be true.', 'Tobias is the one who got me into music and hosting. Don’t tell him I said that; he’ll be insufferable.'],
    ring: (s) => [
      ['It’s warm. Always. Wardrobe says it isn’t theirs. I’m out of normal explanations.', 'I keep checking my pocket for it. Like a phone, but haunted.'],
      ['It hummed at the river. Like it recognized the lights.', 'There’s a spiral on the inside of the band. I never noticed it until the bench.'],
      ['Ms. Oduya calls it a Stellaris key. It lets you hear the current between stars. I’m still processing that sentence.', 'Apparently it “found” me. I’d like to know why. I’m mostly a theatre kid with a cat.'],
      ['It reacts to music. Big numbers make it buzz. The drifters follow it.', 'I’m trying to trust it. It feels curious, not dangerous.'],
      ['The tide’s coming. The ring knows. It hasn’t cooled down in days.', 'I think the ring and I are on the same team now. Weird team.'],
      ['It’s quieter between tides. Sometimes it hums when I play guitar, like it’s singing along.', 'Ms. Oduya says keepers learn to “listen.” I’m practicing.']
    ][Math.max(0, s.chapter)],
    school: ['Starlight is my performing-arts high school. People care about the work there, not just about who got recognized in the hallway.', 'School and work overlap a lot. The teachers understand the schedule, but assignments are still due. Fair, honestly.', 'I left my script in the black box once this week. That’s progress.', 'Algebra is my villain origin story.'],
    work: ['The crew do so much that never makes it on screen. I try to learn names and say thanks.', 'My co-stars make long days easier. Mostly we trade snacks and complain about call times.', 'The costume team are brilliant. I still owe them an apology for assuming that ring was theirs.', 'Riley keeps my schedule humane. She’s scary in the best way.'],
    pets: ['Anne-Marie is my Persian cat, Dex is a chihuahua, Joyce is a teacup Pom, and Mayfield is my horse.', 'Anne-Marie sits on my scripts. Dex barks at the delivery person. Joyce is tiny and somehow louder than both.', 'Dex was there for the river lights. He hid in my hoodie. Hero behavior.'],
    food: ['Donuts and poutine are excellent post-rehearsal plans. I’m not claiming either is a balanced dinner.', 'Fruit mochi, apple pie, soufflé pancakes. I’m allergic to seafood, so I check ingredients.', 'I love spicy food, then immediately regret my confidence. Every time.'],
    music: ['Guitar gets me out of my head. Sometimes I write a song; sometimes I play the same four chords until I’m less tense.', 'Half-finished lyrics live in my journal. A lot are about missing home and wanting a snack.', 'Piano for slowing down. Guitar for making noise.', (s) => (s.chapter >= 4 ? 'Four nervous chords moved a tide of drifters. I’ll never complain about practicing scales again. (I will.)' : 'Weird thing: the ring buzzes when I play. I’m trying not to think about it.')],
    anxiety: ['That sounds like a lot to carry. What part is weighing on you most?', 'When I get overwhelmed, I try to make the next minute smaller. One breath. One thing I can see.', 'You don’t have to pretend you’re fine with me. Ever.'],
    fans: ['I’m grateful people care about the work. I get awkward when someone recognizes me, but I’m never annoyed.', 'I can’t answer every message, but I read a lot when I get a quiet minute. Some have fixed a rough day.'],
    acting: ['Every room asks for a slightly different version of brave. Stage is all at once; screen is in tiny pieces.', 'Auditions are a muscle. Mine is sore.', 'Voice acting is my secret favourite. Nobody can see me make faces.']
  };
  const patterns = [
    ['crisis', /kill myself|suicid|self.?harm|hurt myself|want to die|end it all/i],
    ['story', /what('?s| is) (new|up with (the )?(ring|story))|any (news|update)|update me|what happened( next)?|then what|and then|what now|tell me more|go on|what'?s going on|recap|catch me up/i],
    ['bye', /\b(bye|goodnight|good night|gtg|g2g|see (you|ya)|talk later|ttyl)\b/i],
    ['howareyou', /how (are|r) (you|u)|how'?s it going|how have you been|you (ok|okay|alright)\b|how do you feel/i],
    ['greet', /^(hi+|hello|hey+|yo|hiya|good (morning|afternoon|evening)|sup|what'?s up|wassup)\b/i],
    ['anxiety', /anxious|anxiety|panic|nervous|scared|afraid|overwhelmed|unsafe/i],
    ['support', /\b(sad|tired|bad day|stressed|lonely|upset|cry|crying|exhausted|rough day)\b/i],
    ['joy', /\b(happy|great news|good news|excited|passed|got the|i did it|yay)\b/i],
    ['compliment', /you'?re (so )?(cute|funny|amazing|talented|great|the best|cool|sweet)|big fan|proud of you|love you|love your/i],
    ['laugh', /\b(lol|lmao|haha+|hehe|rofl)\b|😂|🤣/i],
    ['joke', /\bjoke|make me laugh|something funny/i],
    ['charlotte', /charlotte|girlfriend|crush|relationship/i],
    ['family', /joanne|dakota|tobias|alistair|valerie|keira|elias|liliana|family|siblings?|brothers?|sisters?|\bmom\b|\bmum\b|\bdad\b|parents?/i],
    ['pets', /anne.?marie|\bdex\b|joyce|mayfield|\bcat\b|horse|dogs?\b|pets?\b/i],
    ['food', /food|\beat\b|donut|doughnut|poutine|mochi|pancake|apple pie|spicy|hungry|snack/i],
    ['ring', /stellaris|\bring\b|space|alien|jellyfish|drifter|archivist|oduya|cosmic|glow|powers?|keeper|tide|river|lights?/i],
    ['fans', /\bfans?\b|supporter|recogni[sz]e|autograph/i],
    ['acting', /acting|audition|role|broadway|voice act|character you play/i],
    ['work', /co.?stars?|\bcast\b|crew|costume|wardrobe|director|producer|riley|\bset\b|film|filming/i],
    ['school', /school|starlight|homework|class|teacher|rehearsal|theatre|theater|grade|sophomore|algebra/i],
    ['music', /song|music|guitar|piano|sing|lyrics|chords?/i],
    ['hobbies', /\bgames?\b|anime|manga|\bbooks?\b|movie|\bshow\b|watch|read/i],
    ['home', /canada|canadian|vancouver/i]
  ];
  const directs = [
    [/\b(who|what are the names|names?)\b.*\b(family|siblings|brothers|sisters|parents)\b|\bwho('?s| are| is)\b.*\b(mom|mum|dad|parents)\b/i, 'My parents are Joanne and Dakota. My siblings are Tobias, Alistair, Valerie, Keira, Elias, and Liliana.'],
    [/\b(how many)\b.*\b(siblings|kids|children|brothers|sisters)\b/i, 'Six siblings: Tobias, Alistair, Valerie, the twins Keira and Elias, and Liliana. Seven kids counting me. Dinner is chaos.'],
    [/\bwhat (pets?|animals)\b|\b(which|what kind of|what breed)\b.*\b(pets?|cat|dog|horse)\b|\b(pets?|animals)\b.*\b(names|called)\b/i, 'Anne-Marie is my Persian cat, Dex is a chihuahua, Joyce is a teacup Pom, and Mayfield is my horse.'],
    [/\b(what|which|any)\b.*\ballerg|\bseafood\b/i, 'Seafood. I’m allergic, so I check ingredients instead of guessing.'],
    [/\b(where|what|which)\b.*\b(school|do you study)\b/i, 'Starlight Performing Arts High School in New York. Sophomore year.'],
    [/\b(what|which)\b.*\binstruments?\b|\bdo you play (an |any )?(instruments?|guitar|piano)\b/i, 'Guitar and piano. I also sing and write songs, badly at first and then slightly less badly.'],
    [/\b(favou?rite)\b.*\b(food|dessert|snack)\b/i, 'Fruit mochi, apple pie, soufflé pancakes, and poutine. Never seafood, because I’m allergic.'],
    [/\b(how old|your age)\b/i, 'Sixteen. Old enough for call times, too young to be trusted with the rental car.'],
    [/\b(where are you from|where'?d you grow up|born)\b/i, 'Born in Vancouver, living in New York now. Canadian-American, and very loyal to poutine.'],
    [/\bwho('?s| is) charlotte\b/i, 'Charlotte’s my girlfriend. We know each other through Starlight and theatre, and she always notices when I’m not okay.'],
    [/\b(how|where) did you (find|get)\b.*\bring\b/i, 'Wrap party. It was on the floor by the prop table. I thought it was a costume prop. It very much wasn’t.'],
    [/\bwhat('?s| is) your (full |real )?name\b/i, 'Alphonse Benjamin Summers. Everyone says Alfie, except my mom when I’m in trouble.']
  ];
  const others = {
    Charlotte: ['He’s more okay than he looks. Mostly. I’m keeping an eye on him.', 'If this is about the ring: yes, it glows. No, we don’t know why yet. Yes, I’m bringing snacks.', 'Alfie left his script in the black box again. I brought it back. Don’t tell him I said “again.”', 'Honestly? I like that he cares this much about everything. Even when it gets him in trouble.'],
    'Maya · co-star': ['Long set days are survivable because of snacks and Alfie’s terrible jokes.', 'I refuse to miss any lore. Keep me posted.', 'Our trailer has a strict no-mysterious-jewelry policy now.'],
    'Jonah · tech crew': ['if this is about the lights, it wasn’t me. ever. nothing is ever me.', 'my board is innocent', 'cool. anyway, nobody touch the haze machine.']
  };

  function classify(text) { return patterns.find(([, re]) => re.test(text))?.[0] || 'unclear'; }
  function learn(text) {
    const n = text.match(/\b(?:my name is|my name's|call me|name'?s)\s+([A-Za-z][a-z'-]{1,15})/i);
    if (n) { state.name = n[1][0].toUpperCase() + n[1].slice(1); return 'name'; }
    const like = text.match(/\bi (?:really )?(?:like|love|enjoy)\s+([^.!?,]{2,30})/i);
    if (like && !/\byou\b/i.test(like[1])) { state.likes = [...state.likes, like[1].trim()].slice(-5); return 'like'; }
    return '';
  }

  /** Returns an array of 1–3 reply bubbles in Alfie's voice. */
  function compose(raw) {
    const text = String(raw || '').trim();
    if (!text) return ['I wanted to say something clever, but I blanked. Try again?'];
    state.msgCount += 1;
    const learned = learn(text);
    const topic = classify(text);
    const out = [];
    if (topic === 'crisis') return ['I’m really glad you told me. Please reach out to someone right now. In the US or Canada you can call or text 988, or contact local emergency services if you’re in danger.', 'I’m a story character, but you matter to real people. Please talk to someone you trust tonight.'];
    if (learned === 'name') out.push(fill(pick(pools.name, 'name')));
    const direct = directs.find(([re]) => re.test(text))?.[1];
    if (direct) out.push(direct);
    else if (topic === 'story') {
      out.push(recaps[Math.max(0, state.chapter)]);
      out.push(state.beat < beats.length ? 'And honestly? I think something else is about to happen. I’ll tell you the second it does.' : 'Ms. Oduya says the next tide is months away. So for now: normal life. Ish.');
    } else if (facts[topic]) out.push(pick(facts[topic], topic));
    else if (pools[topic] && topic !== 'unclear') out.push(pick(pools[topic], topic));
    else if (learned === 'like') out.push(pick(pools.sharing, 'sharing'));
    else if (!learned) {
      out.push(pick(pools.unclear, 'unclear'));
      if (state.likes.length && chance(0.5)) out.push(fill('Also, you said you like {like}. I keep thinking about that. Tell me more?'));
    }
    if (!learned && /\?\s*$/.test(text) === false && out.length < 2 && !['bye', 'crisis', 'name'].includes(topic) && chance(0.35)) {
      out.push(pick(topicFollow[topic] || pools.followUp, `fu-${topicFollow[topic] ? topic : 'gen'}`));
    }
    persist();
    return out.slice(0, 3).map(fill);
  }
  window.localReply = (message) => compose(message).join(' ');

  /* ---------- rendering ---------- */
  let chat = load(CHAT, null);
  const seedChat = () => [
    { from: 'them', text: 'Hey. I was trying to look cool and spilled coffee on my script. So. Much. Drama.' },
    { from: 'me', text: 'That sounds like a normal Tuesday.' },
    { from: 'them', text: 'It is. That’s the worst part.' },
    { from: 'them', text: 'Anyway. Ask me anything: school, Charlotte, my extremely loud family. Also something weird is going on with a ring, but I’ll get to that.' }
  ];
  if (!Array.isArray(chat) || !chat.length) chat = seedChat();
  let discord = load(DISCORD, null);
  if (!Array.isArray(discord) || !discord.length) discord = [['Maya · co-star', 'who has the revised pages for tomorrow'], ['Charlotte', 'Check your email, Maya.'], ['Alfie', 'i have them! somewhere. probably.']];

  function renderChat() {
    const list = $('#chat-list');
    if (!list) return;
    list.innerHTML = '';
    chat.forEach((m) => {
      const d = document.createElement('div');
      d.className = `bubble ${m.from}`;
      d.textContent = m.text;
      list.appendChild(d);
    });
    if (state.pending?.choices?.length) {
      const box = document.createElement('div');
      box.className = 'story-choices';
      state.pending.choices.forEach((c, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = c.label;
        b.onclick = () => choose(i);
        box.appendChild(b);
      });
      list.appendChild(box);
    }
    list.scrollTop = list.scrollHeight;
  }
  function pushChat(from, text) { chat.push({ from, text }); chat = chat.slice(-120); save(CHAT, chat); }

  function renderDiscord() {
    const log = $('#discord-chat');
    if (!log) return;
    log.innerHTML = '';
    discord.forEach(([who, text]) => log.appendChild(discordLine(who, text)));
    log.scrollTop = log.scrollHeight;
  }
  function discordLine(who, text) {
    const p = document.createElement('p');
    const b = document.createElement('b');
    b.textContent = `${who}: `;
    p.append(b, text);
    return p;
  }
  function pushDiscord(who, text) {
    discord.push([who, text]); discord = discord.slice(-100); save(DISCORD, discord);
    const log = $('#discord-chat');
    if (log) { log.appendChild(discordLine(who, text)); log.scrollTop = log.scrollHeight; }
  }

  function forumPost(text, prepend = true) {
    const root = $('#forum-posts');
    if (!root) return;
    const article = document.createElement('article');
    article.className = 'forum-post';
    const tag = document.createElement('span'); tag.className = 'anon'; tag.textContent = '🕶️ Anonymous · Starlight · new';
    const p = document.createElement('p'); p.textContent = text;
    const btn = document.createElement('button'); btn.className = 'header-action'; btn.textContent = 'Reply';
    const replies = document.createElement('div');
    btn.onclick = () => {
      const t = prompt('Reply anonymously:');
      if (!t || !t.trim()) return;
      [['Anonymous', t.trim()], ['Alfie (probably)', window.localReply(t)]].forEach(([w, v]) => { const r = document.createElement('div'); r.className = 'reply'; r.textContent = `${w}: ${v}`; replies.appendChild(r); });
    };
    article.append(tag, p, btn, replies);
    prepend ? root.prepend(article) : root.appendChild(article);
  }

  const isOpen = (id) => $(`#view-${id}`)?.classList.contains('active');
  function badge() {
    document.querySelectorAll('[data-app="messages"]').forEach((icon) => {
      let el = icon.querySelector('.story-badge');
      if (!state.unread) { el?.remove(); return; }
      if (!el) { el = document.createElement('span'); el.className = 'story-badge'; icon.appendChild(el); }
      el.textContent = state.unread > 9 ? '9+' : String(state.unread);
    });
  }
  function notify(text) {
    const t = $('#toast');
    if (!t || document.visibilityState !== 'visible') return;
    t.textContent = text.length > 48 ? `${text.slice(0, 46)}…` : text;
    t.classList.add('visible');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => t.classList.remove('visible'), 2600);
  }

  // Alfie "types" each bubble in order; a queue keeps overlapping replies tidy.
  let queue = Promise.resolve();
  function alfieSays(msgs, { notifyUser = false } = {}) {
    queue = queue.then(async () => {
      for (const text of msgs) {
        const list = $('#chat-list');
        const visible = isOpen('messages');
        let dots;
        if (visible && list) {
          dots = document.createElement('div');
          dots.className = 'bubble them story-typing';
          dots.setAttribute('aria-label', 'Alfie is typing');
          dots.innerHTML = '<i></i><i></i><i></i>';
          list.appendChild(dots); list.scrollTop = list.scrollHeight;
        }
        await sleep(visible ? Math.min(2600, 600 + text.length * 22) : 150);
        dots?.remove();
        pushChat('them', text);
        if (!isOpen('messages')) { state.unread += 1; persist(); badge(); }
        renderChat();
      }
      if (notifyUser && !isOpen('messages')) notify(`💬 Alfie: ${msgs[0]}`);
    });
    return queue;
  }

  /* ---------- story delivery ---------- */
  function deliver(beat, label) {
    const text = lines(beat.text);
    if (beat.where === 'dm') {
      state.pending = beat.choices ? { choices: beat.choices.map((c) => ({ label: c.label, flag: c.flag || '', reply: lines(c.reply) })) } : state.pending;
      persist();
      alfieSays(text, { notifyUser: true });
    } else if (beat.where === 'discord') {
      const convo = resolve(beat.text);
      convo.forEach(([who, t], i) => setTimeout(() => pushDiscord(who, fill(t)), i * 1200));
      if (!isOpen('discord')) notify(`🎮 #general · ${convo[0][0]}: ${convo[0][1]}`);
    } else if (beat.where === 'forum') {
      state.forum = [...state.forum, text[0]].slice(-8);
      forumPost(text[0]);
      if (!isOpen('forums')) notify('🕶️ New anonymous post on AfterHours');
    }
    if (label) setTimeout(() => notify(label), 2900);
  }
  function advance() {
    state.lastBeatAt = Date.now();
    const beat = beats[state.beat];
    if (beat) {
      state.beat += 1;
      let label = '';
      if (beat.ch !== state.chapter) { state.chapter = beat.ch; label = `✦ ${CHAPTERS[beat.ch]}`; }
      persist();
      deliver(beat, label);
      return;
    }
    let label = '';
    if (state.chapter !== 5) { state.chapter = 5; label = `✦ ${CHAPTERS[5]}`; }
    const unused = ambient.map((_, i) => i).filter((i) => !state.ambient.includes(i));
    if (!unused.length) state.ambient = [];
    const i = (unused.length ? unused : ambient.map((_, j) => j))[Math.floor(Math.random() * (unused.length || ambient.length))];
    state.ambient = [...state.ambient, i];
    persist();
    deliver(ambient[i], label);
  }
  // Talking about what's happening pulls the next beat forward, so curious readers move the story along.
  function maybePull(text) {
    const next = beats[state.beat];
    const topic = classify(text);
    const wants = topic === 'story' || (next?.key && next.key.test(text));
    if (!wants || Date.now() - state.lastPullAt < 60000 || state.pending) return;
    state.lastPullAt = Date.now();
    persist();
    setTimeout(() => { advance(); restartTimer(); }, 4500);
  }
  function choose(i) {
    const c = state.pending?.choices?.[i];
    if (!c) return;
    state.pending = null;
    if (c.flag) state.flags[c.flag] = true;
    pushChat('me', c.label);
    persist();
    renderChat();
    alfieSays(c.reply);
  }

  /* ---------- input handling (captures forms before older inline handlers) ---------- */
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!['message-form', 'ask-form', 'discord-form'].includes(form?.id)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const input = form.querySelector('input');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    if (form.id === 'message-form') {
      pushChat('me', text);
      renderChat();
      alfieSays(compose(text));
      maybePull(text);
    } else if (form.id === 'ask-form') {
      const area = $('#ask-replies');
      const add = (v) => { const d = document.createElement('div'); d.className = 'reply'; d.textContent = v; area.appendChild(d); };
      add(`You: ${text}`);
      const reply = compose(text).join(' ');
      setTimeout(() => add(`Alfie: ${reply}`), 700);
      maybePull(text);
    } else {
      pushDiscord('You', text);
      const mention = Object.keys(others).find((n) => new RegExp(n.split(' ')[0], 'i').test(text));
      const first = mention || 'Alfie';
      setTimeout(() => pushDiscord(first, first === 'Alfie' ? compose(text).join(' ') : pick(others[first], first)), 900);
      if (!mention && chance(0.4)) {
        const extra = Object.keys(others)[Math.floor(Math.random() * 3)];
        setTimeout(() => pushDiscord(extra, pick(others[extra], extra)), 2600);
      }
      maybePull(text);
    }
  }, true);

  /* ---------- boot ---------- */
  const style = document.createElement('style');
  style.textContent = `.app-icon{position:relative}.story-badge{position:absolute;top:-4px;right:2px;min-width:17px;height:17px;padding:0 5px;border-radius:9px;background:#ff3b30;color:#fff;font-size:10px;font-weight:700;line-height:17px;text-shadow:none;box-shadow:0 1px 4px #0005}
  .story-choices{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;margin:8px 0 4px}.story-choices button{border:1px solid #1688ff;background:#fff;color:#1688ff;border-radius:16px;padding:6px 11px;font-size:11px}.story-choices button:active{background:#1688ff;color:#fff}
  .story-typing{display:inline-flex;gap:4px;padding:11px 13px}.story-typing i{width:6px;height:6px;border-radius:50%;background:#8e93a0;animation:story-dot 1s infinite}.story-typing i:nth-child(2){animation-delay:.15s}.story-typing i:nth-child(3){animation-delay:.3s}@keyframes story-dot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
  #discord-chat p{margin:7px 0;font-size:12px;line-height:1.45}#discord-chat b{color:#9aa6ff}`;
  document.head.appendChild(style);

  renderChat();
  renderDiscord();
  state.forum.forEach((t) => forumPost(t));
  badge();
  document.querySelectorAll('[data-app="messages"]').forEach((icon) => icon.addEventListener('click', () => { state.unread = 0; persist(); badge(); setTimeout(renderChat, 0); }));
  $('#reset-chat')?.addEventListener('click', () => {
    const restart = confirm('Also restart the story from Chapter 1?');
    if (restart) { Object.assign(state, fresh(), { name: state.name }); save(DISCORD, null); discord = []; renderDiscord(); }
    else state.pending = null;
    chat = seedChat(); save(CHAT, chat); persist(); renderChat(); badge();
  });

  let timer;
  function restartTimer() { clearInterval(timer); timer = setInterval(advance, BEAT_MS); }
  restartTimer();
  // First visit: start the story shortly. Returning after a while: one "while you were away" beat.
  if (state.beat === 0 && !state.lastBeatAt) setTimeout(advance, 20000);
  else if (Date.now() - state.lastBeatAt > BEAT_MS) setTimeout(advance, 8000);
})();
