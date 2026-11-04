/* Local character dialogue. Answers known facts directly; asks rather than invents when unsure. */
(() => {
  'use strict';
  const KEY = 'alfie-smart-dialogue-v1';
  const LAST = 'alfie-last-topic-v1';
  const facts = {
    charlotte: {
      name: 'Charlotte',
      lines: ["Charlotte notices when I'm pretending I'm fine. It's kind of annoying how good she is at that. I'm glad she's around.", "She's easy to be with. I don't have to turn every conversation into an interview.", "I was going to ask her to get food after rehearsal and somehow made that complicated in my head."]
    },
    family: {
      lines: ["My parents are Joanne and Dakota. My siblings are Tobias, Alistair, Valerie, twins Keira and Elias, and Liliana.", "There are six of us kids. The family chat is mostly scheduling and food photos. I miss the noise when I'm away.", "I love them. I also mute the group chat when I have homework. Both things can be true."]
    },
    ring: {
      lines: ["I found the ring after the wrap party and thought it was a prop. Then it lit up and those jellyfish-shaped things showed up. Still working on a normal explanation.", "The archivist knows more than I do. I'm trying to ask questions before I touch anything else.", "I don't know what Stellaris wants from me yet. 'Don't test mysterious powers in public' seems like a decent rule."]
    },
    school: {
      lines: ["Starlight is my performing-arts high school. I like that people there care about the work, not just who got recognized in a hallway.", "School and work overlap a lot. The teachers understand the schedule, but assignments are still due. Fair, honestly.", "Rehearsal was fine. I only left my script in the black box once. That's progress."]
    },
    work: {
      lines: ["The crew do a lot that never makes it on screen. I try to learn names and say thanks, even if I'm bad at the first part.", "My co-stars make long days easier. Mostly we trade snacks and complain about call times.", "The costume team are brilliant. I owe them an apology for assuming that ring was one of their props."]
    },
    pets: {
      lines: ["Anne-Marie is my Persian cat, Dex is a chihuahua, Joyce is a teacup Pom, and Mayfield is my horse.", "Anne-Marie sits on my scripts. Dex barks at the delivery person. Joyce is tiny and somehow louder than both of us."]
    },
    food: {
      lines: ["Donuts and poutine are excellent post-rehearsal plans. I'm not claiming either is a balanced dinner.", "I like fruit mochi, apple pie, and soufflé pancakes. I'm allergic to seafood, so I check ingredients.", "I like spicy food, then immediately regret being so confident about the spice level. Every time."]
    },
    music: {
      lines: ["Guitar helps me get out of my head after work. Sometimes I write a song; sometimes I play the same four chords until I'm less tense.", "I keep half-finished lyrics in my journal. A surprising number are about missing home and wanting a snack.", "Piano's good when I need to slow down. Guitar's good when I need to make noise."]
    },
    anxiety: {
      lines: ["That sounds like a lot to carry. Do you want to tell me what part is weighing on you most?", "When I get overwhelmed, I try to make the next minute smaller instead of thinking about the whole week.", "You don't have to pretend you're fine. If you might be in immediate danger, please contact someone you trust nearby or local emergency support."]
    },
    fans: {
      lines: ["I'm grateful people care about the work. I get awkward when someone recognizes me, but I never want them to think I'm annoyed.", "I can't answer every message, but I do read a lot when I get a quiet minute. Some have made a rough day better."]
    },
    unclear: {
      lines: ["I don't want to guess and give you the wrong answer. Can you say a little more about what you mean?", "I might be missing the context—what happened right before that?", "Wait, which part are you asking about? I want to answer the actual question."]
    }
  };
  const patterns = [
    ['allergy', /seafood|allerg(y|ic|ies)/],
    ['anxiety', /anxious|anxiety|panic|nervous|scared|afraid|overwhelmed|unsafe|hurt myself/],
    ['charlotte', /charlotte|girlfriend|crush|relationship|date with her/],
    ['family', /joanne|dakota|tobias|alistair|valerie|keira|elias|liliana|family|siblings?|brothers?|sisters?|mom|mum|dad|parents?/],
    ['pets', /anne.?marie|dex|joyce|mayfield|cat|horse|dogs?|pets?/],
    ['food', /food|eat|donut|doughnut|poutine|mochi|pancake|apple pie|spicy/],
    ['ring', /stellaris|ring|space|alien|jellyfish|archivist|cosmic|glow|powers?/],
    ['fans', /fan|supporter|audience|recognize me|meet you/],
    ['work', /co.?stars?|cast|crew|staff|costume|director|producer|hollywood|acting|audition|set|film|show/],
    ['school', /school|starlight|homework|class|teacher|rehearsal|theatre|theater|grade|sophomore/],
    ['music', /song|music|guitar|piano|sing|lyrics/]
  ];
  const questionMatchers = [
    [/\b(who|what are the names|name)\b.*\b(family|siblings|brothers|sisters|parents)\b|\b(who are|who's)\b.*\b(mom|mum|dad|parents)\b/i, 'familyNames'],
    [/\b(how many|number of)\b.*\b(siblings|kids|children|brothers|sisters)\b/i, 'siblingsCount'],
    [/\b(which|what kind of|what breed)\b.*\b(pets?|cat|dog|horse)\b|\b(pets?|animals)\b.*\b(names|called)\b/i, 'petNames'],
    [/\b(what|which)\b.*\b(allerg(y|ic)|can't eat)\b|\bseafood\b.*\b(allerg|eat)\b/i, 'allergy'],
    [/\b(where|what school)\b.*\b(school|starlight)\b/i, 'school'],
    [/\b(what|which)\b.*\b(instrument|instruments)\b|\b(play|plays)\b.*\b(guitar|piano)\b/i, 'music'],
    [/\b(what|which)\b.*\b(food|foods|dessert|snack)\b|\b(favorite|favourite)\b.*\b(food|dessert)\b/i, 'food'],
    [/\b(what happened|how did you find|where did you find)\b.*\bring\b|\bhow\b.*\bring\b.*\b(find|start|begin)\b/i, 'ringOrigin'],
    [/\bwho\b.*\b(charlotte|girlfriend)\b|\bhow did you meet\b.*\b(charlotte|her)\b/i, 'charlotte']
  ];
  function classify(text) {
    const value = String(text || '').toLowerCase();
    return patterns.find(([, re]) => re.test(value))?.[0] || 'unclear';
  }
  function directAnswer(question, topic) {
    const q = String(question || '');
    const intent = questionMatchers.find(([re]) => re.test(q))?.[1];
    const direct = {
      familyNames: "My parents are Joanne and Dakota. My siblings are Tobias, Alistair, Valerie, Keira, Elias, and Liliana.",
      siblingsCount: "There are six of us kids: Tobias, Alistair, Valerie, me, and the twins Keira and Elias, plus Liliana—wait, that's seven including me. I always mess up counting when I say it fast.",
      petNames: "Anne-Marie is the Persian cat, Dex is the chihuahua, Joyce is the teacup Pom, and Mayfield is my horse.",
      allergy: "Seafood. I'm allergic, so I check ingredients instead of guessing.",
      school: "I go to Starlight Performing Arts High School in New York.",
      music: "Guitar and piano. I also sing and write songs, badly at first and then slightly less badly.",
      food: "Fruit mochi, apple pie, soufflé pancakes, and poutine. Not seafood—I'm allergic.",
      ringOrigin: "I found it after the wrap party and assumed it was a costume prop. Then it started glowing, and everything got a lot less explainable.",
      charlotte: "Charlotte's my girlfriend. We know each other through school and theatre; she has a talent for noticing when I'm not okay."
    };
    if (intent) return direct[intent];
    if (/^(hi|hello|hey|good morning|good evening)\b/i.test(q.trim())) return "Hey! What's up?";
    if (/\b(thank you|thanks)\b/i.test(q)) return "You're welcome. Thanks for telling me. What else is on your mind?";
    if (/\b(i (like|love|enjoy)|my favorite|my favourite)\b/i.test(q)) return `Oh, nice. What do you like most about it? I'm into ${topic === 'music' ? 'guitar and piano' : topic === 'food' ? 'mochi and poutine' : 'theatre and music'}, so I get having a thing you really enjoy.`;
    if (/\b(what do you think|should i|any advice|what should i do)\b/i.test(q) && topic === 'anxiety') return "I can't know the perfect answer from one message. Could you tell someone you trust what’s going on, and what feels like the hardest part right now?";
    return null;
  }
  function choose(topic, speaker, message) {
    if (speaker === 'Charlotte') return /school|rehearsal|class/i.test(message)
      ? "He left his script in the black box again. I brought it back. Don't tell him I said 'again.'"
      : "I'm glad you asked. Alfie's thoughtful, even when he tries to hide it behind a joke. What did you want to know?";
    if (speaker === 'Maya · co-star') return "We mostly keep each other sane on long set days. Today that involved snacks and a very lost script.";
    const lines = topic === 'allergy'
      ? ["Seafood. I'm allergic, so I check ingredients instead of guessing."]
      : (facts[topic] || facts.unclear).lines;
    let history = [];
    try { history = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (_) {}
    const recent = history.filter((x) => x.startsWith(`${topic}:`)).slice(-2);
    const choices = lines.filter((line) => !recent.includes(`${topic}:${line}`));
    const answer = (choices.length ? choices : lines)[Math.floor(Math.random() * (choices.length || lines.length))];
    try { localStorage.setItem(KEY, JSON.stringify([...history, `${topic}:${answer}`].slice(-60))); } catch (_) {}
    return answer;
  }
  let lastTopic = '';
  try { lastTopic = localStorage.getItem(LAST) || ''; } catch (_) {}
  window.localReply = (message, speaker = 'Alfie') => {
    const text = String(message || '').trim();
    const topic = classify(text);
    const answer = directAnswer(text, topic) || choose(topic, speaker, text);
    if (topic !== 'unclear') lastTopic = topic;
    try { localStorage.setItem(LAST, lastTopic); } catch (_) {}
    return answer;
  };

  // Capture forms before the older inline handlers, preserving a small chat context.
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!['message-form', 'ask-form', 'discord-form'].includes(form?.id)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const input = form.querySelector('input');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';
    const message = { text, topic: classify(text), at: Date.now() };
    const state = (() => { try { return JSON.parse(sessionStorage.getItem('alfie-conversation') || '[]'); } catch (_) { return []; } })();
    state.push(message); sessionStorage.setItem('alfie-conversation', JSON.stringify(state.slice(-12)));
    const answer = window.localReply(text, form.id === 'discord-form' && /charlotte/i.test(text) ? 'Charlotte' : 'Alfie');
    if (form.id === 'message-form') {
      const list = document.querySelector('#chat-list');
      for (const [from, value] of [['me', text], ['them', answer]]) {
        const bubble = document.createElement('div'); bubble.className = `bubble ${from}`; bubble.textContent = value; list.appendChild(bubble);
      }
      list.scrollTop = list.scrollHeight;
    } else {
      const area = form.id === 'ask-form' ? document.querySelector('#ask-replies') : document.querySelector('#discord-chat');
      const add = (label, value) => { const p = document.createElement(form.id === 'ask-form' ? 'div' : 'p'); p.className = form.id === 'ask-form' ? 'reply' : ''; p.textContent = `${label}: ${value}`; area.appendChild(p); };
      add('You', text); add(form.id === 'ask-form' ? 'Alfie' : 'Alfie', answer);
    }
  }, true);

  const beats = [
    ['Charlotte', 'You left your water bottle in the rehearsal room. I put it by the stage door. Again.'],
    ['Maya · co-star', 'They moved the prop table. Your script is safe. The ring-shaped thing is not on it, just so you know.'],
    ['Riley · manager', 'Call time is still 10 tomorrow. I cleared the morning so you can get to Starlight first.'],
    ['Joanne · Mom', 'Your siblings are arguing over dinner in the family chat. Call when you finish homework?'],
    ['Alfie', 'Quick question: is a “prop” supposed to get warm when nobody has touched it? Asking for a friend. The friend is me.'],
    ['Costume team', 'Small mystery: nobody in wardrobe recognizes the ring you described. We did not make it.'],
    ['Charlotte', 'You went quiet after rehearsal. No pressure to explain over text, but I’m around if you want to talk.'],
    ['Unknown number', 'You should stop asking about the lights in the park.'],
    ['Fan account', 'Alfie stayed late to thank the whole crew after wrap. Hope he gets a day off soon.'],
    ['Alistair · family chat', 'Liliana says the cat stole your chair. Anne-Marie denies all allegations.'],
    ['Maya · co-star', 'They added a scene tomorrow. I sent you the revised pages—please tell me you saw the email.'],
    ['Alfie · journal draft', 'Wrote half a song on the train. The other half is apparently just a list of things I need to buy.']
  ];
  let beat = 0;
  try { beat = Number(localStorage.getItem('alfie-story-beat-v3') || 0) % beats.length; } catch (_) {}
  setInterval(() => {
    const [speaker, text] = beats[beat]; beat = (beat + 1) % beats.length;
    try { localStorage.setItem('alfie-story-beat-v3', beat); } catch (_) {}
    const log = document.querySelector('#discord-chat');
    if (log) { const p = document.createElement('p'); p.textContent = `${speaker}: ${text}`; log.appendChild(p); }
    const toast = document.querySelector('#toast');
    if (toast && document.visibilityState === 'visible') { toast.textContent = `New story update · ${speaker}`; toast.classList.add('visible'); setTimeout(() => toast.classList.remove('visible'), 2200); }
  }, 300000);
})();
