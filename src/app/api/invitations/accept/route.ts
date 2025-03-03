import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { acceptInvitation } from '@/lib/invitations';

// 招待受諾リクエストのバリデーションスキーマ
const acceptInvitationSchema = z.object({
  token: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = acceptInvitationSchema.parse(body);

    const result = await acceptInvitation(token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: '入力データが不正です',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { success: false, message: '招待の受諾中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
