'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Clock, Send, Building2 } from 'lucide-react';

export function ContactView() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to send');
      }
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast({ title: 'Message sent', description: 'The editorial office will reply within 2 working days.' });
    } catch (err) {
      toast({
        title: 'Could not send message',
        description: err instanceof Error ? err.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="border-b-2 border-crimson pb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-crimson">Get in touch</p>
        <h1 className="wordmark mt-1 text-3xl font-bold text-ink">Contact</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-500">
          Questions about a submission, review status, APC, or the journal in general — the editorial
          office is happy to help.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <section aria-labelledby="form-h">
          <h2 id="form-h" className="text-lg font-bold text-ink">Send us a message</h2>
          {sent ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
              <Send className="mx-auto h-8 w-8 text-emerald-600" aria-hidden />
              <p className="mt-2 font-semibold text-ink">Thank you — your message was received.</p>
              <p className="mt-1 text-sm text-zinc-600">We reply to all enquiries within two working days.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="c-name">Full name</Label>
                  <Input
                    id="c-name" required minLength={2}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. Firstname Lastname"
                    className="border-zinc-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-email">Email</Label>
                  <Input
                    id="c-email" type="email" required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@university.edu"
                    className="border-zinc-300"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-subject">Subject</Label>
                <Input
                  id="c-subject" required minLength={3}
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g., Question about submission IJCS-2026-0245"
                  className="border-zinc-300"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-msg">Message</Label>
                <Textarea
                  id="c-msg" required minLength={10} rows={7}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="How can we help?"
                  className="resize-y border-zinc-300"
                />
              </div>
              <Button type="submit" disabled={busy} className="gap-2">
                <Send className="h-4 w-4" aria-hidden /> {busy ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </section>

        {/* Info sidebar */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 text-[13px]">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              <Building2 className="h-4 w-4 text-crimson" aria-hidden /> Editorial office
            </h3>
            <address className="mt-3 not-italic leading-relaxed text-zinc-600">
              Iran Journal of Computer Science<br />
              Editorial Office, Room 204<br />
              Faculty of Computer Engineering<br />
              Sharif University of Technology<br />
              Azadi Ave, Tehran 1458889694, Iran
            </address>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 text-[13px]">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              <Mail className="h-4 w-4 text-crimson" aria-hidden /> Email
            </h3>
            <ul className="mt-3 space-y-2">
              <li><span className="text-zinc-400">General:</span> <a className="text-crimson hover:underline" href="mailto:office@ijcs.ir">office@ijcs.ir</a></li>
              <li><span className="text-zinc-400">Submissions:</span> <a className="text-crimson hover:underline" href="mailto:submissions@ijcs.ir">submissions@ijcs.ir</a></li>
              <li><span className="text-zinc-400">APC &amp; billing:</span> <a className="text-crimson hover:underline" href="mailto:apc@ijcs.ir">apc@ijcs.ir</a></li>
            </ul>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 text-[13px]">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
              <Clock className="h-4 w-4 text-crimson" aria-hidden /> Office hours
            </h3>
            <p className="mt-3 leading-relaxed text-zinc-600">
              Saturday–Wednesday, 9:00–17:00 (IRST).<br />
              Average response time: under 2 working days.
            </p>
            <p className="mt-2 flex items-start gap-1.5 text-zinc-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Authors can check manuscript status at any time via the submission system.
            </p>
          </div>
        </aside>
      </div>

      {/* FAQ */}
      <section className="mt-12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-lg font-bold text-ink">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="q1">
            <AccordionTrigger className="text-sm font-semibold">How long does the review process take?</AccordionTrigger>
            <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
              The median time to a first decision is 38 days, and accepted articles appear online within 18 days
              of acceptance. Manuscripts requiring major revision naturally take longer; authors can track status
              in the submission system at every stage.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger className="text-sm font-semibold">Is there a submission fee?</AccordionTrigger>
            <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
              No. Submission is free, and the article processing charge (USD 1,090) applies only after acceptance.
              Automatic full waivers apply to corresponding authors in World Bank low-income countries.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger className="text-sm font-semibold">Can I post my article to a preprint server?</AccordionTrigger>
            <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
              Yes. Preprints (e.g., arXiv, Research Square) may be posted at any time, and posting does not affect
              editorial consideration. Accepted versions may be self-archived without embargo under CC BY 4.0.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger className="text-sm font-semibold">Do you publish special issues?</AccordionTrigger>
            <AccordionContent className="text-[13.5px] leading-relaxed text-zinc-600">
              The journal publishes 2–3 themed special issues per year. Proposals should include the topic,
              rationale, guest-editor team, and a tentative timeline, and should be sent to the Editor-in-Chief.
              Current calls for papers are announced on the journal home page.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
