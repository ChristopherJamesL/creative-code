import apiClient from "../../../api/axios";
import type { User } from "../types";

export async function signIn(email: string, password: string): Promise<User> {
  const { data } = await apiClient.post<{ data: User }>("/auth/login", { email, password });
  return data.data;
}

export async function signOut(): Promise<void> {
  await apiClient.post("/auth/logout");
}
