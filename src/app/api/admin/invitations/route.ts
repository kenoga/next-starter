import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { withAdmin } from '@/lib/auth';
import { createInvitation } from '@/lib/invitations';
import prisma from '@/lib/prisma';

// 招待作成リクエストのバリデーションスキーマ
const invitationSchema = z.object({
  email: z.string().email(),
  role: z.string().default('user'),
});

/**
 * 招待一覧を取得する
 */
export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(invitations);
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
