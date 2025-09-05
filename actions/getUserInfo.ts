'use server'
import { supabaseServer } from "@/lib/supabaseHooks/supabaseServer";

export async function  getUserInfo() {
    try {
        const supabase = await supabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, email")
            .eq("id", user.id)
            .single();

            return data;
        }
    } catch (err){
        throw new Error (`Failed to get user info: ${err} `)
    }
}
