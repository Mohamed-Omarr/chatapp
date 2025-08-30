"use server"

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer"
import { getUserInfo } from "../getUserInfo"

export async function getMessages(friendId: string) {
  const supabase = await supabaseServer()
  const user = await getUserInfo()

  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)

  return data
}
