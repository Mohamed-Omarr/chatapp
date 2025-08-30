"use server"

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer"
import { getUserInfo } from "../getUserInfo"

export async function sendMessage(friendId: string, content: string) {
  const supabase = await supabaseServer()
  const user = await getUserInfo()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const {error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: friendId,
    content,
  })

  if (error) {
    throw new Error(error.message)
  }
}
