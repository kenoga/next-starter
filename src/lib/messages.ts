import { env } from '@/env.mjs';

// Hard-coded messages to replace i18n functionality
export const messages = {
  app_name: env.NEXT_PUBLIC_APP_NAME,
  sign_in: 'Sign in',
  sign_out: 'Sign out',
  something_went_wrong: 'Something went wrong',
  try_again: 'Try again',
  hello_there: 'Hello there!',
  welcome_message: 'Welcome to the Next.js Starter Template',
  get_started: 'Get started',
  name: 'Name',
  profile: 'Profile',
  dashboard: 'Dashboard',
  settings: 'Settings',
  server_action_success: 'Server action succeeded!',
  server_action_error: 'Server action failed.',
  github: 'GitHub',
  nextjs_starter_template_headline: env.NEXT_PUBLIC_APP_NAME,
  nextjs_starter_template_description:
    'A starter template for Next.js with TypeScript, Tailwind CSS, and more.',
  input_placeholder: 'Enter your name',
  submit_form: 'Submit',
  meta_title: env.NEXT_PUBLIC_APP_NAME,
  meta_description:
    'A starter template for Next.js with TypeScript, Tailwind CSS, and more.',
  my_account: 'My Account',
  log_out: 'Log out',
};

// SEO Keywords
export const seoKeywords = [
  'Next.js',
  'React',
  env.NEXT_PUBLIC_APP_NAME,
  'Next.js Boilerplate',
  'Starter Template',
  'TailwindCSS',
  'TypeScript',
  'Shadcn UI',
  'NextAuth',
  'Prisma',
];
