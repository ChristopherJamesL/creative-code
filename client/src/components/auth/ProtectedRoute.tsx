import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return <div>Loading Spinner...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
