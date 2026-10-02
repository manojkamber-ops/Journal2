// Hand-written complete papers for the latest issue (Vol. 9, Issue 3).
// Each paper is a full-length article: Introduction, Literature Review,
// Methodology, Experimental Setup, Results & Discussion, Conclusion, References.
import type { PaperBlock } from '../../src/lib/journal-types';

export interface FlagshipPaper {
  title: string;
  abstractText: string;
  keywords: string[];
  section: string;
  type: string;
  blocks: PaperBlock[];
  references: string[];
}

export { default as fp1 } from './fp1';
export { default as fp2 } from './fp2';
export { default as fp3 } from './fp3';
export { default as fp4 } from './fp4';
export { default as fp5 } from './fp5';
export { default as fp6 } from './fp6';
export { default as fp7 } from './fp7';
export { default as fp8 } from './fp8';
