import { supabase } from "../../config/supabase.js";

export async function listUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

const CALLBACK_URL = `${process.env.CLIENT_URL}/auth/callback`;

async function generateInviteLink(email: string, fullName: string) {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      redirectTo: CALLBACK_URL,
      data: { full_name: fullName },
    },
  });

  if (error) throw new Error(error.message);
  return data.properties.action_link;
}

async function sendSupabaseInvite(email: string, fullName: string) {
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: CALLBACK_URL,
    data: { full_name: fullName },
  });
  if (error) throw new Error(error.message);
}

async function deleteAuthUserByEmail(email: string) {
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existing = users.find((u) => u.email === email);
  if (!existing) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", existing.id)
    .single();

  if (profile) {
    const { count } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", existing.id);
    if (count && count > 0) throw new Error("This user has existing data and cannot be re-invited.");
    await supabase.from("profiles").delete().eq("id", existing.id);
  }

  await supabase.auth.admin.deleteUser(existing.id);
}

export async function inviteUser(email: string, fullName: string, _invitedById: string) {
  if (process.env.NODE_ENV !== "production") {
    // Dev: log invite link to terminal instead of sending email
    try {
      const link = await generateInviteLink(email, fullName);
      console.log("\n[inviteUser] invite link (open this to test):\n", link, "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (!message.toLowerCase().includes("already")) throw err;
      await deleteAuthUserByEmail(email);
      const link = await generateInviteLink(email, fullName);
      console.log("\n[inviteUser] invite link (open this to test):\n", link, "\n");
    }
    return;
  }

  // Production: Supabase sends the invite email directly
  try {
    await sendSupabaseInvite(email, fullName);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    // Only retry if the user already exists — other errors (rate limit, etc.) should surface immediately
    if (!message.toLowerCase().includes("already")) throw err;
    await deleteAuthUserByEmail(email);
    await sendSupabaseInvite(email, fullName);
  }
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
