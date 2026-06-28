import { supabase } from "../../config/supabase.js";

export async function listGroups() {
  const { data, error } = await supabase
    .from("document_groups")
    .select("id, name, created_at")
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}

export async function createGroup(name: string) {
  const { data, error } = await supabase
    .from("document_groups")
    .insert({ name: name.trim() })
    .select("id, name, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
