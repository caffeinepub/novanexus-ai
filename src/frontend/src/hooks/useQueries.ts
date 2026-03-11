import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Conversation, Message, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useListConversations() {
  const { actor, isFetching } = useActor();
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listConversations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMessages(conversationId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId?.toString()],
    queryFn: async () => {
      if (!actor || conversationId === null) return [];
      return actor.getMessages(conversationId);
    },
    enabled: !!actor && !isFetching && conversationId !== null,
    refetchInterval: false,
  });
}

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("No actor");
      return actor.createConversation(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeleteConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteConversation(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: bigint;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.sendMessage(conversationId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
