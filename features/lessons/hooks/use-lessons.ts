import { useQuery } from '@tanstack/react-query';
import { LessonFilter } from '../config/lesson.types';

// Mock API functions - these would call your actual API endpoints
async function fetchLessons(filter?: LessonFilter) {
  const params = new URLSearchParams();
  if (filter?.language) params.append('language', filter.language);
  if (filter?.type) params.append('type', filter.type);
  if (filter?.difficultyLevel) params.append('difficultyLevel', filter.difficultyLevel);
  
  const response = await fetch(`/api/lessons?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }
  return response.json();
}

async function fetchLessonsWithProgress(userId: string, filter?: LessonFilter) {
  const params = new URLSearchParams();
  if (filter?.language) params.append('language', filter.language);
  if (filter?.type) params.append('type', filter.type);
  if (filter?.difficultyLevel) params.append('difficultyLevel', filter.difficultyLevel);
  
  const response = await fetch(`/api/lessons/progress/${userId}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lessons with progress');
  }
  return response.json();
}

async function fetchLessonById(id: string) {
  const response = await fetch(`/api/lessons/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lesson');
  }
  return response.json();
}

export function useLessons(filter?: LessonFilter) {
  return useQuery({
    queryKey: ['lessons', filter],
    queryFn: () => fetchLessons(filter),
  });
}

export function useLessonsWithProgress(userId: string, filter?: LessonFilter) {
  return useQuery({
    queryKey: ['lessons', 'progress', userId, filter],
    queryFn: () => fetchLessonsWithProgress(userId, filter),
    enabled: !!userId,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => fetchLessonById(id),
    enabled: !!id,
  });
}