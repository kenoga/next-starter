'use server';

import { z } from 'zod';

import { acceptInvitation } from '@/lib/invitations';

// 招待受諾リクエストのバリデーションスキーマ
const acceptInvitationSchema = z.object({
  token: z.string(),
});

export async function acceptInvitationAction(token: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // 入力値の検証
    acceptInvitationSchema.parse({ token });

    // 招待を受け入れる
    const result = await acceptInvitation(token);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: '入力データが不正です',
      };
    }

    console.error('Error accepting invitation:', error);
    return {
      success: false,
      message: '招待の受諾中にエラーが発生しました',
    };
  }
}
