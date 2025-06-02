import { integer, pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  provider: text('provider').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emails = pgTable('emails', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  subject: text('subject').notNull(),
  from: text('from').notNull(),
  userEmail: text('user_email').notNull(),
  userName: text('user_name').notNull(),
  content: text('content').notNull(),
  summary: text('summary'),
  date: timestamp('date').notNull().defaultNow(),
  isNotImportant: boolean('is_not_important').default(false),
  isStudentAction: boolean('is_student_action').default(false),
  isCounsellorAction: boolean('is_counsellor_action').default(false),  
  status: varchar('status', { length: 50 }).default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});