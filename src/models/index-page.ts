import { Page } from './page';
import { PageSummary } from './page-summary';

export interface IndexPage {
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
  /** The path to the previous page */
  next?: string;
  /** The path to the next page */
  previous?: string;
  /** The list of pages in this folder */
  pages?: PageSummary[];

  children?: [{
    path: string;
    children: PageSummary[]
  }]
}
