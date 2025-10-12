import { sendEmail } from "@/services/email-service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("Attempting to send test email to:", email)
    console.log("SMTP Configuration:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? "Set" : "Not set",
      pass: process.env.SMTP_PASS ? "Set" : "Not set",
      sender: process.env.SMTP_SENDER,
    })

    // Send a test email
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Personal Job CoPilot",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Personal Job CoPilot.</p>
        <p>If you received this, the email service is working correctly.</p>
      `,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error sending test email:", error)

    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
