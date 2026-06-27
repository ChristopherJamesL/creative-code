import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { isLoading, error, refetch } = useAuth();

  async function handleLogin() {
    const response = await refetch();

    if (response.data) navigate("/dashboard");
  }

  return (
    <div>
      <Button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {error && <p className="text-sm text-destructive">Login failed</p>}
    </div>
  );
}
