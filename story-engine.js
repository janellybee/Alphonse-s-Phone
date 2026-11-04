(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const STORAGE = {
    chat: 'alfie-chat-v2',
    seen: 'alfie-reply-history-v1',
    beat: 'alfie-story-beat-v1',
    journal: 'alfie-journal'
  };

  const seedChat = [
    { from: 'them', text: 'Hey. I’m Alfie. I have homework open, a script I should be memorizing, and a ring on my desk that I’m pretending is normal. What’s up?' }
  ];

  const replyBank = {
    charlotte: [
      'Charlotte catches me doing the “I’m fine” thing every time. It’s annoying how good she is at that. I’m glad she’s around, though.',
      'She’s funny, and she talks to me like I’m just me. I don’t take that for granted.',
      'I was going to ask Charlotte to get food after rehearsal, but then I spent ten minutes deciding if that sounded weird. It did not. I know that now.'
    ],
    family: [
      'There are six of us kids. The family group chat is mostly scheduling, photos of food, and my dad sending links nobody asked for. I miss it when I’m away.',
      'Mom’s Joanne, Dad’s Dakota. Tobias and Alistair are my older brothers, Valerie’s my older sister, Keira and Elias are the twins, and Liliana’s the youngest. Family dinner is loud. In a good way. Mostly.',
      'I love them. I also sometimes need to mute the group chat to finish homework. Both things are true.'
    ],
    ring: [
      'I found it after the wrap party and thought wardrobe had dropped a prop. Then it lit up, those things showed up, and I stopped having time for normal explanations.',
      'The archivist knows more than I do, which is not hard. I’m still trying to get a straight answer about what the ring can do without accidentally testing it in public.',
      'I don’t know what Stellaris wants from me. I’m trying to learn before I touch anything else. That feels like a reasonable plan.'
    ],
    school: [
      'Starlight’s good. The teachers are understanding about work, but they still expect me to turn things in. Which, honestly, is fair.',
      'My hardest class this week is the one I forgot to put in my calendar. So, technically, the calendar is the problem.',
      'Rehearsal was fine. I only left my script in the black box once, which is an improvement.'
    ],
    work: [
      'The crew make a set feel like a place. I try to learn everyone’s name and say thank you. I’m not always great at the first part, but I keep trying.',
      'My co-stars are good at making long days less long. We mostly trade snacks and complain about call times.',
      'The costume team are brilliant. I found the ring because it looked like something they’d make. I owe them an apology for assuming it was theirs.'
    ],
    fans: [
      'I’m grateful people care about the work. I get awkward when someone recognizes me at a café, but I never want them to think I’m annoyed with them.',
      'I can’t answer every message, but I do read a lot of them when I get a quiet minute. Some have made a rough day better.',
      'It’s strange when people know a lot about you from interviews but you’ve never met. I appreciate the support. I’m still just a kid trying to remember his locker combination.'
    ],
    antagonist: [
      'I don’t want to hurt anyone. If somebody’s putting people in danger, I’ll try to stop them. I’m still figuring out how to do that without making things worse.',
      'Being angry doesn’t mean I get to stop thinking. The ring makes that more important, not less.',
      'I’m not going to threaten someone just because they’re acting like a villain. I’d rather get people out safely and ask questions after.'
    ],
    anxiety: [
      'I get that. When it starts building, I try to focus on what’s actually in front of me instead of the whole week at once. It doesn’t fix everything, but it can help me get through the next minute.',
      'You don’t have to make it sound smaller for my sake. If you feel unsafe or like you might hurt yourself, please tell someone you trust nearby or contact local emergency support. You shouldn’t have to handle that alone.',
      'I usually find a quiet place, put both feet on the floor, and breathe out slowly. It’s not magic. It just gives me a second to catch up with myself.'
    ],
    pets: [
      'Anne-Marie is a Persian cat and absolutely thinks she owns the place. Dex is the chihuahua, Joyce is the teacup Pom, and Mayfield is my horse. I miss all of them when I’m working.',
      'Anne-Marie sits on my scripts. Dex barks at the delivery person. Joyce is tiny and somehow louder than both of us. Mayfield is the calm one.'
    ],
    food: [
      'Donuts are a good post-rehearsal plan. Poutine is also a good plan. I’m not saying either counts as dinner, but I’m not not saying it.',
      'Fruit mochi, apple pie, and Japanese soufflé pancakes. I’m easy to bribe. Not with seafood, though—I’m allergic, so please don’t guess about ingredients.',
      'I like spicy food, then I immediately regret being so confident about the spice level. Every time.'
    ],
    music: [
      'Guitar is how I get out of my head after work. Sometimes I write a song. Sometimes I play the same four chords until my hands stop being tense.',
      'I keep half-finished lyrics in my journal. A few are about important things. A surprising number are about missing home and wanting a snack.',
      'Piano’s good when I need to slow down. Guitar’s good when I need to make noise. Depends on the day.'
    ],
    greeting: [
      'Hey. What’s up? I’m between homework and trying not to stare at a very suspicious ring.',
      'Hi. I’m Alfie. Alphonse if this is a school email. What did you want to ask?',
      'Hey, thanks for messaging. I may be a little slow if I’m at rehearsal, but I’m here now.'
    ],
    clarify: [
      'I’m not sure I understood which part you mean. Can you tell me a little more?',
      'Wait, are you asking about school, the ring, or something else? I don’t want to guess and give you the wrong answer.',
      'I might be missing some context. What happened right before that?'
    ]
  };

  const sceneBeats = [
    { speaker: 'Charlotte', text: 'You left your water bottle in the rehearsal room. I put it by the stage door. Again.', topic: 'school' },
    { speaker: 'Maya · co-star', text: 'They moved the prop table. Your script is safe. The ring-shaped thing is not on it, just so you know.', topic: 'work' },
    { speaker: 'Riley · manager', text: 'Call time is still 10 tomorrow. I cleared the morning so you can get to Starlight first.', topic: 'work' },
    { speaker: 'Joanne · Mom', text: 'Your siblings are arguing over dinner in the family chat. Call when you’re done with homework?', topic: 'family' },
    { speaker: 'Alfie', text: 'Quick poll: is it normal for a “prop” to be warm when nobody’s touched it? Asking for a friend. The friend is me.', topic: 'ring' },
    { speaker: 'Costume team', text: 'Small mystery: nobody in wardrobe recognizes the ring you described. We didn’t make it.', topic: 'ring' },
    { speaker: 'Charlotte', text: 'You went quiet after rehearsal. No pressure to explain over text, but I’m around if you want to talk.', topic: 'anxiety' },
    { speaker: 'Unknown number', text: 'You should stop asking about the lights in the park.', topic: 'antagonist' },
    { speaker: 'Fan account · public post', text: 'Alfie stayed late to thank the whole crew after wrap. Hope he gets a day off soon.', topic: 'fans' },
    { speaker: 'Alistair · family chat', text: 'Liliana says the cat stole your chair. Anne-Marie denies all allegations.', topic: 'pets' }
  ];

  function classify(text) {
    const value = String(text || '').toLowerCase();
    const tests = [
      ['anxiety', /anxious|anxiety|panic|nervous|scared|afraid|overwhelmed|unsafe|hurt myself/],
      ['charlotte', /charlotte|girlfriend|crush|date|relationship|love/],
      ['family', /joanne|dakota|tobias|alistair|valerie|keira|elias|liliana|family|siblings?|brothers?|sisters?|mom|mum|dad|parents?/],
      ['ring', /stellaris|ring|space|alien|jellyfish|archivist|cosmic|glow|powers?/],
      ['pets', /anne.?marie|dex|joyce|mayfield|cat|horse|dogs?|pets?/],
      ['food', /food|eat|donut|doughnut|poutine|mochi|pancake|apple pie|spicy|seafood|allerg/],
      ['music', /song|music|guitar|piano|sing|script|write/],
      ['work', /co.?stars?|cast|crew|staff|costume|director|producer|fans?|audience|hollywood|acting|audition|set|film|show/],
      ['school', /school|starlight|homework|class|teacher|rehearsal|theatre|theater|grade|sophomore/],
      ['greeting', /^(hi|hello|hey|good morning|good evening)\b/]
    ];
    return tests.find(([, pattern]) => pattern.test(value))?.[0] || 'clarify';
  }

  function nextReply(text, speaker = 'Alfie') {
    const topic = classify(text);
    const options = replyBank[topic] || replyBank.clarify;
    let used = [];
    try { used = JSON.parse(localStorage.getItem(STORAGE.seen) || '[]'); } catch (_) {}
    const available = options.filter((line) => !used.includes(`${speaker}:${line}`));
    const reply = (available.length ? available : options)[Math.floor(Math.random() * (available.length || options.length))];
    used.push(`${speaker}:${reply}`);
    localStorage.setItem(STORAGE.seen, JSON.stringify(used.slice(-20)));
    return reply;
  }

  function addBubble(list, text, from = 'them') {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${from}`;
    bubble.textContent = text;
    list.appendChild(bubble);
    list.scrollTop = list.scrollHeight;
    return bubble;
  }

  function loadChat() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE.chat) || 'null');
      return Array.isArray(stored) ? stored : [...seedChat];
    } catch (_) { return [...seedChat]; }
  }

  let chat = loadChat();
  const chatList = $('#chat-list');
  if (chatList) {
    chatList.replaceChildren();
    chat.forEach((message) => addBubble(chatList, message.text, message.from));
  }

  function persistChat() { localStorage.setItem(STORAGE.chat, JSON.stringify(chat.slice(-80))); }

  async function answerMessage(text, speaker = 'Alfie') {
    // Deliberately local: messages are classified by topic and answered with varied authored dialogue.
    return nextReply(text, speaker);
  }

  $('#message-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#message-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    chat.push({ from: 'me', text });
    addBubble(chatList, text, 'me');
    const reply = await answerMessage(text);
    chat.push({ from: 'them', text: reply });
    addBubble(chatList, reply);
    persistChat();
  });

  $('#reset-chat')?.addEventListener('click', () => {
    chat = [...seedChat];
    persistChat();
    chatList.replaceChildren();
    chat.forEach((message) => addBubble(chatList, message.text, message.from));
  });

  $('#ask-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#ask-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const area = $('#ask-replies');
    const question = document.createElement('div');
    question.className = 'reply';
    question.textContent = `You: ${text}`;
    area.appendChild(question);
    const reply = document.createElement('div');
    reply.className = 'reply';
    reply.textContent = `Alfie: ${await answerMessage(text)}`;
    area.appendChild(reply);
  });

  $('#discord-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#discord-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const log = $('#discord-chat');
    const user = document.createElement('p');
    user.textContent = `You: ${text}`;
    log.appendChild(user);
    const topic = classify(text);
    const character = topic === 'charlotte' ? 'Charlotte' : topic === 'school' ? 'Maya · co-star' : topic === 'family' ? 'Alistair' : 'Alfie';
    const answer = document.createElement('p');
    answer.textContent = `${character}: ${await answerMessage(text, character)}`;
    log.appendChild(answer);
  });

  function attachReaderReply(button, kind) {
    button.addEventListener('click', async () => {
      const text = prompt(kind === 'forum' ? 'Write a reply (fictional, anonymous):' : 'Write a comment for Alfie:');
      if (!text?.trim()) return;
      const article = button.closest(kind === 'forum' ? '.forum-post' : '.post');
      const area = article?.querySelector(kind === 'forum' ? '.forum-replies' : '.school-replies');
      if (!area) return;
      const reader = document.createElement('div');
      reader.className = 'reply';
      reader.textContent = `${kind === 'forum' ? 'Anonymous' : 'You'}: ${text}`;
      area.appendChild(reader);
      const author = document.createElement('div');
      author.className = 'reply';
      author.textContent = `Alfie: ${await answerMessage(text)}`;
      area.appendChild(author);
    });
  }

  document.querySelectorAll('.school-reply').forEach((button) => attachReaderReply(button, 'school'));
  document.querySelectorAll('.forum-reply').forEach((button) => attachReaderReply(button, 'forum'));

  $('#school-post')?.addEventListener('click', () => {
    const title = prompt('Write a Starlight blog post title:');
    if (!title?.trim()) return;
    const article = document.createElement('article');
    article.className = 'post';
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'THEATRE · SOPHOMORE YEAR';
    const heading = document.createElement('h3'); heading.textContent = title;
    const body = document.createElement('p'); body.textContent = 'A new post from Alfie. Add a comment and he’ll reply.';
    const button = document.createElement('button'); button.className = 'header-action school-reply'; button.textContent = 'Reply to Alfie';
    const replies = document.createElement('div'); replies.className = 'school-replies';
    article.append(tag, heading, body, button, replies);
    $('#school-posts')?.prepend(article);
    attachReaderReply(button, 'school');
  });

  $('#forum-new')?.addEventListener('click', () => {
    const text = prompt('Post anonymously to the fictional forum:');
    if (!text?.trim()) return;
    const article = document.createElement('article'); article.className = 'forum-post';
    const label = document.createElement('span'); label.className = 'anon'; label.textContent = '🕶️ Anonymous · Starlight';
    const body = document.createElement('p'); body.textContent = text;
    const button = document.createElement('button'); button.className = 'header-action forum-reply'; button.textContent = 'Reply';
    const replies = document.createElement('div'); replies.className = 'forum-replies';
    article.append(label, body, button, replies);
    $('#forum-posts')?.prepend(article);
    attachReaderReply(button, 'forum');
  });

  const discordLog = $('#discord-chat');
  if (discordLog && !discordLog.children.length) {
    [
      ['Charlotte', 'Did you leave your script in the black box again?'],
      ['Alfie', 'No. It is on the prop table. I think.'],
      ['Maya · co-star', 'Found it. Under the snack box.'],
      ['Alfie', 'Okay, that sounds like something I would do. Thanks.']
    ].forEach(([name, text]) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong'); strong.textContent = name;
      p.append(strong, document.createElement('br'), document.createTextNode(text));
      discordLog.appendChild(p);
    });
  }

  // Story beats add new in-world activity every five minutes; they never replace reader messages.
  let beatIndex = Number(localStorage.getItem(STORAGE.beat) || 0) % sceneBeats.length;
  function addStoryBeat() {
    const beat = sceneBeats[beatIndex];
    beatIndex = (beatIndex + 1) % sceneBeats.length;
    localStorage.setItem(STORAGE.beat, String(beatIndex));
    if (discordLog) {
      const item = document.createElement('p');
      const speaker = document.createElement('strong'); speaker.textContent = beat.speaker;
      item.append(speaker, document.createElement('br'), document.createTextNode(beat.text));
      discordLog.appendChild(item);
      discordLog.scrollTop = discordLog.scrollHeight;
    }
    const activity = document.createElement('div');
    activity.className = 'reply';
    activity.textContent = `${beat.speaker}: ${beat.text}`;
    const school = $('#school-posts');
    if (school && beatIndex % 3 === 0) {
      const article = document.createElement('article');
      article.className = 'post';
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'NEW · STORY UPDATE';
      const title = document.createElement('h3'); title.textContent = `A quick update from ${beat.speaker}`;
      const body = document.createElement('p'); body.textContent = beat.text;
      article.append(tag, title, body);
      school.prepend(article);
    }
    const toast = $('#toast');
    if (toast && document.visibilityState === 'visible') {
      toast.textContent = `New story update · ${beat.speaker}`;
      toast.classList.add('visible');
      clearTimeout(window.alfieToastTimer);
      window.alfieToastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
    }
  }
  setInterval(addStoryBeat, 5 * 60 * 1000);

  // Legacy inline functions call this name; override them with the intent-aware local responder.
  window.localReply = (text) => nextReply(text);
})();
