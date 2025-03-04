'use server';

import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendPasswordSetupEmail } from '@/lib/users';

/**
 * 管理者がユーザーにパスワード設定メールを送信する
 * @param userId データベース上のユーザーID
 */
export async function sendPasswordSetupForUser(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // 管理者権限チェック
    const { isAllowed } = await requireAdmin();
    if (!isAllowed) {
      return {
        success: false,
        message: '管理者権限が必要です',
      };
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        auth0Id: true,
      },
    });

    if (!user || !user.email || !user.auth0Id) {
      return {
        success: false,
        message: 'ユーザーが見つからないか、必要な情報が不足しています',
      };
    }

    // パスワード設定メールを送信
    await sendPasswordSetupEmail(
      user.auth0Id,
      user.email,
      user.name || undefined
    );

    return {
      success: true,
      message: 'パスワード設定メールを送信しました',
    };
  } catch (err) {
    console.error('Error sending password setup email:', err);
    return {
      success: false,
      message: 'パスワード設定メールの送信に失敗しました',
    };
  }
}
