'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animations } from '@/lib/animations';

/**
 * Persistent navigation available on every demo page: a small "Index" pill
 * (bottom-left) that opens a full-screen list of every animation, so you can
 * jump straight to any other demo or back home. Hidden on the landing page,
 * which is already the hub.
 */
const SiteMenu = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close whenever the route changes (e.g. after picking a destination).
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (pathname === '/') return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open index"
        className="fixed bottom-6 left-6 z-[9998] inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white shadow-lg transition hover:bg-neutral-700"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        Index
      </button>

      <div
        className={`fixed inset-0 z-[10001] bg-[#edede7] text-neutral-900 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site index"
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col px-6 py-10 md:px-10 md:py-14">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              Index
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close index"
              className="rounded-md p-1.5 text-neutral-500 transition hover:bg-black/5 hover:text-neutral-900"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center">
            <ul>
              {animations.map((a, i) => {
                const active = pathname === `/${a.slug}`;
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/${a.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-2 md:gap-6"
                    >
                      <span
                        className={`font-mono text-xs ${
                          active ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-['PP_Neue_Montreal'] text-4xl font-medium tracking-[-0.02em] transition-colors md:text-6xl ${
                          active
                            ? 'text-neutral-900'
                            : 'text-neutral-400 group-hover:text-neutral-900'
                        }`}
                      >
                        {a.title}
                      </span>
                      {active && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                          Current
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group font-mono text-[11px] uppercase tracking-[0.2em]"
          >
            <span className="text-neutral-500 transition-colors group-hover:text-neutral-900">
              ← Home
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SiteMenu;
