import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/features/auth/hooks/useSession';
import type { LessonQuery, LessonProgressInput } from '../config/lesson.types';

const API_BASE = '/api/v1/lessons';

export function useLessons(query: LessonQuery = { page: 1, pageSize: 10 }) {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ['lessons', query, session?.user?.id],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE}?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLesson(id: string) {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ['lessons', id, session?.user?.id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lesson');
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarkLessonCompleted() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: LessonProgressInput) => {
      const response = await fetch(`${API_BASE}/${input.lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark lesson as completed');
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate lessons queries to refetch with updated progress
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: any) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: any) => {
      const response = await fetch(`${API_BASE}/${input.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update lesson');
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.id] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}