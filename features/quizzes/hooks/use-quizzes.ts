'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Quiz, QuizFilter, CreateQuizPayload, QuizResult } from '../config/quiz.types';

const QUIZ_QUERY_KEYS = {
  all: ['quizzes'] as const,
  lists: () => [...QUIZ_QUERY_KEYS.all, 'list'] as const,
  list: (filter: QuizFilter) => [...QUIZ_QUERY_KEYS.lists(), filter] as const,
  details: () => [...QUIZ_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUIZ_QUERY_KEYS.details(), id] as const,
  byLesson: (lessonId: string) => [...QUIZ_QUERY_KEYS.all, 'lesson', lessonId] as const,
};

// Fetch quizzes with optional filtering
export function useQuizzes(filter?: QuizFilter) {
  return useQuery({
    queryKey: QUIZ_QUERY_KEYS.list(filter || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter?.lessonId) params.append('lessonId', filter.lessonId);
      if (filter?.type) params.append('type', filter.type);

      const response = await axios.get(`/api/v1/quizzes?${params.toString()}`);
      return response.data;
    },
  });
}

// Fetch quizzes for a specific lesson
export function useQuizzesByLesson(lessonId: string) {
  return useQuery({
    queryKey: QUIZ_QUERY_KEYS.byLesson(lessonId),
    queryFn: async () => {
      const response = await axios.get(`/api/v1/quizzes?lessonId=${lessonId}`);
      return response.data;
    },
    enabled: !!lessonId,
  });
}

// Fetch a single quiz by ID
export function useQuiz(id: string) {
  return useQuery({
    queryKey: QUIZ_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await axios.get(`/api/v1/quizzes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new quiz
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuizPayload) => {
      const response = await axios.post('/api/v1/quizzes', data);
      return response.data;
    },
    onSuccess: (newQuiz) => {
      // Invalidate all quiz lists
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.lists() });
      
      // Invalidate lesson-specific queries if lessonId is available
      if (newQuiz.lessonId) {
        queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.byLesson(newQuiz.lessonId) });
      }
    },
  });
}

// Update an existing quiz
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateQuizPayload>) => {
      const response = await axios.put(`/api/v1/quizzes/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedQuiz, { id }) => {
      // Update the specific quiz cache
      queryClient.setQueryData(QUIZ_QUERY_KEYS.detail(id), updatedQuiz);
      
      // Invalidate all quiz lists
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.lists() });
      
      // Invalidate lesson-specific queries if lessonId is available
      if (updatedQuiz.lessonId) {
        queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.byLesson(updatedQuiz.lessonId) });
      }
    },
  });
}

// Delete a quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/v1/quizzes/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUIZ_QUERY_KEYS.detail(deletedId) });
      
      // Invalidate all quiz lists
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.lists() });
    },
  });
}

// Submit quiz answer (for student use)
export function useSubmitQuizAnswer() {
  return useMutation({
    mutationFn: async ({
      quizId,
      selectedAnswer,
      timeSpent,
    }: {
      quizId: string;
      selectedAnswer: string;
      timeSpent?: number;
    }): Promise<QuizResult> => {
      const response = await axios.post(`/api/v1/quizzes/${quizId}/submit`, {
        selectedAnswer,
        timeSpent,
      });
      return response.data;
    },
  });
}

// Hook for quiz session management
export function useQuizSession(lessonId: string) {
  const { data: quizzes, isLoading, error } = useQuizzesByLesson(lessonId);
  const submitAnswer = useSubmitQuizAnswer();

  const handleSubmitAnswer = async (
    quizId: string,
    selectedAnswer: string,
    timeSpent: number
  ): Promise<QuizResult> => {
    const result = await submitAnswer.mutateAsync({
      quizId,
      selectedAnswer,
      timeSpent,
    });
    return result;
  };

  return {
    quizzes: quizzes || [],
    isLoading,
    error,
    submitAnswer: handleSubmitAnswer,
    isSubmitting: submitAnswer.isPending,
  };
}