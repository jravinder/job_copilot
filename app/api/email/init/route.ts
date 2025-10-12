import { verifyEmailService } from "@/services/email-service"
import { updateAuthSettings } from "@/lib/supabase-admin"

// Add dynamic flag to prevent static generation
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Operation timed out")), 5000)
    })

    // Race between the verification and timeout
    const isEmailServiceWorking = await Promise.race([verifyEmailService(), timeoutPromise])

    if (!isEmailServiceWorking) {
      throw new Error("Email service verification failed")
    }

    // Update Supabase Auth settings with timeout
    await Promise.race([updateAuthSettings(), timeoutPromise])

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error initializing email service:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to initialize email service",
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
