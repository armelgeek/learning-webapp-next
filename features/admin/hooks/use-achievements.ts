import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch achievements
export function useAchievements(filters?: {
  type?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['admin-achievements', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axios.get(`/api/v1/admin/achievements?${params.toString()}`);
      return response.data;
    },
  });
}

// Update achievement
export function useUpdateAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/v1/admin/achievements/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
    },
  });
}

// Delete achievement
export function useDeleteAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/v1/admin/achievements/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
    },
  });
}

// Create achievement
export function useCreateAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/v1/admin/achievements', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] });
    },
  });
}