"use server";

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";

export async function getMessages(roomName: string) {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        sender_id:profiles!messages_sender_id_fkey (
          username,
          avatar_url
        )
      `)
      .eq("room_name", roomName)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Unexpected error fetching messages:", err);
    return [];
  }
}
