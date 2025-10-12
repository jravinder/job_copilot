import { sendEmail } from "@/services/email-service"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { email, password, fullName, resend } = await request.json()

    // If this is a resend request, just send the email
    if (resend) {
      // Generate a verification URL
      const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?type=signup&email=${encodeURIComponent(email)}`

      await sendEmail({
        to: email,
        subject: "Welcome to Personal Job CoPilot - Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Welcome to Personal Job CoPilot!</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for signing up! Please verify your email address to get started:</p>
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

      return Response.json({
        success: true,
        message: "Verification email resent",
      })
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    if (existingUsers?.users && existingUsers.users.length > 0) {
      return Response.json(
        {
          success: false,
          error: "This email is already registered. Please try logging in.",
        },
        { status: 400 },
      )
    }

    // 1. Create the user in Supabase
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
      },
    })

    if (signUpError) {
      console.error("Supabase signup error:", signUpError)
      return Response.json(
        {
          success: false,
          error: signUpError.message,
        },
        { status: 400 },
      )
    }

    // 2. Send verification email using our Mailgun setup
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?type=signup&email=${encodeURIComponent(email)}`

    await sendEmail({
      to: email,
      subject: "Welcome to Personal Job CoPilot - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to Personal Job CoPilot!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for signing up! Please verify your email address to get started:</p>
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

    return Response.json({
      success: true,
      user: authData.user,
      message: "Verification email sent",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to create account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
