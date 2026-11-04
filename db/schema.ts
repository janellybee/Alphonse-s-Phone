import { pgTable, serial, text, timestamp, boolean, index } from 'drizzle-orm/pg-core'

// Public questions sent to Alfie's blog AMA box, with his (AI-written) answers.
export const amaQuestions = pgTable(
  'ama_questions',
  {
    id: serial().primaryKey(),
    question: text().notNull(),
    asker: text().notNull().default('anon'),
    answer: text(),
    answered: boolean().notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    answeredAt: timestamp('answered_at')
  },
  (t) => [index('ama_questions_created_idx').on(t.createdAt)]
)
