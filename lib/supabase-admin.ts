import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY")
}

// Create a Supabase client with the service role key
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
)

export async function updateAuthSettings() {
  try {
    console.log("Updating Supabase Auth settings...")

    const { data, error } = await supabaseAdmin.auth.update({
      auto_confirm: true,
    })

    if (error) {
      throw error
    }

    console.log("Supabase Auth settings updated successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error updating Supabase Auth settings:", error)
    return { success: false, error }
  }
}
