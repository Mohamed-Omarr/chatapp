"use server";
import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";
import { getUserInfo } from "../../getUserInfo";

export async function getFriendRequests() {
  try {
    const supabase = await supabaseServer();
    const user = await getUserInfo();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("friend_requests")
      .select(
        `
        id,
        status,
        from_user:profiles!friend_requests_from_user_fkey (
          id,
          username,
          email,
          avatar_url
        )
      `
      )
      .eq("to_user", user.id)
      .eq("status", "pending");

    if (error) throw error;

    return data;
    
  } catch (error) {
    console.error("Failed to get the friend requests", error);
    return [];
  }
}
