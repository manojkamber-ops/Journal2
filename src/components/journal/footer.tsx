'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JournalLogo, OaBadge } from './bits';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail } from 'lucide-react';

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!r.ok) throw new Error();
      toast({ title: 'Subscribed', description: 'You will now receive table-of-contents alerts.' });
      setEmail('');
    } catch {
      toast({ title: 'Subscription failed', description: 'Please enter a valid email address.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="mt-auto bg-inkbar text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <JournalLogo size={40} />
            <div>
              <p className="wordmark text-base font-bold leading-tight text-white">Iran Journal of<br />Computer Science</p>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-zinc-400">
            A quarterly, fully open-access journal covering all areas of computer science.
            Indexed in: Scopus (2018–2026), Web of Science (ESCI) and DOAJ.
          </p>
          <p className="mt-3 font-mono text-xs text-zinc-500">ISSN 2520-8438 · eISSN 2520-8446</p>
        </div>

        {/* Browse */}
        <nav aria-label="Browse">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Browse</h3>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li><a className="hover:text-white hover:underline" href="#/articles">Latest articles</a></li>
            <li><a className="hover:text-white hover:underline" href="#/articles?sort=cited">Most cited articles</a></li>
            <li><a className="hover:text-white hover:underline" href="#/issues">Archive of issues</a></li>
            <li><a className="hover:text-white hover:underline" href="#/articles?sort=downloaded">Most downloaded</a></li>
            <li><a className="hover:text-white hover:underline" href="#/editorial-board">Editorial board</a></li>
          </ul>
        </nav>

        {/* Resources */}
        <nav aria-label="Resources">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li><a className="hover:text-white hover:underline" href="#/for-authors">Submission guidelines</a></li>
            <li><a className="hover:text-white hover:underline" href="#/for-authors">Peer-review process</a></li>
            <li><a className="hover:text-white hover:underline" href="#/about">Aims &amp; scope</a></li>
            <li><a className="hover:text-white hover:underline" href="#/about">Abstracting &amp; indexing</a></li>
            <li><a className="hover:text-white hover:underline" href="#/contact">Contact the journal</a></li>
          </ul>
        </nav>

        {/* Alerts */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Stay informed</h3>
          <p className="mt-4 text-[13px] text-zinc-400">Get table-of-contents alerts for every new issue.</p>
          <form onSubmit={subscribe} className="mt-3 flex gap-2" aria-label="Newsletter subscription">
            <Input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="h-9 border-zinc-600 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
              aria-label="Email address"
            />
            <Button type="submit" size="sm" className="h-9 gap-1.5" disabled={busy}>
              <Send className="h-3.5 w-3.5" aria-hidden /> {busy ? '…' : 'Join'}
            </Button>
          </form>
          <a href="#/contact" className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-zinc-400 hover:text-white">
            <Mail className="h-3.5 w-3.5" aria-hidden /> office@ijcs.ir
          </a>
        </div>
      </div>

      <div className="border-t border-zinc-700/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-[12px] text-zinc-500 sm:flex-row sm:px-6">
          <p>© 2018–2026 Iran Journal of Computer Science. All articles licensed under CC BY 4.0.</p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-zinc-400">Indexed in:</span>
            <span className="inline-flex items-center gap-1.5 rounded bg-scopus/90 px-2 py-0.5 font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden /> Scopus
            </span>
            <span className="text-zinc-500">2018–2026</span>
            <OaBadge onDark className="ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
}
