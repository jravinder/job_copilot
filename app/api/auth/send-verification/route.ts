import { sendEmail } from "@/services/email-service"

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 })
    }

    // Create the verification URL with the token
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}&type=signup`

    // Send verification email using our working Mailgun setup
    await sendEmail({
      to: email,
      subject: "Verify your email - Personal Job CoPilot",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to Personal Job CoPilot!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #0070f3;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            ">Verify Email Address</a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this URL into your browser:</p>
          <p style="color: #0070f3; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours.</p>
          <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return Response.json(
      {
        error: "Failed to send verification email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
