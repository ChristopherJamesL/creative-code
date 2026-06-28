import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGroups, createGroup } from "../api/groups.api";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });
}
