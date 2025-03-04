import { redirect } from 'next/navigation';

import InvitationConfirmation from '@/components/invitation-confirmation';
import { validateInvitationToken } from '@/lib/invitations';

// Next.js App Routerのページコンポーネント
export default async function InvitePage({
  searchParams,
}: {
  searchParams: any;
}) {
  // トークンがなければホームページにリダイレクト
  if (!searchParams.token) {
    redirect('/');
  }

  // サーバーサイドで招待トークンを検証
  const validation = await validateInvitationToken(searchParams.token);

  return (
    <main className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-8">
      <InvitationConfirmation
        token={searchParams.token}
        initialValidation={validation}
      />
    </main>
  );
}
