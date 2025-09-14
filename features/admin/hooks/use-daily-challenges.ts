import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DailyChallengeFilter {
  date?: string;
  language?: string;
  isActive?: boolean;
}

interface CreateDailyChallengeData {
  title: string;
  description: string;
  targetValue: number;
  pointsReward: number;
  language?: string;
  difficultyLevel?: string;
  date: string;
}

async function fetchDailyChallenges(filter?: DailyChallengeFilter) {
  const params = new URLSearchParams();
  if (filter?.date) params.append('date', filter.date);
  if (filter?.language) params.append('language', filter.language);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  
  const response = await fetch(`/api/v1/daily-challenges?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch daily challenges');
  }
  return response.json();
}

async function createDailyChallenge(data: CreateDailyChallengeData) {
  const response = await fetch('/api/v1/daily-challenges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create daily challenge');
  }
  return response.json();
}

async function deleteDailyChallenge(id: string) {
  const response = await fetch(`/api/v1/daily-challenges/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete daily challenge');
  }
  return response.json();
}

export function useDailyChallenges(filter?: DailyChallengeFilter) {
  return useQuery({
    queryKey: ['daily-challenges', filter],
    queryFn: () => fetchDailyChallenges(filter),
  });
}

export function useCreateDailyChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDailyChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-challenges'] });
    },
  });
}

export function useDeleteDailyChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDailyChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-challenges'] });
    },
  });
}