import { NextRequest, NextResponse } from 'next/server';

import { withAdmin } from '@/lib/auth';
import { cancelInvitation } from '@/lib/invitations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  return withAdmin(request, async () => {
    try {
      await cancelInvitation(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting invitation:', error);
      return NextResponse.json(
        { error: '招待の削除に失敗しました' },
        { status: 500 }
      );
    }
  });
}
