import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      hasSession: !!data.session,
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
