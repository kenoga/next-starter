import { env } from '@/env.mjs';
import { messages, seoKeywords } from '@/lib/messages';

export const siteConfig = {
  title: () => messages.meta_title,
  description: () => messages.meta_description,
  keywords: () => seoKeywords,
  url: () => env.APP_URL,
  googleSiteVerificationId: () => env.GOOGLE_SITE_VERIFICATION_ID || '',
};
