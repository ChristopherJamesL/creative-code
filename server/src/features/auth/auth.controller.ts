import type { Request, Response } from "express";
import { signIn, getProfileById } from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";
import { supabase } from "../../config/supabase.js";

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  path: "/",
};

export async function httpLogin(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const { data, error } = await signIn(email, password);

  if (error || !data.session) {
    res.status(401).json({ error: error?.message ?? "Invalid credentials" });
    return;
  }

  const profile = await getProfileById(data.user.id);

  if (!profile) {
    res.status(404).json({ error: "User profile not found" });
    return;
  }

  res.cookie("access_token", data.session.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 1000,
  });

  return sendSuccess(res, { data: profile });
}

export async function httpLogout(_req: Request, res: Response) {
  res.clearCookie("access_token", COOKIE_OPTIONS);
  return sendSuccess(res, { data: null });
}

export async function httpGetMe(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const profile = await getProfileById(userId);

  if (!profile) {
    res.status(404).json({ error: "User profile not found" });
    return;
  }

  return sendSuccess(res, { data: profile });
}

export async function httpSetPassword(req: Request, res: Response) {
  const { access_token, password } = req.body as { access_token?: string; password?: string };

  if (!access_token || !password) {
    res.status(400).json({ error: "access_token and password are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const { data: { user }, error: getUserError } = await supabase.auth.getUser(access_token);
  if (getUserError || !user) {
    res.status(401).json({ error: "Invalid or expired invite link" });
    return;
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (updateError) {
    res.status(500).json({ error: updateError.message });
    return;
  }

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  });
  if (signInError || !data.session) {
    res.status(500).json({ error: "Password set but sign-in failed" });
    return;
  }

  // Profile is created here — not by a trigger — so account only exists after password is set
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email!,
    full_name: (user.user_metadata?.full_name as string) ?? "",
    role: "staff",
  }, { onConflict: "id" });

  if (profileError) {
    res.status(500).json({ error: "Failed to create profile" });
    return;
  }

  const profile = await getProfileById(user.id);
  if (!profile) {
    res.status(500).json({ error: "Profile not found after creation" });
    return;
  }

  res.cookie("access_token", data.session.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 1000,
  });

  return sendSuccess(res, { data: profile });
}

// Handles the token that Supabase puts in the URL hash after invite acceptance
export async function httpExchangeToken(req: Request, res: Response) {
  const { access_token } = req.body as { access_token?: string };

  if (!access_token) {
    res.status(400).json({ error: "access_token is required" });
    return;
  }

  const { data: { user }, error } = await (await import("../../config/supabase.js")).supabase.auth.getUser(access_token);

  if (error || !user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const profile = await getProfileById(user.id);

  if (!profile) {
    res.status(404).json({ error: "User profile not found" });
    return;
  }

  res.cookie("access_token", access_token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 1000,
  });

  return sendSuccess(res, { data: profile });
}
