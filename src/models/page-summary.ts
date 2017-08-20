export interface PageSummary {
  type: 'summary';
  /** The path, without extension, of the page, relative to site root */
  path: string;
  /** The title of the page w/ HTML stripped */
  titleText: string;
  /** The title of the page including any HTML */
  titleHtml: string;
  /** The date the page was created */
  created: string;
  /** The date the page was last modified */
  modified?: string;
  /** The summary of the page */
  summary?: string;
  /** The list of pages in this folder */
  pages?: PageSummary[];
  /** The contents of any sub folders */
  children?: PageSummary[];
}
