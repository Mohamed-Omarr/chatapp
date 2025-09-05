"use server";

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";
import { getUserInfo } from "../getUserInfo";

export async function sendMessages(roomName: string, content: string) {
  try {
    const supabase = await supabaseServer();
    const user = await getUserInfo();

    if (!user) {
      return { success: false, error: "User is not authenticated." };
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      room_name: roomName,
      content,
    });

    if (error) {
      console.error("Failed to send message:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error while sending message:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}
