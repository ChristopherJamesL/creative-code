import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, inviteUser, updateUserRole } from "../api/admin.api";
import type { UserRole } from "../../auth/types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, fullName }: { email: string; fullName: string }) =>
      inviteUser(email, fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
