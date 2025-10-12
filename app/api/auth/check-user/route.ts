import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 })
    }

    // Use admin auth to list users
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    if (error) {
      console.error("Error checking user:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Check if user exists and get verification status
    const user = users?.[0]
    const exists = !!user
    const verified = user?.email_confirmed_at ? true : false

    // Add more detailed logging
    console.log("User check result:", {
      email,
      exists,
      verified,
      user_id: user?.id,
      created_at: user?.created_at,
      last_sign_in: user?.last_sign_in_at,
      email_confirmed_at: user?.email_confirmed_at,
    })

    return Response.json({
      exists,
      verified,
      user: exists
        ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            email_confirmed_at: user.email_confirmed_at,
          }
        : null,
    })
  } catch (error) {
    console.error("Error in check-user:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
