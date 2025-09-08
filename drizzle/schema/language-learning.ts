import { sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './auth';

// Language support enum
export const languageEnum = pgEnum('language', ['english', 'french', 'spanish', 'german', 'italian', 'portuguese']);

// Difficulty levels enum
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced']);

// Lesson types enum
export const lessonTypeEnum = pgEnum('lesson_type', ['vocabulary', 'grammar', 'phrases', 'conversation']);

// Quiz types enum
export const quizTypeEnum = pgEnum('quiz_type', ['multiple_choice', 'flashcard', 'fill_blank', 'listening']);

// Notification types enum
export const notificationTypeEnum = pgEnum('notification_type', ['reminder', 'achievement', 'new_lesson', 'streak']);

// Lessons table
export const lessons = pgTable('lessons', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description'),
  content: jsonb('content').notNull(), // Structured content with text, examples, etc.
  audioUrl: text('audio_url'), // URL for pronunciation audio
  language: languageEnum('language').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  lessonType: lessonTypeEnum('lesson_type').notNull(),
  order: integer('order').notNull().default(0), // For ordering lessons in a sequence
  isActive: boolean('is_active').notNull().default(true),
  estimatedDuration: integer('estimated_duration'), // in minutes
  tags: text('tags').array(), // Array of tags for categorization
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: text('created_by')
    .references(() => users.id),
});

// Quizzes table
export const quizzes = pgTable('quizzes', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  quizType: quizTypeEnum('quiz_type').notNull(),
  questions: jsonb('questions').notNull(), // Array of question objects
  passingScore: integer('passing_score').notNull().default(70), // Percentage needed to pass
  timeLimit: integer('time_limit'), // in minutes, null for no limit
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User progress on lessons
export const userLessonProgress = pgTable('user_lesson_progress', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  timeSpent: integer('time_spent'), // in minutes
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User quiz attempts and scores
export const userQuizAttempts = pgTable('user_quiz_attempts', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  quizId: text('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(), // Percentage score
  answers: jsonb('answers').notNull(), // User's answers
  timeSpent: integer('time_spent'), // in minutes
  isPassed: boolean('is_passed').notNull().default(false),
  attemptNumber: integer('attempt_number').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User streaks and overall progress
export const userStats = pgTable('user_stats', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastStudyDate: timestamp('last_study_date'),
  totalLessonsCompleted: integer('total_lessons_completed').notNull().default(0),
  totalQuizzesTaken: integer('total_quizzes_taken').notNull().default(0),
  averageScore: integer('average_score').notNull().default(0), // Percentage
  level: integer('level').notNull().default(1),
  experiencePoints: integer('experience_points').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User achievements/badges
export const userAchievements = pgTable('user_achievements', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  achievementKey: text('achievement_key').notNull(), // e.g., 'first_lesson', 'streak_7', 'quiz_master'
  title: text('title').notNull(),
  description: text('description').notNull(),
  iconUrl: text('icon_url'),
  unlockedAt: timestamp('unlocked_at').notNull().defaultNow(),
});

// Notifications for users
export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  actionUrl: text('action_url'), // Optional URL to navigate to
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Daily learning goals
export const dailyGoals = pgTable('daily_goals', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(), // Date for this goal (date only, time set to midnight)
  goalType: text('goal_type').notNull(), // 'lessons', 'quizzes', 'minutes'
  targetValue: integer('target_value').notNull(), // Target number
  currentValue: integer('current_value').notNull().default(0), // Current progress
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});