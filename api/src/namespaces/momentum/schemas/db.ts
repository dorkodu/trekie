import { user } from '@api/namespaces/auth/schemas/db'
import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const momentumSnapshot = pgTable('momentum_snapshot', {
  id: text('id').primaryKey(), // ulid or composite key (userId+day)
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  windowDays: integer('window_days').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  score: integer('score').notNull(), // stored 0-100
  trend: jsonb('trend'),
  bands: jsonb('bands'),
  states: jsonb('states'),
  history: jsonb('history'),
  explanation: jsonb('explanation'),
  impact: jsonb('impact'),
  recommendations: jsonb('recommendations'),
  result: jsonb('result') // full raw momentum result for delta reconstruction
})
