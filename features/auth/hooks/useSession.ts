import { useQuery } from '@tanstack/react-query';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch('/api/auth/session');
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}