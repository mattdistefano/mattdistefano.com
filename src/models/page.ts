import { PageSummary } from './page-summary';

export interface Page {
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
  /** The path, without extension, of the page, relative to site root */
  path: string;
  /** The HTML content of the page */
  content: string;
  /** The previous page */
  next?: PageSummary;
  /** The next page */
  prev?: PageSummary;
}
