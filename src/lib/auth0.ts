import { env } from '@/env.mjs';

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
