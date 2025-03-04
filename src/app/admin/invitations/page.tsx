'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { InvitationsTable } from '@/components/admin/invitations-table';
import { InviteUserForm } from '@/components/admin/invite-user-form';

interface Invitation {
  id: string;
  email: string;
  role: string;
  expires: Date;
  used: boolean;
  createdAt: Date;
  invitedBy: string;
  expiresFormatted: string;
  createdAtFormatted: string;
  inviterName: string;
  inviterEmail: string;
  inviteUrl: string; // 招待リンクを追加
}

export default function AdminInvitationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // 招待リストを取得する関数 - Server Actionを使用
  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const { getInvitationsAction } = await import(
        '@/actions/admin/invitations/list'
      );
      const result = await getInvitationsAction();

      if ('error' in result) {
        if (result.status === 401 || result.status === 403) {
          setIsAuthorized(false);
          return;
        }
        throw new Error('招待リストの取得に失敗しました');
      }

      // 日付のフォーマットと招待者の情報を追加
      const formattedInvitations = result.map((invitation) => ({
        ...invitation,
        expires: new Date(invitation.expires),
        createdAt: new Date(invitation.createdAt),
        expiresFormatted: format(
          new Date(invitation.expires),
          'yyyy年MM月dd日 HH:mm'
        ),
        createdAtFormatted: format(
          new Date(invitation.createdAt),
          'yyyy年MM月dd日 HH:mm'
        ),
        inviterName: invitation.inviterName || '',
        inviterEmail: invitation.inviterEmail || '',
      }));

      setInvitations(formattedInvitations);
      setIsAuthorized(true);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 招待追加後のコールバック
  const handleInvitationCreated = () => {
    fetchInvitations();
  };

  // 招待削除後のコールバック
  const handleInvitationDeleted = (deletedId: string) => {
    setInvitations((currentInvitations) =>
      currentInvitations.filter((inv) => inv.id !== deletedId)
    );
  };

  // コンポーネント初期化時に招待リストを取得
  useEffect(() => {
    fetchInvitations();
  }, []);

  // 権限がない場合はホームにリダイレクト
  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      redirect('/');
    }
  }, [isLoading, isAuthorized]);

  // ローディング中
  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="border-primary size-8 animate-spin rounded-full border-y-2"></div>
            </div>
            <p>データを読み込んでいます...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">ユーザー招待管理</h1>
        <p className="text-muted-foreground">
          新しいユーザーを招待したり、既存の招待を管理します。
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <InviteUserForm onInvitationCreated={handleInvitationCreated} />
        </div>

        <div className="md:col-span-2">
          <InvitationsTable
            invitations={invitations}
            onInvitationDeleted={handleInvitationDeleted}
          />
        </div>
      </div>
    </main>
  );
}
