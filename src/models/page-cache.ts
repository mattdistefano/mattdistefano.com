import { Page } from './page';
import { IndexPage } from './index-page';
import { PageSummary } from './page-summary';
import { AsyncData } from './async-data';

// TODO make configurable?
const cacheDuration = 1800000; // ms

export const isStale = (data: AsyncData<any>) =>
  data.timestamp < Date.now() - cacheDuration;

export interface PageCache {
  [url: string]: AsyncData<Page | IndexPage | PageSummary>;
}
