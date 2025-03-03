import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { InvitationsTable } from '@/components/admin/invitations-table';
import { InviteUserForm } from '@/components/admin/invite-user-form';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminInvitationsPage() {
  // 管理者権限チェック
  const auth = await requireAdmin();

  // 管理者以外はアクセス不可
  if (!auth.isAllowed) {
    redirect('/');
  }

  // 招待リストの取得
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // 招待ユーザーごとに招待者の情報を取得
  const invitationsWithInviter = await Promise.all(
    invitations.map(async (invitation) => {
      const inviter = await prisma.user.findUnique({
        where: { id: invitation.invitedBy },
        select: { name: true, email: true },
      });

      return {
        ...invitation,
        expiresFormatted: format(invitation.expires, 'yyyy年MM月dd日 HH:mm'),
        createdAtFormatted: format(
          invitation.createdAt,
          'yyyy年MM月dd日 HH:mm'
        ),
        inviterName: inviter?.name || '',
        inviterEmail: inviter?.email || '',
      };
    })
  );

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">ユーザー招待管理</h1>
        <p className="text-muted-foreground">
          新しいユーザーを招待したり、既存の招待を管理します。
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <InviteUserForm />
        </div>

        <div className="md:col-span-2">
          <InvitationsTable invitations={invitationsWithInviter} />
        </div>
      </div>
    </main>
  );
}
