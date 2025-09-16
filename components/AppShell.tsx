'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Settings,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Upload & paste',
    href: '/dashboard/upload',
    icon: Upload,
    disabled: true,
  },
  {
    label: 'Editor workspace',
    href: '/editor',
    icon: FileText,
  },
  {
    label: 'Batch jobs',
    href: '/dashboard/batch',
    icon: ClipboardCheck,
    disabled: true,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    disabled: true,
  },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#040404] text-white">
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#060606]/90 backdrop-blur-xl lg:flex">
        <div className="flex items-center justify-between px-6 pb-6 pt-8">
          <Link href="/dashboard" className="text-base font-semibold leading-tight">
            FactCheck
            <br />
            <span className="text-xs font-normal uppercase tracking-[0.4em] text-neutral-500">
              Control center
            </span>
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Beta
          </span>
        </div>
        <div className="px-6 pb-4">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-neutral-300">
            <p className="text-sm font-semibold text-white">Need help?</p>
            <p className="mt-2 text-xs text-neutral-400">
              Upload a draft or explore the editor to see live fact-checking in action.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
            >
              Quick start <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return item.disabled ? (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-white/5 bg-transparent px-4 py-3 text-sm text-neutral-600"
              >
                <Icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-700">Soon</span>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition',
                  isActive
                    ? 'border-white/20 bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.35)]'
                    : 'border-transparent text-neutral-300 hover:border-white/20 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-black' : 'text-neutral-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-6 py-6 text-xs text-neutral-500">
          <p className="font-semibold text-neutral-300">Workspace</p>
          <p className="mt-2 leading-relaxed">
            Logged in as <span className="text-white">ops@factcheck.ai</span>
          </p>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#040404]/80 px-4 py-4 backdrop-blur lg:hidden">
          <Link href="/dashboard" className="text-sm font-semibold text-white">
            FactCheck AI
          </Link>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Menu
          </span>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
