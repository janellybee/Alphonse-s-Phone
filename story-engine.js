/* Local story dialogue and periodic story beats. No network calls or live AI. */
(() => {
  'use strict';
  const historyKey = 'alfie-dialogue-history-v2';
  const beatKey = 'alfie-story-beat-v2';
  const responses = {
    charlotte: [
      "Charlotte catches me doing the 'I'm fine' thing every time. Annoying. Helpful, but annoying.",
      "She's easy to be around. I don't have to turn every conversation into an interview, which is nice.",
      "I was going to ask her to get food after rehearsal and somehow made that complicated in my head. It was not complicated."
    ],
    family: [
      "There are six of us kids, so the family chat is mostly scheduling and food photos. I miss the noise when I'm away.",
      "Mom's Joanne, Dad's Dakota. Tobias, Alistair, Valerie, the twins Keira and Elias, and Liliana. Family dinner gets loud fast.",
      "I love them. I also mute the group chat when I have homework. Both things can be true."
    ],
    ring: [
      "I found it after the wrap party and thought wardrobe had dropped a prop. Then it lit up and those things showed up. So, yeah, still working on a normal explanation.",
      "The archivist knows more than I do, which is not hard. I'm trying to ask questions before I touch anything else.",
      "I don't know what Stellaris wants from me yet. 'Don't test mysterious powers in public' seems like a decent first rule."
    ],
    school: [
      "Starlight's good. The teachers are understanding about work, but they still expect me to turn things in. Which is fair.",
      "Rehearsal was fine. I only left my script in the black box once. That's progress.",
      "My calendar and I are not getting along this week. School, set, homework. Repeat."
    ],
    work: [
      "The crew do a lot that never makes it on screen. I try to learn names and say thanks, even if I'm bad at the first part.",
      "My co-stars make long days easier. Mostly we trade snacks and complain about call times.",
      "The costume team are brilliant. I owe them an apology for assuming that ring was one of their props."
    ],
    fans: [
      "I'm grateful people care about the work. I get awkward when someone recognizes me, but I never want them to think I'm annoyed.",
      "I can't answer every message, but I do read a lot of them when I get a quiet minute. Some have made a rough day better.",
      "It's strange being recognized in public. I appreciate the support. I'm also still trying to remember my locker combination."
    ],
    antagonist: [
      "I don't want to hurt anyone. If somebody's putting people in danger, I'll try to stop them without making it worse.",
      "Being angry doesn't mean I get to stop thinking. Especially with the ring involved.",
      "I'd rather get people out safely and ask questions after. Threatening someone isn't going to help."
    ],
    anxiety: [
      "Yeah, I get that. I try to make the next minute smaller instead of thinking about the whole week at once.",
      "You don't have to pretend you're fine with me. If you're in danger or might hurt yourself, please reach out to someone you trust nearby or local emergency support.",
      "I find somewhere quiet, put both feet on the floor, and breathe out slowly. It doesn't fix everything, but it gives me a second."
    ],
    pets: [
      "Anne-Marie is a Persian cat and thinks she owns the place. Dex is the chihuahua, Joyce is the teacup Pom, and Mayfield is my horse. I miss them when I'm working.",
      "Anne-Marie sits on my scripts. Dex barks at the delivery person. Joyce is tiny and somehow louder than both of us. Mayfield's the calm one."
    ],
    food: [
      "Donuts are a good post-rehearsal plan. Poutine too. I'm not claiming either is a balanced dinner.",
      "Fruit mochi, apple pie, soufflé pancakes. I'm easy to bribe. Not with seafood, though—I'm allergic, so I check ingredients.",
      "I like spicy food, then immediately regret being so confident about the spice level. Every time."
    ],
    music: [
      "Guitar helps me get out of my head after work. Sometimes I write a song; sometimes I play the same four chords until I'm less tense.",
      "I keep half-finished lyrics in my journal. A surprising number are about missing home and wanting a snack.",
      "Piano's good when I need to slow down. Guitar's good when I need to make noise. Depends on the day."
    ],
    hello: [
      "Hey. What's up? I'm between homework and trying not to stare at a very suspicious ring.",
      "Hi. I'm Alfie. Alphonse if this is a school email. What did you want to ask?",
      "Hey, thanks for messaging. I may be a little slow if I'm at rehearsal, but I'm here now."
    ],
    clarify: [
      "I'm not sure I understood which part you mean. Can you tell me a little more?",
      "Wait, are you asking about school, the ring, or something else? I don't want to guess and give you the wrong answer.",
      "I might be missing some context. What happened right before that?"
    ]
  };
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
    ['hello', /^(hi|hello|hey|good morning|good evening)\b/]
  ];
  function classify(text) {
    const value = String(text || '').toLowerCase();
    return tests.find(([, pattern]) => pattern.test(value))?.[0] || 'clarify';
  }
  function choose(topic, speaker) {
    const lines = responses[topic] || responses.clarify;
    let used = [];
    try { used = JSON.parse(localStorage.getItem(historyKey) || '[]'); } catch (_) {}
    const available = lines.filter((line) => !used.includes(`${speaker}:${line}`));
    const line = (available.length ? available : lines)[Math.floor(Math.random() * (available.length || lines.length))];
    used.push(`${speaker}:${line}`);
    localStorage.setItem(historyKey, JSON.stringify(used.slice(-30)));
    return line;
  }
  // The existing page calls localReply for message, blog, and forum responses.
  window.localReply = (text) => choose(classify(text), 'Alfie');

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
    ['Alistair · family chat', 'Liliana says the cat stole your chair. Anne-Marie denies all allegations.']
  ];
  let index = 0;
  try { index = Number(localStorage.getItem(beatKey) || 0) % beats.length; } catch (_) {}
  function addBeat() {
    const [speaker, text] = beats[index];
    index = (index + 1) % beats.length;
    try { localStorage.setItem(beatKey, String(index)); } catch (_) {}
    const log = document.querySelector('#discord-chat');
    if (log) {
      const p = document.createElement('p');
      const name = document.createElement('strong');
      name.textContent = speaker;
      p.append(name, document.createElement('br'), document.createTextNode(text));
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
    }
    if (index % 3 === 0) {
      const posts = document.querySelector('#school-posts');
      if (posts) {
        const article = document.createElement('article');
        article.className = 'post';
        const label = document.createElement('span'); label.className = 'tag'; label.textContent = 'NEW · STORY UPDATE';
        const title = document.createElement('h3'); title.textContent = `A quick update from ${speaker}`;
        const body = document.createElement('p'); body.textContent = text;
        article.append(label, title, body);
        posts.prepend(article);
      }
    }
    const toast = document.querySelector('#toast');
    if (toast && document.visibilityState === 'visible') {
      toast.textContent = `New story update · ${speaker}`;
      toast.classList.add('visible');
      clearTimeout(window.alfieStoryToast);
      window.alfieStoryToast = setTimeout(() => toast.classList.remove('visible'), 2200);
    }
  }
  // New beats are appended; they never overwrite or reset reader conversations.
  window.setInterval(addBeat, 5 * 60 * 1000);
})();
