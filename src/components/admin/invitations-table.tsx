'use client';

import { useState } from 'react';

import { Icons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

interface Invitation {
  id: string;
  email: string;
  role: string;
  expires: Date;
  used: boolean;
  createdAt: Date;
  expiresFormatted: string;
  createdAtFormatted: string;
  inviterName: string;
  inviterEmail: string;
}

interface InvitationsTableProps {
  invitations: Invitation[];
}

export function InvitationsTable({ invitations }: InvitationsTableProps) {
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 招待の削除
  const handleDeleteInvitation = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/invitations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: '招待を削除しました',
          description: '招待が正常に削除されました',
        });
        // 画面リフレッシュ（理想的にはSWRやReact Queryなどでキャッシュ更新）
        window.location.reload();
      } else {
        const error = await response.json();
        throw new Error(error.error || '削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        variant: 'destructive',
        title: '削除に失敗しました',
        description:
          error instanceof Error ? error.message : '不明なエラーが発生しました',
      });
    } finally {
      setIsDeleting(false);
      setPendingDeletion(null);
    }
  };

  // 招待状態に基づくバッジの表示
  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.used) {
      return <Badge variant="outline">使用済み</Badge>;
    }

    const now = new Date();
    if (new Date(invitation.expires) < now) {
      return <Badge variant="destructive">期限切れ</Badge>;
    }

    return <Badge>有効</Badge>;
  };

  if (invitations.length === 0) {
    return (
      <div className="bg-muted/20 rounded-lg border p-8 text-center">
        <Icons.mailX className="text-muted-foreground mx-auto mb-4 size-8" />
        <h3 className="text-lg font-medium">招待はありません</h3>
        <p className="text-muted-foreground mt-2">
          新しいユーザーを招待するには左のフォームを使用してください
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>メールアドレス</TableHead>
            <TableHead>ロール</TableHead>
            <TableHead>状態</TableHead>
            <TableHead>招待日</TableHead>
            <TableHead>期限</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell className="font-medium">{invitation.email}</TableCell>
              <TableCell className="capitalize">{invitation.role}</TableCell>
              <TableCell>{getStatusBadge(invitation)}</TableCell>
              <TableCell>{invitation.createdAtFormatted}</TableCell>
              <TableCell>{invitation.expiresFormatted}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      disabled={invitation.used}
                      onClick={() => setPendingDeletion(invitation.id)}
                    >
                      <Icons.trash className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>招待の削除</AlertDialogTitle>
                      <AlertDialogDescription>
                        「{invitation.email}」への招待を削除しますか？
                        この操作は取り消せません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setPendingDeletion(null)}
                      >
                        キャンセル
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteInvitation(invitation.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting && pendingDeletion === invitation.id && (
                          <Icons.spinner className="mr-2 size-4 animate-spin" />
                        )}
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
