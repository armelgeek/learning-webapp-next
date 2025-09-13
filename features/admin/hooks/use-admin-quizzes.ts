import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch admin quizzes
export function useAdminQuizzes(filters?: {
  lessonId?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: ['admin-quizzes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.lessonId) params.append('lessonId', filters.lessonId);
      if (filters?.type) params.append('type', filters.type);

      const response = await axios.get(`/api/v1/admin/quizzes?${params.toString()}`);
      return response.data;
    },
  });
}

// Update quiz
export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/quizzes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
    },
  });
}

// Delete quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/quizzes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
    },
  });
}

// Create quiz
export function useCreateQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/quizzes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
    },
  });
}