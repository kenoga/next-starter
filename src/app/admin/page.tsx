import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';

export default async function AdminPage() {
  // 管理者権限チェック
  const auth = await requireAdmin();

  // 管理者以外はアクセス不可
  if (!auth.isAllowed) {
    redirect('/');
  }

  // 管理者トップページは招待管理ページにリダイレクト
  redirect('/admin/invitations');
}
