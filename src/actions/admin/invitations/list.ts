'use server';

import { env } from '@/env.mjs';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * 招待一覧を取得するサーバーアクション
 */
export async function getInvitationsAction(): Promise<
  | Array<{
      id: string;
      email: string;
      role: string;
      token: string;
      expires: Date;
      used: boolean;
      createdAt: Date;
      invitedBy: string;
      inviterName: string;
      inviterEmail: string;
      inviteUrl: string;
    }>
  | { error: string; status: number }
> {
  try {
    // 管理者権限の確認
    const { isAllowed } = await requireAdmin();
    if (!isAllowed) {
      return { error: 'Unauthorized', status: 401 };
    }

    // 招待リストの取得
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // 招待ユーザーごとに招待者の情報と招待リンクを取得
    const invitationsWithDetails = await Promise.all(
      invitations.map(async (invitation) => {
        const inviter = await prisma.user.findUnique({
          where: { id: invitation.invitedBy },
          select: { name: true, email: true },
        });

        // 招待リンクの作成
        const inviteUrl = `${env.APP_URL}/invite?token=${invitation.token}`;

        return {
          ...invitation,
          inviterName: inviter?.name || '',
          inviterEmail: inviter?.email || '',
          inviteUrl,
        };
      })
    );

    return invitationsWithDetails;
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return { error: 'Failed to fetch invitations', status: 500 };
  }
}
