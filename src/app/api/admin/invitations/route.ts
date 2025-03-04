import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { env } from '@/env.mjs';
import { withAdmin } from '@/lib/auth';
import { createInvitation } from '@/lib/invitations';
import prisma from '@/lib/prisma';

// 招待作成リクエストのバリデーションスキーマ
const invitationSchema = z.object({
  email: z.string().email(),
  role: z.string().default('user'),
});

/**
 * 招待一覧を取得する（招待者情報も含む）
 */
export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
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
          inviteUrl, // 招待リンクを追加
        };
      })
    );

    return NextResponse.json(invitationsWithDetails);
  });
}

/**
 * 新しい招待を作成する
 */
export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const body = await request.json();
      const { email, role } = invitationSchema.parse(body);

      await createInvitation(email, role, userId);

      return NextResponse.json(
        { success: true, message: '招待メールを送信しました' },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: '入力データが不正です', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Invitation creation error:', error);
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラーが発生しました';

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  });
}
