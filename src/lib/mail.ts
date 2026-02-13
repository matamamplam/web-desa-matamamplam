import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend('re_Y4trVUWR_G9Q9FP3UEDScyiiUJqBCycm5');

const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://matamamplam.my.id';

export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`;
  
  // Fetch settings for dynamic branding
  const settings = await prisma.siteSettings.findFirst();
  const rawSettings = settings?.settings as any;
  const siteName = rawSettings?.general?.siteName || 'Desa Mata Mamplam';
  const logoUrl = rawSettings?.branding?.logo || `${domain}/images/logo.png`; // Fallback to local logo path if no uploaded logo
  const address = rawSettings?.contact?.address || '';
  
  // Professional HTML Template
  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Reset Password</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9fafb;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo {
        max-height: 80px;
        width: auto;
      }
      .card {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        padding: 40px;
        text-align: center;
      }
      .title {
        color: #111827;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
      }
      .text {
        font-size: 16px;
        color: #4b5563;
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        background-color: #2563eb;
        color: #ffffff;
        font-weight: 600;
        font-size: 16px;
        padding: 12px 32px;
        text-decoration: none;
        border-radius: 6px;
        margin-bottom: 30px;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: #1d4ed8;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #9ca3af;
      }
      .divider {
        border-top: 1px solid #e5e7eb;
        margin: 30px 0;
      }
      .link-text {
        font-size: 12px;
        color: #6b7280;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        ${logoUrl && !logoUrl.startsWith('/') ? `<img src="${logoUrl}" alt="${siteName}" class="logo">` : `<h1 style="color: #2563eb; margin: 0;">${siteName}</h1>`}
      </div>
      
      <div class="card">
        <h1 class="title">Reset Password Anda</h1>
        
        <p class="text">
          Kami menerima permintaan untuk mereset password akun Admin <strong>${siteName}</strong> Anda.
        </p>
        
        <a href="${resetLink}" class="button" target="_blank">Reset Password</a>
        
        <p class="text" style="font-size: 14px;">
          Link ini hanya berlaku selama 1 jam untuk alasan keamanan.
        </p>
        
        <div class="divider"></div>
        
        <p class="text" style="font-size: 14px; margin-bottom: 10px;">
          Jika tombol di atas tidak berfungsi, salin dan tempel link berikut ke browser Anda:
        </p>
        <p class="link-text">
          <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
        </p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        ${address ? `<p>${address}</p>` : ''}
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: `Reset Password - ${siteName}`,
    html: emailHtml
  });
};
