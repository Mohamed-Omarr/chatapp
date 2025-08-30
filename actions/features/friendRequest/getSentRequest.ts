"use server";
import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";
import { getUserInfo } from "../../getUserInfo";

export async function getSentFriendRequests() {
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
        to_user:profiles!friend_requests_to_user_fkey (
          id,
          username,
          email,
          avatar_url
        )
      `
      )
      .eq("from_user", user.id)

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Failed to get sent friend requests", error);
    return [];
  }
}
