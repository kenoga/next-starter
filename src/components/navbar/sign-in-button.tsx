'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { messages } from '@/lib/messages';

export const SignInButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    startTransition(async () => {
      await signIn('auth0');
    });
  };

  return (
    <Button onClick={handleSignIn} disabled={isPending}>
      {isPending && <Icons.loader className="mr-2 size-4 animate-spin" />}
      {messages.sign_in}
    </Button>
  );
};
