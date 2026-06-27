import { useQuery } from "@tanstack/react-query";
import { httpLogin } from "../api/auth.api";
import type { User } from "../types";

export function useAuth() {
  return useQuery<User>({
    queryKey: ["auth"],
    queryFn: httpLogin,
    enabled: false,
  });
}
