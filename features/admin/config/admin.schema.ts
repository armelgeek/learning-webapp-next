import { z } from "zod";

// Module management schemas
export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  language: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  estimatedDuration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  isActive: z.boolean().default(true),
  order: z.number().min(0, "Order must be non-negative").default(0),
});

export const updateModuleSchema = createModuleSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// Quiz management schemas
export const createQuizSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID is required"),
  question: z.string().min(1, "Question is required").max(500, "Question too long"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required").max(6, "Too many options"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  type: z.enum(['multiple_choice', 'flashcard', 'fill_blanks', 'translation', 'dictation', 'pronunciation']),
  explanation: z.string().max(500, "Explanation too long").optional(),
});

export const updateQuizSchema = createQuizSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// Achievement management schemas
export const createAchievementSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  type: z.enum(['streak', 'lessons_completed', 'perfect_score', 'daily_goal', 'weekly_goal']),
  iconUrl: z.string().url("Invalid icon URL").optional().or(z.literal("")),
  pointsRequired: z.number().min(0, "Points must be non-negative").default(0),
  criteria: z.record(z.unknown()).optional(),
  isActive: z.boolean().default(true),
});

export const updateAchievementSchema = createAchievementSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// Daily challenge management schemas
export const createDailyChallengeSchema = z.object({
  date: z.date(),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  targetValue: z.number().min(1, "Target value must be positive"),
  pointsReward: z.number().min(1, "Points reward must be positive").default(10),
  language: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']).optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  isActive: z.boolean().default(true),
});

export const updateDailyChallengeSchema = createDailyChallengeSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// Forum category management schemas
export const createForumCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  language: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").default("#3B82F6"),
  isActive: z.boolean().default(true),
  order: z.number().min(0, "Order must be non-negative").default(0),
});

export const updateForumCategorySchema = createForumCategorySchema.extend({
  id: z.string().min(1, "ID is required"),
});

// Type exports
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
export type CreateDailyChallengeInput = z.infer<typeof createDailyChallengeSchema>;
export type UpdateDailyChallengeInput = z.infer<typeof updateDailyChallengeSchema>;
export type CreateForumCategoryInput = z.infer<typeof createForumCategorySchema>;
export type UpdateForumCategoryInput = z.infer<typeof updateForumCategorySchema>;