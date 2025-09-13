import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch user progress for admin
export function useAdminUserProgress(filters?: {
  userId?: string;
  lessonId?: string;
  completed?: boolean;
}) {
  return useQuery({
    queryKey: ['admin-user-progress', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.lessonId) params.append('lessonId', filters.lessonId);
      if (filters?.completed !== undefined) params.append('completed', filters.completed.toString());

      const response = await axios.get(`/api/v1/admin/user-progress?${params.toString()}`);
      return response.data;
    },
  });
}

// Fetch user stats for admin
export function useAdminUserStats() {
  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/admin/user-stats');
      return response.data;
    },
  });
}

// Reset user progress
export function useResetUserProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressId: string) => {
      const response = await axios.patch(`/api/v1/admin/user-progress/${progressId}/reset`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
    },
  });
}