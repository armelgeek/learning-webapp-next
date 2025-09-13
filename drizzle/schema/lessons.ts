import { sql } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';

// Enum for lesson types
export const lessonTypeEnum = pgEnum('lesson_type', ['vocabulary', 'grammar', 'phrases', 'pronunciation', 'listening', 'reading']);
export const difficultyLevelEnum = pgEnum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
export const languageEnum = pgEnum('language', ['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']);
export const quizTypeEnum = pgEnum('quiz_type', ['multiple_choice', 'flashcard', 'fill_blanks', 'translation', 'dictation', 'pronunciation']);
export const notificationTypeEnum = pgEnum('notification_type', ['reminder', 'achievement', 'new_lesson', 'challenge', 'message']);
export const achievementTypeEnum = pgEnum('achievement_type', ['streak', 'lessons_completed', 'perfect_score', 'daily_goal', 'weekly_goal']);
export const moduleStatusEnum = pgEnum('module_status', ['locked', 'unlocked', 'completed']);

// Lessons table
export const lessons = pgTable('lessons', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description'),
  language: languageEnum('language').notNull(),
  type: lessonTypeEnum('type').notNull(),
  content: jsonb('content').notNull(), // Store lesson content as JSON (text, examples, exercises, etc.)
  audioUrl: text('audio_url'), // Optional audio pronunciation
  videoUrl: text('video_url'), // Optional video content
  imageUrl: text('image_url'), // Optional lesson image
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull().default('beginner'),
  estimatedDuration: integer('estimated_duration').notNull().default(5), // in minutes
  pointsReward: integer('points_reward').notNull().default(10),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0), // For ordering lessons
  prerequisites: text('prerequisites'), // JSON array of lesson IDs that must be completed first
  tags: text('tags'), // JSON array of tags for better organization
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
  type: quizTypeEnum('type').notNull().default('multiple_choice'),
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

// User module progress tracking
export const userModuleProgress = pgTable('user_module_progress', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  moduleId: text('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  status: moduleStatusEnum('status').notNull().default('locked'),
  completedAt: timestamp('completed_at'),
  unlockedAt: timestamp('unlocked_at'),
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
  // Learning progress
  streakDays: integer('streak_days').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  totalLessonsCompleted: integer('total_lessons_completed').notNull().default(0),
  totalWordsLearned: integer('total_words_learned').notNull().default(0),
  totalStudyTime: integer('total_study_time').notNull().default(0), // in minutes
  currentLevel: difficultyLevelEnum('current_level').notNull().default('beginner'),
  // Gamification
  totalPoints: integer('total_points').notNull().default(0),
  weeklyPoints: integer('weekly_points').notNull().default(0),
  monthlyPoints: integer('monthly_points').notNull().default(0),
  level: integer('level').notNull().default(1),
  experience: integer('experience').notNull().default(0),
  experienceToNextLevel: integer('experience_to_next_level').notNull().default(100),
  // Activity tracking
  lastPracticeDate: timestamp('last_practice_date'),
  dailyGoal: integer('daily_goal').notNull().default(15), // minutes per day
  weeklyGoal: integer('weekly_goal').notNull().default(105), // minutes per week
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
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Modules/Courses for organizing lessons thematically
export const modules = pgTable('modules', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description'),
  language: languageEnum('language').notNull(),
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0),
  estimatedDuration: integer('estimated_duration'), // in minutes
  prerequisites: jsonb('prerequisites'), // Array of module IDs that must be completed first
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Link lessons to modules
export const moduleLessons = pgTable('module_lessons', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  moduleId: text('module_id')
    .notNull()
    .references(() => modules.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
});

// User achievements and badges
export const achievements = pgTable('achievements', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: achievementTypeEnum('type').notNull(),
  iconUrl: text('icon_url'),
  pointsRequired: integer('points_required').notNull().default(0),
  criteria: jsonb('criteria'), // JSON criteria for earning this achievement
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User earned achievements
export const userAchievements = pgTable('user_achievements', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  achievementId: text('achievement_id')
    .notNull()
    .references(() => achievements.id, { onDelete: 'cascade' }),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

// Daily challenges
export const dailyChallenges = pgTable('daily_challenges', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  date: timestamp('date').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetValue: integer('target_value').notNull(), // e.g., complete 3 lessons
  pointsReward: integer('points_reward').notNull().default(10),
  language: languageEnum('language'),
  difficultyLevel: difficultyLevelEnum('difficulty_level'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User daily challenge progress
export const userDailyChallenges = pgTable('user_daily_challenges', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  challengeId: text('challenge_id')
    .notNull()
    .references(() => dailyChallenges.id, { onDelete: 'cascade' }),
  currentProgress: integer('current_progress').notNull().default(0),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Forum categories
export const forumCategories = pgTable('forum_categories', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  language: languageEnum('language'),
  color: text('color').default('#3B82F6'),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Forum topics
export const forumTopics = pgTable('forum_topics', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: text('category_id')
    .notNull()
    .references(() => forumCategories.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').notNull().default(false),
  isLocked: boolean('is_locked').notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),
  lastReplyAt: timestamp('last_reply_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Forum replies
export const forumReplies = pgTable('forum_replies', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  topicId: text('topic_id')
    .notNull()
    .references(() => forumTopics.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User messages
export const userMessages = pgTable('user_messages', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  senderId: text('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject'),
  content: text('content').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Spaced repetition reviews
export const reviews = pgTable('reviews', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  nextReviewDate: timestamp('next_review_date').notNull(),
  interval: integer('interval').notNull().default(1), // days until next review
  easeFactor: integer('ease_factor').notNull().default(250), // for SM-2 algorithm
  repetitions: integer('repetitions').notNull().default(0),
  lastReviewedAt: timestamp('last_reviewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});