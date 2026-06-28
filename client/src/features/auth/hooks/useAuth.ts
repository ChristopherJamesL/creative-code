import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/axios";
import type { User } from "../types";

export function useAuth() {
  return useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: () =>
      apiClient
        .get<{ data: User }>("/auth/me")
        .then((r) => r.data.data)
        .catch(() => null),
    staleTime: Infinity,
    retry: false,
  });
}
