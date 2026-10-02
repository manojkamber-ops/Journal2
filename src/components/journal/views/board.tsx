'use client';

import { useFetch } from '@/lib/journal-client';
import { ErrorBox, BlockSkeleton } from '../bits';

interface Member {
  id: string; name: string; role: string; affiliation: string; country: string;
  field: string; email: string; orcid: string; order: number;
}

function initials(name: string): string {
  const clean = name.replace(/^Professor\s+|Prof\.\s+/i, '');
  const parts = clean.split(' ');
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

function avatarColor(i: number): string {
  const palette = ['bg-crimson-light text-crimson', 'bg-scopus-light text-scopus', 'bg-emerald-50 text-emerald-700', 'bg-amber-50 text-amber-700', 'bg-violet-50 text-violet-700', 'bg-rose-50 text-rose-700'];
  return palette[i % palette.length];
}

function MemberCard({ m, i, large }: { m: Member; i: number; large?: boolean }) {
  return (
    <div className={`flex gap-4 rounded-lg border border-zinc-200 bg-white p-4 ${large ? 'sm:p-6' : ''}`}>
      <div className={`flex shrink-0 items-center justify-center rounded-full font-bold ${avatarColor(i)} ${large ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-sm'}`}>
        {initials(m.name)}
      </div>
      <div className="min-w-0">
        <h3 className={`font-bold leading-snug text-ink ${large ? 'text-lg' : 'text-[15px]'}`}>{m.name}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{m.affiliation}</p>
        <p className="mt-1.5 text-[12px] font-medium text-crimson">{m.field}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400">
          <span>{m.country}</span>
          <a href={`mailto:${m.email}`} className="hover:text-crimson hover:underline">{m.email}</a>
          <span className="font-mono">ORCID {m.orcid}</span>
        </div>
      </div>
    </div>
  );
}

export function BoardView() {
  const { data, loading, error, reload } = useFetch<Record<string, Member[]>>('/api/board');

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><BlockSkeleton h={500} /></div>;
  if (error || !data) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><ErrorBox message={error ?? 'Failed to load board'} onRetry={reload} /></div>;

  const eic = data['Editor-in-Chief'] ?? [];
  const deputy = data['Deputy Editor'] ?? [];
  const assoc = data['Associate Editor'] ?? [];
  const board = data['Editorial Board'] ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="border-b-2 border-crimson pb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-crimson">People</p>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">Editorial Board</h1>
        <p className="mt-1 max-w-3xl text-sm text-zinc-500">
          The journal is led by an international team of senior researchers. Board members are appointed
          for three-year terms based on scholarly contribution and subject-area expertise.
        </p>
      </header>

      {/* Editor-in-Chief */}
      <section className="mt-8" aria-labelledby="eic-h">
        <h2 id="eic-h" className="text-lg font-bold text-ink">Editor-in-Chief</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {eic.map((m, i) => <MemberCard key={m.id} m={m} i={i} large />)}
        </div>
      </section>

      {/* Deputy */}
      {deputy.length > 0 && (
        <section className="mt-10" aria-labelledby="deputy-h">
          <h2 id="deputy-h" className="text-lg font-bold text-ink">Deputy Editor</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {deputy.map((m, i) => <MemberCard key={m.id} m={m} i={i + 1} large />)}
          </div>
        </section>
      )}

      {/* Associate editors */}
      <section className="mt-10" aria-labelledby="assoc-h">
        <div className="flex items-baseline justify-between">
          <h2 id="assoc-h" className="text-lg font-bold text-ink">Associate Editors</h2>
          <span className="text-xs text-zinc-400">{assoc.length} members</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assoc.map((m, i) => <MemberCard key={m.id} m={m} i={i} />)}
        </div>
      </section>

      {/* Editorial board */}
      <section className="mt-10" aria-labelledby="board-h">
        <div className="flex items-baseline justify-between">
          <h2 id="board-h" className="text-lg font-bold text-ink">Editorial Board Members</h2>
          <span className="text-xs text-zinc-400">{board.length} members · {new Set(board.map(b => b.country)).size} countries</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {board.map((m, i) => <MemberCard key={m.id} m={m} i={i + 2} />)}
        </div>
      </section>

      <p className="mt-10 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-[13px] leading-relaxed text-zinc-600">
        <strong className="text-ink">Editorial policies.</strong> IJCS follows the Committee on Publication Ethics (COPE)
        guidelines. Board members handling a manuscript from their own institution are recused from the
        editorial decision. To express interest in serving on the board, contact the Editor-in-Chief
        at <a className="text-crimson hover:underline" href="mailto:d.farhoudi@ijcs.ir">d.farhoudi@ijcs.ir</a>.
      </p>
    </div>
  );
}
