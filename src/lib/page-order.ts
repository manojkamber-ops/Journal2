// Page-range ordering helper.
// Page ranges are stored as display strings ("1-9", "10-16"), which sort
// incorrectly as strings ("10-16" < "1-9"). Sort by the numeric START page.

export function startPage(pages: string | null | undefined): number {
  const m = /(\d+)/.exec(pages ?? '');
  return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
}

// Comparator: numeric start page ascending. Empty pages (in-press) go last.
export function byStartPageAsc<T extends { pages: string | null }>(a: T, b: T): number {
  return startPage(a.pages) - startPage(b.pages);
}
