import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@aex.training',
    to: email,
    subject: 'AEX Training — Reset Your Password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 24px 0; border-bottom: 1px solid #eee;">
          <span style="font-size: 12px; letter-spacing: 2px; color: #888; text-transform: uppercase;">AEXTrainers</span>
        </div>
        <div style="padding: 32px 0;">
          <p style="font-size: 15px; line-height: 1.6;">You requested a password reset. Click below to set a new password:</p>
          <div style="text-align: center; padding: 24px 0;">
            <a href="${resetUrl}" style="background: #c97d3c; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reset Password</a>
          </div>
          <p style="font-size: 13px; color: #888; line-height: 1.5;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  })
}
