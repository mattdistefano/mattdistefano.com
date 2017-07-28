export interface PageSummary {
  /** The path, without extension, of the page, relative to site root */
  path: string;
  /** The title of the page */
  title: string;
  /** The date the page was created */
  created: string;
  /** The date the page was last modified */
  modified?: string;
  /** The summary of the page */
  summary?: string;
}