import { IndexPage, Page, PageSummary } from '@mattdistefano/site-generator';
import { AsyncData } from './async-data';

// TODO make configurable?
const cacheDuration = 1800000; // ms

export const isStale = (data: AsyncData<any>) =>
  data.timestamp < Date.now() - cacheDuration;

export const isLoaded = (data: AsyncData<Page | IndexPage | PageSummary>) =>
  data && data.status === 'loaded' && data.data.type !== 'summary';

export interface PageCache {
  [url: string]: AsyncData<Page | IndexPage | PageSummary>;
}
