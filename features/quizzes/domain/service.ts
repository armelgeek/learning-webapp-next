import { db } from '@/drizzle/db';
import { quizzes, lessons } from '@/drizzle/schema';
import { and, eq, sql } from 'drizzle-orm';
import { CreateQuizPayload, UpdateQuizPayload, QuizFilter } from '../config/quiz.types';

export class QuizService {
  static async getQuizzesByLesson(lessonId: string) {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId))
      .orderBy(quizzes.createdAt);
  }

  static async getQuizzes(filter?: QuizFilter) {
    const conditions = [];
    
    if (filter?.lessonId) {
      conditions.push(eq(quizzes.lessonId, filter.lessonId));
    }
    if (filter?.type) {
      conditions.push(eq(quizzes.type, filter.type));
    }

    return await db
      .select()
      .from(quizzes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(quizzes.createdAt);
  }

  static async getQuizById(id: string) {
    const result = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  static async createQuiz(data: CreateQuizPayload) {
    const result = await db
      .insert(quizzes)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  static async updateQuiz(id: string, data: Partial<UpdateQuizPayload>) {
    const result = await db
      .update(quizzes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(quizzes.id, id))
      .returning();

    return result[0] || null;
  }

  static async deleteQuiz(id: string) {
    const result = await db
      .delete(quizzes)
      .where(eq(quizzes.id, id))
      .returning();

    return result[0] || null;
  }

  static checkAnswer(quiz: { correctAnswer: string }, selectedAnswer: string) {
    return {
      isCorrect: quiz.correctAnswer === selectedAnswer,
      selectedAnswer,
      correctAnswer: quiz.correctAnswer,
    };
  }

  // Admin-specific methods
  static async getQuizzesForAdmin(filter?: QuizFilter) {
    const conditions = [];
    
    if (filter?.lessonId) {
      conditions.push(eq(quizzes.lessonId, filter.lessonId));
    }
    if (filter?.type) {
      conditions.push(eq(quizzes.type, filter.type));
    }

    const result = await db
      .select({
        id: quizzes.id,
        lessonId: quizzes.lessonId,
        question: quizzes.question,
        options: quizzes.options,
        correctAnswer: quizzes.correctAnswer,
        type: quizzes.type,
        explanation: quizzes.explanation,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        // Join with lesson information
        lessonTitle: sql<string | null>`
          (SELECT l.title 
           FROM ${lessons} l 
           WHERE l.id = ${quizzes.lessonId})
        `,
      })
      .from(quizzes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(quizzes.createdAt);

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(quiz => ({
      ...quiz,
      createdAt: quiz.createdAt?.toISOString() || null,
      updatedAt: quiz.updatedAt?.toISOString() || null,
    }));
  }