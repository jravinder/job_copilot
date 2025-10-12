import nodemailer from "nodemailer"

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587, // Force port 587 for TLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Enable logger
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    console.log("Attempting to send email with config:", {
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      from: process.env.SMTP_SENDER,
      to,
      subject,
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_SENDER,
      to,
      subject,
      text,
      html,
    })

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    })

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Verify SMTP connection
export async function verifyEmailService() {
  try {
    console.log("Verifying SMTP configuration:", {
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      user: process.env.SMTP_USER ? "Set" : "Not set",
      pass: process.env.SMTP_PASS ? "Set" : "Not set",
      sender: process.env.SMTP_SENDER,
    })

    await transporter.verify()
    console.log("SMTP server connection successful")
    return true
  } catch (error) {
    console.error("SMTP server connection failed:", error)
    return false
  }
}
