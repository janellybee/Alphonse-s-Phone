export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ ok: true, service: 'alfie-story-worker' }), {
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (url.pathname === '/api/story') {
      const topic = url.searchParams.get('topic') || 'alfie-story';
      const payload = await generateStoryPayload(env, topic);
      return new Response(JSON.stringify(payload), {
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (url.pathname === '/api/message') {
      const body = await request.json().catch(() => ({}));
      const prompt = String(body.prompt || '');
      const speaker = String(body.speaker || 'Alfie');
      const responseText = await generateCharacterReply(env, speaker, prompt);
      return new Response(JSON.stringify({ reply: responseText }), {
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};

async function generateStoryPayload(env, topic) {
  const fallback = {
    updatedAt: new Date().toISOString(),
    chat: [
      { from: 'them', text: 'Hey. I was trying to look cool and accidentally spilled my coffee on a script. So, much drama.' },
      { from: 'me', text: 'That sounds like a normal Tuesday.' },
      { from: 'them', text: 'It is. That is the worst part.' }
    ],
    schoolPosts: [
      { title: 'Tech week and suspiciously shiny props', body: 'I think I found a ring that is definitely not a prop anymore.', author: 'Alfie Summers' },
      { title: 'A five-minute guitar break', body: 'Not a science breakthrough. Still helpful.', author: 'Alfie Summers' }
    ],
    forumPosts: [
      { author: 'Anonymous', text: 'Anyone else feel weirdly calm when the ring glows?' },
      { author: 'Anonymous', text: 'Was anyone else questioning the prop table this week?' }
    ]
  };

  if (!env.OPENAI_API_KEY) return fallback;

  const prompt = `Write a short immersive story update for a fictional character named Alphonse "Alfie" Summers. Keep it in-character, grounded, and realistic for a 16-year-old teenager. He is Canadian-American, lives in New York, goes to Starlight Performing Arts High School, and is balancing fame with school and a mysterious world-changing ring. Include a small message thread, a school blog post idea, and an anonymous forum post. Return valid JSON with keys: chat, schoolPosts, forumPosts, updatedAt. Keep it natural and emotionally believable.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a story-writing assistant. Keep the tone grounded, teen, and immersive. Return valid JSON only.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 450
    })
  });

  if (!response.ok) return fallback;

  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content || '';
  try {
    const data = JSON.parse(text);
    return { ...data, updatedAt: new Date().toISOString() };
  } catch (error) {
    return fallback;
  }
}

async function generateCharacterReply(env, speaker, prompt) {
  const fallback = speaker === 'Alfie'
    ? 'I’m trying to be brave and normal at the same time, which is honestly exhausting. What’s going on?'
    : 'That sounds important. I’ll keep an eye on it.';

  if (!env.OPENAI_API_KEY || !prompt || !prompt.trim()) return fallback;

  const systemPrompt = `You are ${speaker}. You are a 16-year-old teenager in a realistic alternate universe story. You speak naturally and casually, with a mix of shy humor, sincerity, anxiety, and grounded observations. You are Alphonse "Alfie" Summers when the speaker is Alfie. Give short, natural replies that feel like a teen in a real conversation.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.9,
      max_tokens: 180,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) return fallback;

  const json = await response.json();
  return json?.choices?.[0]?.message?.content?.trim() || fallback;
}
