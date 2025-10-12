import { supabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("Checking auth connection...")

    // Simple connection test
    const { data, error } = await supabaseAdmin.auth.getSession()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Auth connection verified",
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("Error checking auth connection:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to verify auth connection",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    )
  }
}
