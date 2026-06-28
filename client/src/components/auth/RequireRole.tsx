import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import type { UserRole } from "../../features/auth/types";

interface RequireRoleProps {
  role: UserRole;
}

export default function RequireRole({ role }: RequireRoleProps) {
  const { data: user } = useAuth();

  if (user?.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
