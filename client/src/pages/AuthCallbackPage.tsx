import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axios";
import type { User } from "../features/auth/types";
import Spinner from "../components/ui/Spinner";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const type = params.get("type"); // "invite" | "recovery" | etc.

    if (!accessToken || type !== "invite") {
      navigate("/login", { replace: true });
      return;
    }

    apiClient
      .post<{ data: User }>("/auth/exchange-token", { access_token: accessToken })
      .then(({ data }) => {
        queryClient.setQueryData(["auth"], data.data);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, [navigate, queryClient]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Spinner size="md" />
    </div>
  );
}
