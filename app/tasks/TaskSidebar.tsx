'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/tasks', label: 'Dashboard' },
  { href: '/tasks/create', label: 'Create new' },
  { href: '/tasks/pending', label: 'Pending' },
  { href: '/tasks/completed', label: 'Completed' },
];

export default function TaskSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-800 bg-slate-950 p-5 text-white lg:fixed lg:bottom-0 lg:left-0 lg:top-16 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="rounded-lg bg-white/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Workspace</p>
        <h2 className="mt-2 text-2xl font-semibold">My Tasks</h2>
      </div>

      <nav className="mt-6 grid gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
