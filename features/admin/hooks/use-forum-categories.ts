import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch forum categories
export function useForumCategories(filters?: {
  language?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['admin-forum-categories', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.language) params.append('language', filters.language);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axios.get(`/api/v1/admin/forum-categories?${params.toString()}`);
      return response.data;
    },
  });
}

// Update forum category
export function useUpdateForumCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/v1/admin/forum-categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-forum-categories'] });
    },
  });
}

// Delete forum category
export function useDeleteForumCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/v1/admin/forum-categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-forum-categories'] });
    },
  });
}

// Create forum category
export function useCreateForumCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/v1/admin/forum-categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-forum-categories'] });
    },
  });
}