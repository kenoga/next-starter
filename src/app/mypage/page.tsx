import { format } from 'date-fns';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { messages } from '@/lib/messages';
import prisma from '@/lib/prisma';

export default async function MyPage() {
  const session = await auth();

  // リダイレクト: 未認証ユーザーはホームページへ
  if (!session?.user) {
    redirect('/');
  }

  // ユーザーの詳細情報をデータベースから取得
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect('/');
  }

  return (
    <main className="container flex flex-col items-center py-8">
      <div className="mb-8 flex flex-col items-center space-y-4">
        {user.image ? (
          <div className="relative size-32 overflow-hidden rounded-full">
            <Image
              src={user.image}
              alt={user.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-muted flex size-32 items-center justify-center rounded-full">
            <Icons.user className="text-muted-foreground size-16" />
          </div>
        )}
        <h1 className="text-center text-3xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{messages.welcome_message}</p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        {/* プロフィール情報 */}
        <Card>
          <CardHeader>
            <CardTitle>{messages.profile}</CardTitle>
            <CardDescription>あなたの基本プロフィール情報</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                メールアドレス
              </p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                ロール
              </p>
              <p className="capitalize">{user.role || 'ユーザー'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                登録日
              </p>
              <p>{format(user.createdAt, 'yyyy年MM月dd日')}</p>
            </div>
          </CardContent>
        </Card>

        {/* アカウント設定 */}
        <Card>
          <CardHeader>
            <CardTitle>{messages.settings}</CardTitle>
            <CardDescription>アカウント設定と管理</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                認証プロバイダー
              </p>
              <p>Auth0</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                最終更新日
              </p>
              <p>{format(user.updatedAt, 'yyyy年MM月dd日')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
