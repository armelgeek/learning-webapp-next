import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch admin lessons
export function useAdminLessons(filters?: {
  language?: string;
  type?: string;
  difficultyLevel?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['admin-lessons', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.language) params.append('language', filters.language);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axios.get(`/api/v1/admin/lessons?${params.toString()}`);
      return response.data;
    },
  });
}

// Create lesson
export function useCreateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/lessons', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    },
  });
}

// Update lesson
export function useUpdateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/lessons/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    },
  });
}

// Delete lesson
export function useDeleteLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/lessons/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    },
  });
}

// Get available modules for lesson assignment
export function useAvailableModules() {
  return useQuery({
    queryKey: ['available-modules'],
    queryFn: async () => {
      const response = await axios.get('/api/lessons/available-modules');
      return response.data;
    },
  });
}

// Get lesson by ID for editing
export function useLessonById(id: string | null) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/lessons/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if id is provided
  });
}