export const emailTemplates = {
  confirmSignUp: {
    subject: "Welcome to Personal Job CoPilot - Confirm Your Email",
    html: (confirmationUrl: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Welcome to Personal Job CoPilot!</h1>
        <p>Thank you for signing up. To get started, please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Email Address
          </a>
        </div>
        <p style="color: #4a5568; font-size: 14px;">
          If you didn't create an account with us, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px;">
          This is an automated message from Personal Job CoPilot. Please do not reply to this email.
        </p>
      </div>
    `,
  },
  resetPassword: {
    subject: "Reset Your Password - Personal Job CoPilot",
    html: (resetUrl: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Reset Your Password</h1>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #4a5568; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px;">
          This is an automated message from Personal Job CoPilot. Please do not reply to this email.
        </p>
      </div>
    `,
  },
}
