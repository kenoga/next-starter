import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Icons } from '@/components/icons';
import { requireAdmin } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 管理者権限チェック
  const auth = await requireAdmin();

  // 管理者以外はアクセス不可
  if (!auth.isAllowed) {
    redirect('/');
  }

  const navLinks = [
    {
      href: '/admin/invitations',
      label: 'ユーザー招待',
      icon: <Icons.mail className="size-5" />,
    },
    {
      href: '/admin/users',
      label: 'ユーザー管理',
      icon: <Icons.users className="size-5" />,
    },
  ];

  return (
    <div className="bg-muted/5 mx-auto grid min-h-screen w-full grid-cols-1 md:grid-cols-[250px_1fr]">
      {/* 管理者サイドバー */}
      <aside className="bg-background border-r p-6">
        <div className="flex items-center gap-2 pb-6 pt-1">
          <span className="bg-primary text-primary-foreground rounded-md p-1">
            <Icons.user className="size-5" />
          </span>
          <h2 className="font-semibold">管理者パネル</h2>
        </div>

        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive =
              typeof window !== 'undefined' &&
              window.location.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <Link
            href="/"
            className="hover:bg-muted/50 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
          >
            <Icons.logOut className="size-4" />
            サイトへ戻る
          </Link>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <div>{children}</div>
    </div>
  );
}
