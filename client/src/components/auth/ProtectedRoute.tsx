import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import Spinner from "../ui/Spinner";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="md" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
