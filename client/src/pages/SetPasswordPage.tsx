import { useState } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axios";
import type { User } from "../features/auth/types";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function SetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) return <Navigate to="/login" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await apiClient.post<{ data: User }>("/auth/set-password", {
        access_token: token,
        password,
      });
      queryClient.setQueryData(["auth"], data.data);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Failed to set password. The invite link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground mb-4">
            <span className="text-[11px] font-bold text-background leading-none select-none">L</span>
          </div>
          <h1 className="text-base font-semibold text-foreground">Set your password</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose a password to complete your account setup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <Input
            label="Confirm password"
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            required
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" variant="primary" size="md" disabled={loading}>
            {loading ? "Setting up account…" : "Set password & sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
