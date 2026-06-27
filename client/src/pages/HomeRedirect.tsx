import { Navigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function HomeRedirect() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading user...</div>; // or full page loader
  }

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
