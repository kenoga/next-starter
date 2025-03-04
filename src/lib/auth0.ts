import { randomBytes } from 'crypto';

import { env } from '@/env.mjs';

/**
 * セキュアなランダムパスワードを生成する
 * Auth0のパスワード要件を満たす必要がある（通常は8文字以上で英数字記号を含む）
 */
function generateRandomPassword(): string {
  // 16文字のランダムな文字列を生成
  const randomString = randomBytes(12).toString('base64');
  // Auth0のパスワード要件を満たすように、大文字、小文字、数字、記号を追加
  return `A1$${randomString}`;
}

interface Auth0Token {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
  picture?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

interface PasswordChangeTicket {
  ticket: string;
}

let cachedToken: Auth0Token | null = null;
let tokenExpiresAt: number = 0;

/**
 * Auth0 Management APIのアクセストークンを取得する
 */
async function getManagementToken(): Promise<string> {
  // キャッシュされたトークンがあり、有効期限内なら再利用
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now) {
    return cachedToken.access_token;
  }

  const tokenUrl = `https://${env.AUTH0_ISSUER.replace('https://', '')}/oauth/token`;
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: env.AUTH0_CLIENT_ID,
      client_secret: env.AUTH0_CLIENT_SECRET,
      audience: `https://${env.AUTH0_ISSUER.replace('https://', '')}/api/v2/`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Auth0 management token');
  }

  const data = (await response.json()) as Auth0Token;
  cachedToken = data;
  // 有効期限の95%の時間でキャッシュ期限を設定（余裕を持たせる）
  tokenExpiresAt = now + data.expires_in * 0.95 * 1000;
  return data.access_token;
}

/**
 * Auth0ユーザーを作成する
 */
export async function createAuth0User(
  email: string,
  role: string
): Promise<Auth0User> {
  const token = await getManagementToken();
  const domain = env.AUTH0_ISSUER.replace('https://', '');

  const response = await fetch(`https://${domain}/api/v2/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      // ランダムパスワードを生成（実際にはユーザーが後でリセットする）
      password: generateRandomPassword(),
      connection: 'Username-Password-Authentication',
      email_verified: true,
      app_metadata: {
        roles: [role],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create Auth0 user: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * 指定したメールアドレスのユーザーが存在するか確認する
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  const token = await getManagementToken();
  const domain = env.AUTH0_ISSUER.replace('https://', '');

  const response = await fetch(
    `https://${domain}/api/v2/users-by-email?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check user existence');
  }

  const users = await response.json();
  return Array.isArray(users) && users.length > 0;
}

/**
 * Auth0ユーザーにロールを割り当てる（ロールが事前にAuth0で作成されている必要あり）
 */
export async function assignRoleToUser(
  userId: string,
  roleName: string
): Promise<void> {
  // 実際の実装では、Auth0のロールIDを取得し、ユーザーに割り当てる処理が必要
  // このサンプルではapp_metadataを使用する簡易版
  const token = await getManagementToken();
  const domain = env.AUTH0_ISSUER.replace('https://', '');

  const response = await fetch(`https://${domain}/api/v2/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      app_metadata: {
        roles: [roleName],
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign role to user');
  }
}

/**
 * パスワード変更用のチケットを生成する
 * @param userId Auth0のユーザーID
 * @param resultUrl パスワード変更後のリダイレクト先URL（未指定時はログインページ）
 * @returns パスワード変更用のチケットURL
 */
export async function generatePasswordChangeTicket(
  userId: string,
  resultUrl?: string
): Promise<string> {
  const token = await getManagementToken();
  const domain = env.AUTH0_ISSUER.replace('https://', '');

  // デフォルトはログインページへリダイレクト
  const defaultResultUrl = `${env.APP_URL}/`;
  const payload: Record<string, string | number | boolean> = {
    user_id: userId,
    ttl_sec: 86400, // 24時間有効
    result_url: resultUrl || defaultResultUrl,
    includeEmailInRedirect: true,
  };

  const response = await fetch(
    `https://${domain}/api/v2/tickets/password-change`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to generate password change ticket: ${JSON.stringify(error)}`
    );
  }

  const data = (await response.json()) as PasswordChangeTicket;
  return data.ticket;
}
