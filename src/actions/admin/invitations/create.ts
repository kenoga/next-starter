'use server';

import { z } from 'zod';

import { requireAdmin } from '@/lib/auth';
import { createInvitation } from '@/lib/invitations';

// 招待作成リクエストのバリデーションスキーマ
const invitationSchema = z.object({
  email: z.string().email(),
  role: z.string().default('user'),
});

/**
 * 新しい招待を作成するサーバーアクション
 */
export async function createInvitationAction(
  email: string,
  role: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 管理者権限の確認
    const { isAllowed, userId } = await requireAdmin();
    if (!isAllowed || !userId) {
      return {
        success: false,
        message: '管理者権限が必要です',
      };
    }

    // 入力値の検証
    invitationSchema.parse({ email, role });

    // 招待の作成
    await createInvitation(email, role, userId);

    return {
      success: true,
      message: '招待メールを送信しました',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: '入力データが不正です',
      };
    }

    console.error('招待作成エラー:', error);
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';

    return { success: false, message: errorMessage };
  }
}
