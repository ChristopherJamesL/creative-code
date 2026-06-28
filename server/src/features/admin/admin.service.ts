import { supabase } from "../../config/supabase.js";

export async function listUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function inviteUser(email: string, fullName: string, invitedById: string) {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });

  if (error) throw new Error(error.message);

  // The trigger already created the profile; update invited_by and full_name
  if (data.user) {
    await supabase
      .from("profiles")
      .update({ invited_by: invitedById, full_name: fullName })
      .eq("id", data.user.id);
  }

  return data.user;
}

export async function updateUserRole(targetUserId: string, role: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", targetUserId)
    .select("id, email, full_name, role")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
