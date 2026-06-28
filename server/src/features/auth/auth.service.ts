import { supabase } from "../../config/supabase.js";

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function getProfileById(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id:        data.id as string,
    email:     data.email as string,
    name:      (data.full_name as string) || "",
    role:      data.role as string,
    createdAt: data.created_at as string,
  };
}
