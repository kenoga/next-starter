import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminUsersPage() {
  // 管理者権限チェック
  const auth = await requireAdmin();

  // 管理者以外はアクセス不可
  if (!auth.isAllowed) {
    redirect('/');
  }

  // ユーザーリストの取得
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          accounts: true,
          sessions: true,
        },
      },
    },
  });

  // 表示用にデータを整形
  const formattedUsers = users.map((user) => ({
    ...user,
    createdAtFormatted: format(user.createdAt, 'yyyy年MM月dd日 HH:mm'),
    updatedAtFormatted: format(user.updatedAt, 'yyyy年MM月dd日 HH:mm'),
  }));

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">ユーザー管理</h1>
        <p className="text-muted-foreground">
          登録ユーザーの一覧と管理を行います。
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium">ユーザー</th>
              <th className="p-3 text-left font-medium">メールアドレス</th>
              <th className="p-3 text-left font-medium">権限</th>
              <th className="p-3 text-left font-medium">登録日</th>
              <th className="p-3 text-left font-medium">最終更新</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {formattedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || ''}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                        <span className="text-xs">U</span>
                      </div>
                    )}
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-sm">{user.createdAtFormatted}</td>
                <td className="p-3 text-sm">{user.updatedAtFormatted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
