import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import prisma from '@/lib/prisma';

/**
 * ユーザーが特定のロールを持っているか確認する
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return user?.role === role;
}

/**
 * 認証済みユーザーのみアクセスを許可するミドルウェア
 */
export async function withAuth(
  request: NextRequest,
  callback: () => Promise<NextResponse>
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return callback();
}

/**
 * 特定のロールを持つユーザーのみアクセスを許可するミドルウェア
 */
export async function withRole(
  request: NextRequest,
  role: string,
  callback: () => Promise<NextResponse>
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== role) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return callback();
}

/**
 * 管理者のみアクセスを許可するミドルウェア
 */
export async function withAdmin(
  request: NextRequest,
  callback: () => Promise<NextResponse>
) {
  return withRole(request, 'admin', callback);
}

/**
 * ユーザーが管理者かどうか確認する
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * 管理者ページのアクセス制御を行うラッパー関数
 * 管理者でない場合はホームページにリダイレクト
 */
export async function requireAdmin(): Promise<{
  isAllowed: boolean;
  userId?: string;
}> {
  const session = await auth();

  // 未認証の場合
  if (!session?.user) {
    return { isAllowed: false };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  // 管理者権限がない場合
  if (!user || user.role !== 'admin') {
    return { isAllowed: false };
  }

  // 管理者の場合
  return { isAllowed: true, userId: user.id };
}
