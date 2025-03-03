import { redirect } from 'next/navigation';

import InvitationConfirmation from '@/components/invitation-confirmation';

// Next.js App Routerのページコンポーネント（型のないバージョン）
export default function InvitePage(props: any) {
  const { searchParams = {} } = props;
  // トークンがなければホームページにリダイレクト
  if (!searchParams.token) {
    redirect('/');
  }

  return (
    <main className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-8">
      <InvitationConfirmation token={searchParams.token} />
    </main>
  );
}
