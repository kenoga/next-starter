import sgMail from '@sendgrid/mail';

import { env } from '@/env.mjs';

// SendGridのAPIキーを設定
sgMail.setApiKey(env.SENDGRID_API_KEY);

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * メールを送信する
 */
export async function sendMail({
  to,
  subject,
  html,
}: SendMailOptions): Promise<void> {
  const msg = {
    to,
    from: env.SENDGRID_FROM_EMAIL, // 認証済みの送信元アドレス
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * 招待メールを送信する
 */
export function sendInvitationEmail(
  email: string,
  inviteUrl: string,
  role: string
): Promise<void> {
  const subject = '【Next Starter】サービス招待のお知らせ';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; font-size: 24px;">Next Starterへのご招待</h1>
      <p>このたびは Next Starter へご招待いたします。</p>
      <p>あなたは「${role}」権限でサービスにご招待されました。</p>
      <p>下記リンクをクリックして招待を承認してください：</p>
      <div style="margin: 30px 0;">
        <a href="${inviteUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          招待を承認する
        </a>
      </div>
      <p>このリンクは48時間有効です。</p>
      <p>※このメールは送信専用です。返信いただいてもお答えできませんのでご了承ください。</p>
    </div>
  `;

  return sendMail({ to: email, subject, html });
}
