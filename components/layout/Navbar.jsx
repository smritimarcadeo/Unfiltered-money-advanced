'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Heart, TrendingUp } from 'lucide-react';
import { NAV } from '@/data/site';
import { useStore } from '@/lib/store';
import { cx } from '@/lib/format';
import CommandSearch from '@/components/search/CommandSearch';

export default function Navbar() {
  const { theme, toggleTheme, saved, hydrated } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cx(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-ink-900/80 backdrop-blur-xl border-b border-ink-200/70 dark:border-ink-700/70'
          : 'bg-transparent'
      )}
    >
      <nav className="container-page flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-lift group-hover:scale-105 transition">
            <TrendingUp size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight text-ink-900 dark:text-white">
            Unfiltered<span className="text-brand-600">Money</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5 min-w-0">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cx(
                  'px-2.5 xl:px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition',
                  active
                    ? 'text-brand-700 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-ink-600 dark:text-ink-300 hover:text-brand-600 hover:bg-ink-100/60 dark:hover:bg-ink-800'
                )}
              >
                {item.short || item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <CommandSearch />

          <Link
            href="/saved"
            aria-label="Saved products"
            className="relative grid place-items-center w-9 h-9 rounded-full text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition"
          >
            <Heart size={18} />
            {hydrated && saved.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-brand-600 rounded-full">
                {saved.length}
              </span>
            )}
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid place-items-center w-9 h-9 rounded-full text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/insurance/finder" className="hidden xl:inline-flex btn-primary text-sm px-4 py-2 ml-1">
            Find my match
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="lg:hidden grid place-items-center w-9 h-9 rounded-full text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
          <div className="container-page py-3 grid grid-cols-2 gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    'px-3 py-2.5 rounded-xl text-sm font-semibold',
                    active
                      ? 'text-brand-700 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-300'
                      : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/insurance/finder" className="btn-primary mt-2 justify-center col-span-2">
              Find my match
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
