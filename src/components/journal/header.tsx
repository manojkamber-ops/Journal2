'use client';

import { useRef, useState } from 'react';
import { JournalLogo, IndexBadge } from './bits';
import { nav, Route } from '@/lib/journal-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Upload } from 'lucide-react';

const NAV_ITEMS = [
  { path: 'home', label: 'Home', href: '#/' },
  { path: 'articles', label: 'Articles', href: '#/articles' },
  { path: 'issues', label: 'Issues', href: '#/issues' },
  { path: 'editorial-board', label: 'Editorial Board', href: '#/editorial-board' },
  { path: 'for-authors', label: 'For Authors', href: '#/for-authors' },
  { path: 'about', label: 'About', href: '#/about' },
  { path: 'contact', label: 'Contact', href: '#/contact' },
];

export function Header({ route }: { route: Route }) {
  const [q, setQ] = useState('');
  // Mobile menu open state is derived from the route it was opened on:
  // navigating to a different route automatically closes it.
  const [menuRoute, setMenuRoute] = useState<string | null>(null);
  const menuOpen = menuRoute !== null && menuRoute === `${route.path}|${route.id ?? ''}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    nav(`#/articles${term ? `?q=${encodeURIComponent(term)}` : ''}`);
    setQ('');
    inputRef.current?.blur();
  };

  const isActive = (path: string) => {
    if (path === 'home') return route.path === 'home';
    if (path === 'articles') return route.path === 'articles' || route.path === 'article';
    if (path === 'issues') return route.path === 'issues' || route.path === 'issue';
    return route.path === path;
  };

  return (
    <header className="bg-paper">
      {/* Utility bar */}
      <div className="bg-inkbar text-zinc-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] sm:px-6">
          <p className="tracking-wide">An international peer-reviewed, open-access journal · Est. 2018</p>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono sm:inline">ISSN 2520-8438 · eISSN 2520-8446</span>
            <span className="inline-flex items-center gap-1.5 rounded bg-scopus/90 px-2 py-0.5 font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden /> Scopus Indexed
            </span>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#/" className="flex min-w-0 items-center gap-3" aria-label="Iran Journal of Computer Science — home">
            <JournalLogo size={52} />
            <div className="min-w-0">
              <h1 className="wordmark truncate text-lg font-bold leading-tight text-ink sm:text-2xl">
                Iran Journal of Computer Science
              </h1>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500 sm:text-xs">
                Indexed in: Scopus · Computer Science Applications · Continuous peer review
              </p>
            </div>
          </a>
          <div className="hidden shrink-0 flex-col items-end gap-2 lg:flex">
            <div className="flex items-center gap-2">
              <IndexBadge name="Scopus" />
              <IndexBadge name="ESCI" />
              <IndexBadge name="DOAJ" />
              <IndexBadge name="CC BY 4.0" />
            </div>
            <Button asChild size="sm" className="gap-1.5">
              <a href="#/for-authors"><Upload className="h-3.5 w-3.5" aria-hidden /> Submit manuscript</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-paper/95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur" aria-label="Main navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <ul className="hidden items-stretch lg:flex">
            {NAV_ITEMS.map(item => (
              <li key={item.path}>
                <a
                  href={item.href}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`relative flex h-11 items-center px-4 text-[13.5px] font-medium transition-colors hover:text-crimson ${isActive(item.path) ? 'text-crimson' : 'text-zinc-700'}`}
                >
                  {item.label}
                  <span className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full ${isActive(item.path) ? 'bg-crimson' : 'bg-transparent'}`} aria-hidden />
                </a>
              </li>
            ))}
          </ul>

          {/* Search */}
          <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2 py-2 lg:flex-none" role="search">
            <div className="relative flex-1 lg:w-72">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
              <Input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search articles, authors, keywords…"
                className="h-9 border-zinc-300 pl-8 text-sm"
                aria-label="Search the journal"
              />
            </div>
            <Button type="submit" size="sm" variant="outline" className="h-9 border-zinc-300">Search</Button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 lg:hidden"
              onClick={() => setMenuRoute(menuOpen ? null : `${route.path}|${route.id ?? ''}`)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <ul className="border-t border-zinc-200 bg-paper px-4 py-2 lg:hidden">
            {NAV_ITEMS.map(item => (
              <li key={item.path}>
                <a
                  href={item.href}
                  className={`block border-b border-zinc-100 py-2.5 text-sm font-medium ${isActive(item.path) ? 'text-crimson' : 'text-zinc-700'}`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="py-2.5">
              <a href="#/for-authors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
                <Upload className="h-3.5 w-3.5" aria-hidden /> Submit manuscript
              </a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
