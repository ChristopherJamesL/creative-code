export type UserRole = "admin" | "attorney" | "staff";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}
