'use server'

import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer"

export const refreshingAccessToken = async (): Promise<string | undefined> => {
  try {
    const supabase = await supabaseServer()

    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error("Failed to refresh session:", error.message)
      return undefined
    }

    // The refresh token cookie is automatically updated by setItem
    return data.session?.access_token
  } catch (err) {
    console.error("Error refreshing access token:", err)
    return undefined
  }
}
