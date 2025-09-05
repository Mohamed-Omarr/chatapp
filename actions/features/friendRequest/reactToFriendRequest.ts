"use server"

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer"
import { getUserInfo } from "../../getUserInfo"

export async function acceptFriendRequest(from_user: string, requestId: string) {
  try {
    const user = await getUserInfo()
    if (!user) throw new Error("Not authenticated")

    const supabase = await supabaseServer()

    const { error: requestError } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId)
      .eq("from_user", from_user)
      .eq("to_user", user.id)

    if (requestError) throw new Error(requestError.message)

    const { error: friendError } = await supabase
      .from("friends")
      .insert(
        [
        {
          user_id: user.id,
          friend_id: from_user,
        },
      ]
    )

    if (friendError) throw new Error(friendError.message)

    return { success: true }
  } catch (err) {
    console.error("Failed to accept friend request:", err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to accept friend request",
    }
  }
}

export async function declineFriendRequest(from_user: string, requestId: string) {
  try {
    const user = await getUserInfo()
    if (!user) throw new Error("Not authenticated")

    const supabase = await supabaseServer()

    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId)
      .eq("from_user", from_user)
      .eq("to_user", user.id)

    if (error) throw new Error(error.message)

    return { success: true }
  } catch (err) {
    console.error("Failed to decline (delete) friend request:", err)
    return {
      success: false,
      message: "Failed to decline friend request",
    }
  }
}
