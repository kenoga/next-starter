import { randomBytes } from 'crypto';
import { addDays, isPast } from 'date-fns';

import { env } from '@/env.mjs';
import { createAuth0User, userExistsByEmail } from '@/lib/auth0';
import { sendInvitationEmail } from '@/lib/mail';
import prisma from '@/lib/prisma';

/**
 * 招待用のセキュアなトークンを生成する
 */
export function generateInvitationToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * 指定されたメールアドレスへの招待を作成して送信する
 */
export async function createInvitation(
  email: string,
  role: string,
  invitedBy: string
): Promise<void> {
  // メールアドレスの重複チェック
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('このメールアドレスは既に登録されているユーザーです');
  }

  // Auth0側でのユーザー存在チェック
  const existsInAuth0 = await userExistsByEmail(email);
  if (existsInAuth0) {
    throw new Error('このメールアドレスは既に認証システムに登録されています');
  }

  // 既存の招待がないかチェック
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email,
      used: false, // 未使用の招待のみ
      expires: {
        gt: new Date(), // 期限が切れていない招待のみ
      },
    },
  });

  if (existingInvitation) {
    throw new Error('このメールアドレスへの有効な招待が既に存在します');
  }

  // 新しい招待を作成
  const token = generateInvitationToken();
  const expiresAt = addDays(new Date(), 2); // 48時間有効

  await prisma.invitation.create({
    data: {
      email,
      token,
      role,
      invitedBy,
      expires: expiresAt,
    },
  });

  // 招待URLの生成
  const inviteUrl = `${env.APP_URL}/invite?token=${token}`;

  // 招待メールの送信
  await sendInvitationEmail(email, inviteUrl, role);
}

/**
 * 招待トークンの有効性を検証する
 */
export async function validateInvitationToken(token: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    return { valid: false, message: 'Invalid invitation token' };
  }

  if (invitation.used) {
    return { valid: false, message: 'Invitation has already been used' };
  }

  if (isPast(invitation.expires)) {
    return { valid: false, message: 'Invitation has expired' };
  }

  return {
    valid: true,
    invitation,
  };
}

/**
 * 招待を受け入れてAuth0ユーザーを作成する
 */
export async function acceptInvitation(
  token: string
): Promise<{ success: boolean; message: string }> {
  const validation = await validateInvitationToken(token);

  if (!validation.valid) {
    return {
      success: false,
      message:
        typeof validation.message === 'string'
          ? validation.message
          : 'Invalid invitation',
    };
  }

  // validationがtrueなら必ずinvitationが存在する
  const invitation = validation.invitation!;

  try {
    // Auth0ユーザーの作成
    await createAuth0User(invitation.email, invitation.role);

    // トランザクションでローカルデータベースの操作を実行
    // これにより、すべての操作が成功するか、すべての操作が失敗するかのどちらかになる
    await prisma.$transaction(async (tx) => {
      // ローカルデータベースにユーザーを作成
      await tx.user.create({
        data: {
          name: invitation.email.split('@')[0], // 仮の表示名（メールアドレスの@前の部分）
          email: invitation.email,
          emailVerified: new Date(), // メール検証済みとしてマーク
          role: invitation.role,
        },
      });

      // 招待を使用済みとしてマーク
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { used: true },
      });
    });

    return {
      success: true,
      message:
        'Invitation accepted successfully. Please check your email to set your password.',
    };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {
      success: false,
      message: 'An error occurred while accepting the invitation.',
    };
  }
}

/**
 * 管理者が招待を取り消す
 */
export async function cancelInvitation(invitationId: string): Promise<void> {
  await prisma.invitation.delete({
    where: { id: invitationId },
  });
}
