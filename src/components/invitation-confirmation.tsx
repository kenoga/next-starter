'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface InvitationData {
  valid: boolean;
  email?: string;
  role?: string;
  message?: string;
}

export default function InvitationConfirmation({ token }: { token: string }) {
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 招待トークンの検証
  useEffect(() => {
    async function verifyInvitation() {
      try {
        const response = await fetch(`/api/invitations/verify?token=${token}`);
        const data = await response.json();
        setInvitation(data);
      } catch (err) {
        setError('招待情報の取得中にエラーが発生しました。');
        console.error('Error verifying invitation:', err);
      } finally {
        setIsLoading(false);
      }
    }

    verifyInvitation();
  }, [token]);

  // 招待の受諾
  const handleAcceptInvitation = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/invite/success');
      } else {
        setError(data.message || '招待の受諾中にエラーが発生しました。');
      }
    } catch (err) {
      setError('招待の受諾中にエラーが発生しました。');
      console.error('Error accepting invitation:', err);
    } finally {
      setIsAccepting(false);
    }
  };

  // ローディング中
  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>招待を確認中...</CardTitle>
          <CardDescription>情報を読み込んでいます</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Icons.spinner className="size-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // エラーの場合
  if (error || !invitation || !invitation.valid) {
    const errorMessage = error || invitation?.message || '招待が無効です。';

    return (
      <Card className="border-destructive w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive">招待エラー</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Icons.close className="text-destructive size-8" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => router.push('/')}>
            トップページに戻る
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // 有効な招待の表示
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>招待の確認</CardTitle>
        <CardDescription>以下の情報をご確認ください</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            メールアドレス
          </p>
          <p className="font-medium">{invitation.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm font-medium">権限</p>
          <p className="font-medium capitalize">{invitation.role}</p>
        </div>
        <div className="text-muted-foreground pt-4 text-sm">
          <p>
            この招待を受け入れると、Next Starterのアカウントが作成されます。
            パスワード設定用のメールが送信されますので、メールボックスをご確認ください。
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full"
          onClick={handleAcceptInvitation}
          disabled={isAccepting}
        >
          {isAccepting && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          招待を受け入れる
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/')}
          disabled={isAccepting}
        >
          キャンセル
        </Button>
      </CardFooter>
    </Card>
  );
}
