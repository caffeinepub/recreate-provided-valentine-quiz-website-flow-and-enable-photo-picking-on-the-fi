import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MediaItem } from '@/backend';

// Love Letter Queries
export function useGetLoveLetter() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['loveLetter'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getLoveLetter();
    },
    enabled: !!actor && !isFetching,
    retry: 1, // Only retry once to avoid excessive retries
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}

// Love Letter Mutations
export function useSaveLoveLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLoveLetter: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveLoveLetter(newLoveLetter);
    },
    onSuccess: () => {
      // Invalidate and refetch the love letter query
      queryClient.invalidateQueries({ queryKey: ['loveLetter'] });
    },
  });
}

// Media Queries
export function useGetAllMedia() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaItem[]>({
    queryKey: ['media'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedia();
    },
    enabled: !!actor && !isFetching,
  });
}
