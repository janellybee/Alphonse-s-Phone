import type { Config } from '@netlify/functions'
import { desc, eq, and, gt, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { amaQuestions } from '../../db/schema.js'
import { alfieSay, clip } from '../../lib/alfie.js'

const MAX_QUESTION = 400
const MAX_NAME = 30

type Row = typeof amaQuestions.$inferSelect

const publicView = (r: Row) => ({
  id: r.id,
  question: r.question,
  asker: r.asker,
  answer: r.answer,
  answeredAt: r.answeredAt
})

export default async (req: Request) => {
  if (req.method === 'GET') {
    const rows = await db
      .select()
      .from(amaQuestions)
      .where(eq(amaQuestions.answered, true))
      .orderBy(desc(amaQuestions.answeredAt))
      .limit(40)
    return Response.json(
      { questions: rows.map(publicView) },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }

  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const question = clip(body.question, MAX_QUESTION)
  const asker = clip(body.asker, MAX_NAME).replace(/[<>]/g, '') || 'anon'
  if (question.length < 3) return Response.json({ error: 'Ask a real question!' }, { status: 400 })

  // Light duplicate guard: the same question in the last 10 minutes isn't answered twice.
  const [dupe] = await db
    .select()
    .from(amaQuestions)
    .where(
      and(
        sql`lower(${amaQuestions.question}) = lower(${question})`,
        gt(amaQuestions.createdAt, sql`now() - interval '10 minutes'`)
      )
    )
    .limit(1)
  if (dupe) {
    return Response.json({ question: dupe.answered ? publicView(dupe) : null, skipped: !dupe.answered })
  }

  const [row] = await db.insert(amaQuestions).values({ question, asker }).returning()

  let answer = ''
  try {
    answer = await alfieSay('ama', [{ role: 'user', content: `Question from "${asker}": ${question}` }], '', 260)
  } catch (error) {
    console.error('AMA answer failed', error)
    return Response.json({ error: 'Alfie is offline right now. Try again in a bit.' }, { status: 502 })
  }

  // Alfie quietly skips spam and creepy questions; they stay hidden.
  if (!answer || /^skip\b/i.test(answer)) {
    return Response.json({ question: null, skipped: true })
  }

  const [updated] = await db
    .update(amaQuestions)
    .set({ answer, answered: true, answeredAt: new Date() })
    .where(eq(amaQuestions.id, row.id))
    .returning()

  return Response.json({ question: publicView(updated) }, { status: 201 })
}

export const config: Config = {
  path: '/api/ama'
}
