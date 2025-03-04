'use server';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';
import { TUser } from '@/types/user';

/**
 * 現在ログイン中のユーザー情報を取得するサーバーアクション
 */
export async function getCurrentUserAction(): Promise<
  TUser | { error: string; status: number }
> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: 'Authentication required', status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return user;
}
