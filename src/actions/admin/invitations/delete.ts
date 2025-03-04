'use server';

import { requireAdmin } from '@/lib/auth';
import { cancelInvitation } from '@/lib/invitations';

/**
 * 招待を削除するサーバーアクション
 */
export async function deleteInvitationAction(
  invitationId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // 管理者権限の確認
    const { isAllowed } = await requireAdmin();
    if (!isAllowed) {
      return {
        success: false,
        message: '管理者権限が必要です',
      };
    }

    // 招待の削除
    await cancelInvitation(invitationId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return {
      success: false,
      message: '招待の削除に失敗しました',
    };
  }
}
