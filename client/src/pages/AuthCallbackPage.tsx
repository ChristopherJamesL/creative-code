import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { supabase } from "../lib/supabase";
import type { User } from "../features/auth/types";
import Spinner from "../components/ui/Spinner";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    console.log("[callback] full URL:", window.location.href);
    console.log("[callback] hash:", window.location.hash);
    console.log("[callback] search:", window.location.search);

    // Implicit flow: token lives in the URL hash
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hashAccessToken = hashParams.get("access_token");
    const hashType = hashParams.get("type");

    // PKCE flow: token_hash lives in query params
    const searchParams = new URLSearchParams(window.location.search);
    const tokenHash = searchParams.get("token_hash");
    const queryType = searchParams.get("type");

    console.log("[callback] parsed →", { hashAccessToken: !!hashAccessToken, hashType, tokenHash: !!tokenHash, queryType });

    if (hashAccessToken) {
      handleAccessToken(hashAccessToken, hashType);
    } else if (tokenHash && queryType) {
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type: queryType as "invite" | "recovery" | "magiclink" | "signup" })
        .then(({ data, error }) => {
          if (error || !data.session) {
            navigate("/login", { replace: true });
            return;
          }
          handleAccessToken(data.session.access_token, queryType);
        })
        .catch(() => navigate("/login", { replace: true }));
    } else {
      navigate("/login", { replace: true });
    }

    function handleAccessToken(accessToken: string, type: string | null) {
      if (type === "invite" || type === "recovery") {
        navigate(`/auth/set-password?token=${accessToken}`, { replace: true });
        return;
      }

      apiClient
        .post<{ data: User }>("/auth/exchange-token", { access_token: accessToken })
        .then(({ data }) => {
          queryClient.setQueryData(["auth"], data.data);
          navigate("/dashboard", { replace: true });
        })
        .catch(() => navigate("/login", { replace: true }));
    }
  }, [navigate, queryClient]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Spinner size="md" />
    </div>
  );
}
