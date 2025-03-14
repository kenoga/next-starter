import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    APP_URL: z.string().url().min(1),
    GOOGLE_SITE_VERIFICATION_ID: z.string().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1),
    AUTH0_ISSUER: z.string().url(),
    SENDGRID_API_KEY: z.string().min(1),
    SENDGRID_FROM_EMAIL: z.string().email(),
    PORT: z.string().default('3055'),
    APP_NAME: z.string().min(1).default('Next Starter'),
    SKIP_EMAIL_SENDING: z.enum(['true', 'false']).optional().default('false'),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Next Starter'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    GOOGLE_SITE_VERIFICATION_ID: process.env.GOOGLE_SITE_VERIFICATION_ID,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    PORT: process.env.PORT,
    APP_NAME: process.env.APP_NAME || 'Next Starter',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Next Starter',
    SKIP_EMAIL_SENDING: process.env.SKIP_EMAIL_SENDING || 'false',
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});
