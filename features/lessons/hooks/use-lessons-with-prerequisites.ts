import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LessonWithProgress, LessonFilter, PrerequisiteCheck } from '../config/lesson.types';

async function fetchLessonsWithProgress(userId: string, filter?: LessonFilter): Promise<LessonWithProgress[]> {
  const params = new URLSearchParams();
  if (filter?.language) params.append('language', filter.language);
  if (filter?.type) params.append('type', filter.type);
  if (filter?.difficultyLevel) params.append('difficultyLevel', filter.difficultyLevel);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  
  const response = await fetch(`/api/lessons/progress/${userId}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lessons with progress');
  }
  return response.json();
}

async function fetchPrerequisiteCheck(lessonId: string, userId: string): Promise<PrerequisiteCheck> {
  const response = await fetch(`/api/lessons/${lessonId}/prerequisites?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to check prerequisites');
  }
  return response.json();
}

async function fetchAvailableLessonsForPrerequisites(excludeLessonId?: string) {
  const params = new URLSearchParams();
  if (excludeLessonId) params.append('exclude', excludeLessonId);
  
  const response = await fetch(`/api/lessons/available-for-prerequisites?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch available lessons for prerequisites');
  }
  return response.json();
}

export function useLessonsWithPrerequisites(userId: string, filter?: LessonFilter) {
  const queryClient = useQueryClient();

  const {
    data: lessons = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['lessons-with-prerequisites', userId, filter],
    queryFn: () => fetchLessonsWithProgress(userId, filter),
    enabled: !!userId,
  });

  const checkPrerequisitesMutation = useMutation({
    mutationFn: async ({ lessonId, userId }: { lessonId: string; userId: string }) => {
      return fetchPrerequisiteCheck(lessonId, userId);
    },
    onError: (error) => {
      toast.error('Failed to check prerequisites: ' + error.message);
    },
  });

  const checkPrerequisites = async (lessonId: string): Promise<PrerequisiteCheck | null> => {
    try {
      return await checkPrerequisitesMutation.mutateAsync({ lessonId, userId });
    } catch (error) {
      console.error('Error checking prerequisites:', error);
      return null;
    }
  };

  return {
    lessons,
    isLoading,
    error,
    refetch,
    checkPrerequisites,
    isCheckingPrerequisites: checkPrerequisitesMutation.isPending,
  };
}

export function useAvailableLessonsForPrerequisites(excludeLessonId?: string) {
  const {
    data: lessons = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['available-lessons-for-prerequisites', excludeLessonId],
    queryFn: () => fetchAvailableLessonsForPrerequisites(excludeLessonId),
  });

  return {
    lessons,
    isLoading,
    error,
  };
}

export function usePrerequisiteValidation() {
  const [validationResults, setValidationResults] = useState<Record<string, PrerequisiteCheck>>({});

  const validatePrerequisites = async (lessonId: string, userId: string) => {
    try {
      const result = await fetchPrerequisiteCheck(lessonId, userId);
      setValidationResults(prev => ({
        ...prev,
        [lessonId]: result,
      }));
      return result;
    } catch (error) {
      console.error('Error validating prerequisites:', error);
      return null;
    }
  };

  const getValidationResult = (lessonId: string): PrerequisiteCheck | undefined => {
    return validationResults[lessonId];
  };

  const clearValidationResults = () => {
    setValidationResults({});
  };

  return {
    validatePrerequisites,
    getValidationResult,
    clearValidationResults,
    validationResults,
  };
}