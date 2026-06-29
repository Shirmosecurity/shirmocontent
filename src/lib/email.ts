const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

export async function sendPasswordResetEmail(email: string, token: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  await resend.emails.send({
    from: FROM, to: email,
    subject: 'Reset your ShirmoContent password',
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0F0F1A;color:#E2E8F0;"><div style="font-size:24px;font-weight:800;background:linear-gradient(135deg,#7C3AED,#06B6D4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:24px;">ShirmoContent</div><h2 style="font-size:20px;font-weight:700;margin:0 0 12px;color:#E2E8F0;">Reset your password</h2><p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 24px;">Click the button below to reset your password. This link expires in 1 hour.</p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#7C3AED,#5B21B6);color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Reset Password</a><p style="color:#475569;font-size:12px;margin-top:24px;">If you did not request this, ignore this email.</p></div>`,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  await resend.emails.send({
    from: FROM, to: email,
    subject: 'Welcome to ShirmoContent',
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0F0F1A;color:#E2E8F0;"><div style="font-size:24px;font-weight:800;background:linear-gradient(135deg,#7C3AED,#06B6D4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:24px;">ShirmoContent</div><h2 style="font-size:20px;font-weight:700;margin:0 0 12px;color:#E2E8F0;">Welcome, ${name}! ??</h2><p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 24px;">Your AI content marketing platform is ready.</p><a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#7C3AED,#5B21B6);color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Open Dashboard ?</a></div>`,
  })
}

