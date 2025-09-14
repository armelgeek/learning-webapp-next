import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch admin modules
export function useAdminModules(filters?: {
  language?: string;
  difficultyLevel?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ['admin-modules', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.language) params.append('language', filters.language);
      if (filters?.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axios.get(`/api/v1/admin/modules?${params.toString()}`);
      return response.data;
    },
  });
}

// Update module
export function useUpdateModule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.put(`/api/modules/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
    },
  });
}

// Delete module
export function useDeleteModule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/modules/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
    },
  });
}

// Create module
export function useCreateModule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/modules', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] });
    },
  });
}