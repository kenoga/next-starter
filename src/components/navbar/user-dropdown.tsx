'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { messages } from '@/lib/messages';

export const UserDropdown = ({ session: { user } }: { session: Session }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  // ユーザーの管理者権限を確認 - Server Actionを使用
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { getCurrentUserAction } = await import('@/actions/users/me');
        const userData = await getCurrentUserAction();

        if (!('error' in userData)) {
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          className="overflow-hidden rounded-full"
          src={`${user?.image}`}
          alt={`${user?.name}`}
          width={32}
          height={32}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center justify-center p-2">
          <Image
            className="overflow-hidden rounded-full"
            src={`${user?.image}`}
            alt={`${user?.name}`}
            width={100}
            height={100}
          />
          <h2 className="py-2 text-lg font-bold">{user?.name}</h2>
          {isAdmin && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              管理者
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/mypage">
            <Icons.user className="mr-2 size-4" />
            <span>{messages.profile}</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>管理者メニュー</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin/invitations">
                <Icons.mail className="mr-2 size-4" />
                <span>ユーザー招待管理</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/users">
                <Icons.users className="mr-2 size-4" />
                <span>ユーザー管理</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <Icons.logOut className="mr-2 size-4" />
          <span>{messages.sign_out}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
