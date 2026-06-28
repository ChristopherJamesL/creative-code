import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { signIn } from "../api/auth.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => signIn(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);
      navigate("/dashboard");
    },
  });

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? ((error.response?.data as { error?: string })?.error ?? "Sign in failed")
      : "Sign in failed"
    : null;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mutate(); }}
      className="flex flex-col gap-3"
    >
      <Input
        label="Email"
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
      <Button type="submit" disabled={isPending} size="md" className="w-full mt-1">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
