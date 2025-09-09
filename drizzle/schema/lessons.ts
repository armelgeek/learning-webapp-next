import { sql } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';

// Enum for lesson types
export const lessonTypeEnum = pgEnum('lesson_type', ['vocabulary', 'grammar', 'phrases']);
export const difficultyLevelEnum = pgEnum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
export const languageEnum = pgEnum('language', ['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese']);

// Lessons table
export const lessons = pgTable('lessons', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  language: languageEnum('language').notNull(),
  type: lessonTypeEnum('type').notNull(),
  content: jsonb('content').notNull(), // Store lesson content as JSON (text, examples, etc.)
  audioUrl: text('audio_url'), // Optional audio pronunciation
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull().default('beginner'),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0), // For ordering lessons
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Quizzes table - linked to lessons
export const quizzes = pgTable('quizzes', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  options: jsonb('options').notNull(), // Array of answer options
  correctAnswer: text('correct_answer').notNull(),
  type: pgEnum('quiz_type', ['multiple_choice', 'flashcard'])('type').notNull().default('multiple_choice'),
  explanation: text('explanation'), // Optional explanation for the answer
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User progress tracking
export const userProgress = pgTable('user_progress', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  completed: boolean('completed').notNull().default(false),
  score: integer('score').default(0), // Score out of 100
  attempts: integer('attempts').notNull().default(0),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User statistics and gamification
export const userStats = pgTable('user_stats', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  streakDays: integer('streak_days').notNull().default(0),
  totalLessonsCompleted: integer('total_lessons_completed').notNull().default(0),
  totalWordsLearned: integer('total_words_learned').notNull().default(0),
  currentLevel: difficultyLevelEnum('current_level').notNull().default('beginner'),
  lastPracticeDate: timestamp('last_practice_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Notifications system
export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: pgEnum('notification_type', ['reminder', 'achievement', 'new_lesson'])('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});