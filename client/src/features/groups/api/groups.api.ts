import apiClient from "../../../api/axios";
import type { Group } from "../types";

export async function fetchGroups(): Promise<Group[]> {
  const { data } = await apiClient.get<{ data: Group[] }>("/groups");
  return data.data;
}

export async function createGroup(name: string): Promise<Group> {
  const { data } = await apiClient.post<{ data: Group }>("/groups", { name });
  return data.data;
}
