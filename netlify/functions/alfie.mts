import type { Config } from '@netlify/functions'
import { CHANNELS, alfieSay, clip } from '../../lib/alfie.js'

const MAX_INPUT = 700
const MAX_CONTEXT = 1200
const MAX_HISTORY = 16

type Turn = { role: 'user' | 'assistant'; text: string }

function cleanHistory(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((t) => t && (t.role === 'user' || t.role === 'assistant') && typeof t.text === 'string' && t.text.trim())
    .slice(-MAX_HISTORY)
    .map((t) => ({ role: t.role, text: clip(t.text, MAX_INPUT) }))
}

// Anthropic requires alternating roles starting with "user"; merge consecutive turns.
function toMessages(history: Turn[], finalUser: string) {
  const merged: { role: 'user' | 'assistant'; content: string }[] = []
  for (const turn of [...history, { role: 'user' as const, text: finalUser }]) {
    const last = merged[merged.length - 1]
    if (last && last.role === turn.role) last.content += '\n' + turn.text
    else merged.push({ role: turn.role, content: turn.text })
  }
  while (merged.length && merged[0].role !== 'user') merged.shift()
  return merged
}

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const channel = typeof body.channel === 'string' && CHANNELS[body.channel] ? body.channel : 'dm'
  const text = clip(body.text, MAX_INPUT)
  const context = clip(body.context, MAX_CONTEXT)
  const history = cleanHistory(body.history)

  if (!text && channel !== 'initiate') {
    return Response.json({ error: 'Message is empty' }, { status: 400 })
  }

  const finalUser =
    channel === 'initiate'
      ? '[No new message from them. You decide to text first. Write only your texts.]'
      : channel === 'blog_post'
        ? `Post title: ${text}`
        : text

  try {
    const reply = await alfieSay(channel, toMessages(history, finalUser), context, channel === 'blog_post' ? 400 : 260)
    if (!reply) throw new Error('Empty reply')
    return Response.json({ reply }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Alfie reply failed', error)
    return Response.json({ error: 'Alfie is offline right now' }, { status: 502 })
  }
}

export const config: Config = {
  path: '/api/alfie'
}
