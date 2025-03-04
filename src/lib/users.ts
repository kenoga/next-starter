import { generatePasswordChangeTicket } from './auth0';
import { sendPasswordResetEmail } from './mail';
import prisma from './prisma';

/**
 * ユーザー作成後にパスワード設定用メールを送信する
 * @param userId Auth0のユーザーID
 * @param email ユーザーのメールアドレス
 * @param name ユーザー名（オプション）
 */
export async function sendPasswordSetupEmail(
  userId: string,
  email: string,
  name?: string
): Promise<void> {
  try {
    // Auth0からパスワード変更URLを取得（パスワード設定後はログインページへリダイレクト）
    // 明示的にリダイレクト先を指定
    const resultUrl = `${process.env.APP_URL}/api/auth/signin`;
    const resetUrl = await generatePasswordChangeTicket(userId, resultUrl);

    console.log('Password reset URL:', resetUrl);

    // ユーザー名の取得を試みる（nameパラメータが未指定の場合）
    let userName = name;
    if (!userName) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { name: true },
      });
      if (user?.name) {
        userName = user.name;
      }
    }

    // パスワード設定メールを送信
    await sendPasswordResetEmail(email, resetUrl, userName);
  } catch (error) {
    console.error('Failed to send password setup email:', error);
    throw new Error('パスワード設定メールの送信に失敗しました');
  }
}
