import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import Auth0Provider from 'next-auth/providers/auth0';

import { env } from '@/env.mjs';
import prisma from '@/lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (!session.user) return session;

      session.user.id = user.id;

      return session;
    },
  },
});
