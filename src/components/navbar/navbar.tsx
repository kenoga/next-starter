import Link from 'next/link';

import { auth } from '@/app/api/auth/[...nextauth]/auth-options';
import { SignInButton } from '@/components/navbar/sign-in-button';
import { UserDropdown } from '@/components/navbar/user-dropdown';
import { messages } from '@/lib/messages';

export const Navbar = async () => {
  const session = await auth();

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-lg font-bold">
          {messages.app_name}
        </Link>
        <div className="flex items-center gap-2">
          {session ? <UserDropdown session={session} /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
};
