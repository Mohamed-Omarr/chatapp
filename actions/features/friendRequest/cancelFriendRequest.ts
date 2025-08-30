"use server";

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";
import { getUserInfo } from "../../getUserInfo";

export async function cancelFriendRequest(requestId: number) {
  try {
    const supabase = await supabaseServer();
    const user = await getUserInfo();

    if (!user) throw new Error("Not authenticated");

    // Delete only if the logged-in user is the sender
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId)
      .eq("from_user", user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel friend request", error);
    return { success: false, error };
  }
}
