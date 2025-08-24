"use server"

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer"

export async function sendFriendRequest(toUserId: string) {
  try {
    const supabase = await supabaseServer()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("Not authenticated")
    }

    const { error } = await supabase
      .from("friend_requests")
      .insert({
        from_user: user.id,
        to_user: toUserId,
        status: "pending",
      })

    if (error) throw new Error(error.message)

    return { success: true }
  } catch (err) {
    console.error("Failed to send friend request:", err)
    return {
      success: false,
      message: "Failed to send friend request",
    }
  }
}
