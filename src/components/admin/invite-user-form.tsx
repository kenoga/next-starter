'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// フォームのバリデーションスキーマ
const inviteUserSchema = z.object({
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください' }),
  role: z.string().min(1, { message: 'ロールを選択してください' }),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

interface InviteUserFormProps {
  onInvitationCreated?: () => void;
}

export function InviteUserForm({ onInvitationCreated }: InviteUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム定義
  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: 'user',
    },
  });

  // フォーム送信処理
  async function onSubmit(data: InviteUserFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: '招待メールを送信しました',
          description: `${data.email}宛に招待メールを送信しました`,
        });
        form.reset();

        // 招待作成後にコールバックを呼び出す
        if (onInvitationCreated) {
          onInvitationCreated();
        }
      } else {
        // エラーメッセージをユーザーフレンドリーに整形
        const errorMessage = result.error || '不明なエラーが発生しました';

        // 既存ユーザーエラーの場合は特別な表示
        if (
          errorMessage.includes('既に登録されているユーザー') ||
          errorMessage.includes('既に認証システムに登録されています') ||
          errorMessage.includes('有効な招待が既に存在します')
        ) {
          toast({
            variant: 'destructive',
            title: '招待できないユーザー',
            description: errorMessage,
          });
        } else {
          toast({
            variant: 'destructive',
            title: '招待の送信に失敗しました',
            description: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        variant: 'destructive',
        title: '招待の送信に失敗しました',
        description: 'サーバーとの通信中にエラーが発生しました',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>新規ユーザー招待</CardTitle>
        <CardDescription>新しいユーザーをサービスに招待します</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@example.com"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ロール</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="ロールを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">一般ユーザー</SelectItem>
                      <SelectItem value="admin">管理者</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              招待メールを送信
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
