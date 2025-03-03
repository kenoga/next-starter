import Link from 'next/link';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function InviteSuccessPage() {
  return (
    <main className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-8">
      <div className="flex w-full max-w-md flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
          <Icons.check className="size-8 text-green-600 dark:text-green-300" />
        </div>

        <h1 className="text-2xl font-bold">招待の受諾が完了しました</h1>

        <p className="text-muted-foreground">
          登録プロセスを完了するため、メールボックスをご確認ください。
          パスワード設定用のメールが送信されています。
        </p>

        <p className="text-muted-foreground text-sm">
          パスワードを設定すると、ログインしてサービスをご利用いただけます。
        </p>

        <Button asChild className="mt-4">
          <Link href="/">トップページに戻る</Link>
        </Button>
      </div>
    </main>
  );
}
