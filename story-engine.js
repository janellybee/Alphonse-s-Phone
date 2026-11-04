/* Offline fallback dialogue, used only when the live Alfie API can't be reached. */
(() => {
  'use strict';
  const KEY = 'alfie-smart-dialogue-v1';
  const LAST = 'alfie-last-topic-v1';
  const facts = {
    charlotte: { lines: ["charlotte always knows when i'm faking being fine. it's annoying. i love her", "she goes to a different school so we mostly see each other weekends. and facetime way too late", "i was gonna ask her to get food after rehearsal and somehow overthought it for an hour"] },
    family: { lines: ["mom and dad are joanne and dakota. siblings are tobias, alistair, valerie, the twins keira and elias, and liliana", "the family chat is like 90% food pics and arguing about dinner", "i miss home a lot ngl. vancouver just feels different"] },
    ring: { lines: ["the ring thing is... a lot. i thought it was a prop. it's not", "idk what it is yet. trying not to touch it more than i have to", "long story. i'll tell you when i actually understand it"] },
    school: { lines: ["starlight's good. people actually care about the work there", "school and set overlap way too much. teachers are chill about it but homework's still due lol", "rehearsal ran late again. i'm so tired"] },
    work: { lines: ["crew does so much and nobody notices. i try to learn everyone's names, i'm just bad at it", "long set day. maya and i survived on crackers", "wardrobe says the ring isn't theirs which is not what i wanted to hear"] },
    pets: { lines: ["anne-marie's my persian cat, dex is a chihuahua, joyce is a teacup pom, and mayfield is my horse", "anne-marie is sitting on my script rn. i guess i'm not studying"] },
    food: { lines: ["donuts and poutine. not a balanced dinner but it's what i want", "mochi, apple pie, souffle pancakes. no seafood, i'm allergic", "i always think i can handle spicy food and i never can"] },
    music: { lines: ["i've been playing the same four chords for an hour. it helps", "i have like 30 half-finished songs in my notes app", "piano when i need to calm down, guitar when i need to be loud"] },
    anxiety: { lines: ["that sounds really heavy. what's the worst part of it right now?", "i get like that too. making the next five minutes smaller helps me a bit", "you don't have to pretend you're fine. if you're not safe right now please reach out to someone near you, or call/text 988"] },
    fans: { lines: ["it's still so weird when people recognize me. good weird. mostly", "i can't reply to everything but i do read stuff when i get a minute"] },
    unclear: { lines: ["wait what do you mean", "sorry i'm half paying attention, rehearsal. say that again?", "lol ok", "huh. tell me more"] }
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
      siblingsCount: "six siblings. seven of us kids total. it's loud",
      petNames: "Anne-Marie is the Persian cat, Dex is the chihuahua, Joyce is the teacup Pom, and Mayfield is my horse.",
      allergy: "Seafood. I'm allergic, so I check ingredients instead of guessing.",
      school: "I go to Starlight Performing Arts High School in New York.",
      music: "Guitar and piano. I also sing and write songs, badly at first and then slightly less badly.",
      food: "Fruit mochi, apple pie, soufflé pancakes, and poutine. Not seafood—I'm allergic.",
      ringOrigin: "I found it after the wrap party and assumed it was a costume prop. Then it started glowing, and everything got a lot less explainable.",
      charlotte: "Charlotte's my girlfriend. We know each other through school and theatre; she has a talent for noticing when I'm not okay."
    };
    if (intent) return direct[intent];
    if (/^(hi|hello|hey|good morning|good evening)\b/i.test(q.trim())) return "hey whats up";
    if (/\b(thank you|thanks)\b/i.test(q)) return "np";
    if (/\b(i (like|love|enjoy)|my favorite|my favourite)\b/i.test(q)) return "oh nice. what got you into it?";
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

  // Form handling lives in alfie-live.js; this file only provides offline fallback lines.

  // Background chatter across the phone's apps now lives in phone-pulse.js.
})();
