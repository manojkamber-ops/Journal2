'use client';

import { useEffect, useState, useCallback } from 'react';

// ── Tiny fetch hook (lint-safe: setState only in async callbacks) ───────────
type FetchState<T> = {
  key: string;
  pending: boolean;
  data: T | null;
  error: string | null;
};

export function useFetch<T>(url: string | null): {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
} {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<FetchState<T>>({ key: '', pending: false, data: null, error: null });

  const currentKey = `${url ?? ''}|${tick}`;
  const loading = !!url && (state.pending || state.key !== currentKey);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    fetch(url)
      .then(async r => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then(d => {
        if (alive) setState({ key: currentKey, pending: false, data: d as T, error: null });
      })
      .catch(e => {
        if (alive) setState({ key: currentKey, pending: false, data: null, error: e.message || 'Failed to load' });
      });
    return () => { alive = false; };
  }, [url, tick, currentKey]);

  const reload = useCallback(() => setTick(t => t + 1), []);
  return { data: state.data, loading, error: state.error, reload };
}

// ── Hash router ──────────────────────────────────────────────────────────────
export interface Route {
  path: string;
  id: string | null;
  params: URLSearchParams;
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const segs = pathPart.split('/').filter(Boolean);
  return {
    path: segs[0] || 'home',
    id: segs[1] || null,
    params: new URLSearchParams(queryPart || ''),
  };
}

export function nav(to: string) {
  window.location.hash = to.startsWith('#') ? to.slice(1) : to;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(typeof window !== 'undefined' ? window.location.hash : ''));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

// ── Formatting helpers ───────────────────────────────────────────────────────
export function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}
