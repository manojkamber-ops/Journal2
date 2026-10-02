# Worklog

---
Task ID: 1
Agent: Main agent (Super Z)
Task: Build a complete, working journal website for "Iran Journal of Computer Science" (ISSN 2520-8438, eISSN 2520-8446, Springer Nature, Scopus-covered 2018–2026) at Springer/Scopus quality level.

Work Log:
- Loaded `fullstack-dev` skill; initialized project environment via init script.
- Defined Prisma schema (Article, Issue, Author, ArticleAuthor, BoardMember, Announcement, ContactMessage, NewsletterSubscriber) in `prisma/schema.prisma`; pushed to SQLite (`db/custom.db`).
- Created content pools (`scripts/seed-data.ts`): Persian + international author names, 24 Iranian universities, 30 international institutions, 11 subject areas, per-section tasks/methods/keywords, 48 reference venues, editorial board (30 members), 12 announcements, 4 special issues.
- Built deterministic generator (`scripts/seed.ts`, mulberry32 PRNG): 9 volumes (2018–2026), 36 quarterly issues, 259 articles (254 published + 5 in-press for Dec 2026), 532-author pool with reuse, realistic abstracts, 15–34 references per article (incl. journal self-citations), simulated citations/downloads scaled by age/type, DOI 10.22034/ijcs.*, page ranges, received/accepted/published dates. Fixed title grammar iteratively (a/an selection, title-casing, acronym preservation: CNN/PCB/BLE/FastText/YOLOv8/ParsBERT).
- Built API routes: `/api/journal` (overview+metrics), `/api/articles` (search q/year/type/section/sort/pagination, author+keyword full-text), `/api/articles/[id]`, `/api/articles/[id]/pdf` (real PDF via pdf-lib, CP1252 sanitizer, multi-page with headers/footers), `/api/articles/[id]/citation` (BibTeX/RIS/APA downloads), `/api/issues`, `/api/issues/[id]`, `/api/board`, `/api/contact` (zod-validated POST→DB), `/api/newsletter`.
- Built SPA frontend (hash routing, single visible `/` route per sandbox rules): header (utility bar, masthead, sticky nav, global search), footer (newsletter signup), views: Home (hero + CiteScore chart + current issue + just-accepted + announcements + most cited/downloaded + stats band + subject-area grid), Articles (filters/sort/pagination), Article (authors w/ ORCID + affiliations, abstract, keywords, references accordion, cite box, PDF button, metrics, similar articles), Issues (volume archive, special-issue filter), Issue (incl. forthcoming in-press), Editorial Board, For Authors (6-section submission guidelines), About (aims/scope, ISSN info, metrics, indexing, history timeline, policies), Contact (validated form→DB + FAQ).
- Fixed React hook lint errors (setState-in-effect → derived state / key-remount patterns); fixed `Button asChild` multi-child runtime crash.
- Agent Browser E2E verification: home/articles/article/issues/board/authors/about/contact all render; header search → 16 results for "intrusion detection"; contact form submission persisted to SQLite; PDF endpoint returns valid 3-page PDF; BibTeX/RIS exports verified; mobile 390px layout + hamburger nav verified; footer sticky verified; zero page errors; `bun run lint` clean.

Stage Summary:
- Deliverable: fully working journal website at `/` (Next.js 16 + Prisma/SQLite + pdf-lib), 259 seeded articles across 2018–2026 with full metadata, working search/filters/pagination, real PDF downloads, citation export, contact+newsletter persistence.
- Key files: `prisma/schema.prisma`, `scripts/seed-data.ts`, `scripts/seed.ts`, `src/lib/journal-{types,client}.ts`, `src/components/journal/*` (header, footer, bits, 9 views), `src/app/page.tsx`, `src/app/api/**`.
- Re-seed anytime with `bun scripts/seed.ts` (deterministic).
