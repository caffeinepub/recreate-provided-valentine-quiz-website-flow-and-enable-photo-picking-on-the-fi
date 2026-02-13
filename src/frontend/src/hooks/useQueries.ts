import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MediaItem } from '@/backend';
import { ExternalBlob, MediaType } from '@/backend';

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

export function useUpdateLoveLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLetter: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateLoveLetter(newLetter);
    },
    onSuccess: () => {
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

export function useAddMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      blob,
      mediaType,
      description,
      fileName,
    }: {
      id: string;
      blob: ExternalBlob;
      mediaType: MediaType;
      description: string;
      fileName: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addMedia(id, blob, mediaType, description, fileName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMedia(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
