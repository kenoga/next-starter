'use client';

import { useState } from 'react';

import { sendPasswordSetupForUser } from '@/actions/send-password-setup';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PasswordSetupButtonProps {
  userId: string;
}

export default function PasswordSetupButton({
  userId,
}: PasswordSetupButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const result = await sendPasswordSetupForUser(userId);

      toast({
        title: result.success ? '成功' : 'エラー',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toast({
        title: 'エラー',
        description: 'パスワード設定メールの送信に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? 'メール送信中...' : 'パスワード設定メール再送信'}
    </Button>
  );
}
