'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/tasks', label: 'Dashboard' },
  { href: '/tasks/create', label: 'Create new' },
  { href: '/tasks/pending', label: 'Pending' },
  { href: '/tasks/completed', label: 'Completed' },
];

export default function TaskSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <span className="text-sm font-semibold text-slate-950">Task menu</span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Menu
        </button>
      </div>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close task menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-50 w-72 border-r border-slate-800 bg-slate-950 p-5 text-white transition-transform lg:w-64 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-4 rounded-lg bg-white/10 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Workspace</p>
            <h2 className="mt-2 text-2xl font-semibold">My Tasks</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md px-2 py-1 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          >
            Close
          </button>
        </div>

        <nav className="mt-6 grid gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
    </>
  );
}
