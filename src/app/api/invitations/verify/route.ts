import { NextRequest, NextResponse } from 'next/server';

import { validateInvitationToken } from '@/lib/invitations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { valid: false, message: 'Token is required' },
      { status: 400 }
    );
  }

  const validation = await validateInvitationToken(token);

  if (!validation.valid) {
    return NextResponse.json(
      { valid: false, message: validation.message },
      { status: 400 }
    );
  }

  // レスポンスにはメールアドレスと予定されたロールのみを含める
  // validationがtrueの場合はinvitationが存在することを保証
  const invitation = validation.invitation!;
  return NextResponse.json({
    valid: true,
    email: invitation.email,
    role: invitation.role,
  });
}
