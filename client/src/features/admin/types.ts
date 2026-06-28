import type { UserRole } from "../auth/types";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}
