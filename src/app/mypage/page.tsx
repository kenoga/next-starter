import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
              <div className="flex items-center gap-2">
                <p className="capitalize">{user.role || 'ユーザー'}</p>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    管理者
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                登録日
              </p>
              <p>{format(user.createdAt, 'yyyy年MM月dd日')}</p>
            </div>
          </CardContent>
          {user.role === 'admin' && (
            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2"
                >
                  <Icons.users className="size-4" />
                  管理者パネルへ
                </Link>
              </Button>
            </CardFooter>
          )}
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
