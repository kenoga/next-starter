import { render } from '@react-email/render';
import sgMail from '@sendgrid/mail';

import InvitationEmail from '@/emails/invitation-email';
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

  // React EmailコンポーネントをレンダリングしてHTML文字列に変換
  const emailHtml = render(InvitationEmail({ inviteUrl, role }));

  return sendMail({ to: email, subject, html: emailHtml });
}
