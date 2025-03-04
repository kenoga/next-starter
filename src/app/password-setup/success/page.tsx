import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PasswordSetupSuccessPage() {
  return (
    <div className="container flex min-h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">パスワード設定完了</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            パスワードの設定が完了しました。ログイン画面からログインしてください。
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ログイン画面へ
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
