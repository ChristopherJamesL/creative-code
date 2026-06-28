import apiClient from "../../../api/axios";
import type { AdminUser } from "../types";
import type { UserRole } from "../../auth/types";

export async function fetchUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get<{ data: AdminUser[] }>("/admin/users");
  return data.data;
}

export async function inviteUser(email: string, fullName: string): Promise<void> {
  await apiClient.post("/admin/users/invite", { email, full_name: fullName });
}

export async function updateUserRole(userId: string, role: UserRole): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ data: AdminUser }>(`/admin/users/${userId}/role`, { role });
  return data.data;
}
