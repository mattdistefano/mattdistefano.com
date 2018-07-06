import { IndexPage, Page, PageSummary } from '@mattdistefano/site-generator';

import {
  PageCache,
  walkPage,
  asyncDataStatus,
  AsyncData
} from '../models';

export interface AppState {
  pageCache: PageCache;
  title?: string;
  description?: string;
}

const addPageToCache = (
  cache: PageCache,
  path: string,
  status: asyncDataStatus,
  data?: Page | IndexPage
) => {
  const cacheClone = { ...cache };
  const existing = cacheClone[path] || {} as AsyncData<Page | IndexPage | PageSummary>;

  cacheClone[path] = {
    ...existing,
    timestamp: Date.now(),
    data: data || existing.data,
    status,
    path,
  };

  if (data) {
    walkPage(data, item => {
      if (cache[item.path]) {
        return;
      }

      cacheClone[item.path] = {
        timestamp: Date.now(),
        data: item,
        path: item.path,
        status: 'loaded',
      };
    });
  }

  return cacheClone;
};

/** Returns a new state representing the start of loading of the specified post */
export const onPageLoading = (path: string, state: AppState) => ({
  ...state,
  pageCache: addPageToCache(state.pageCache, path, 'loading')
});

/** Returns a new state representing the successful load of the specified post */
export const onPageLoaded = (page: Page | IndexPage, state: AppState) => ({
  ...state,
  pageCache: addPageToCache(state.pageCache, page.path, 'loaded', page)
});

/** Returns a new state representing the failed load of the specified post */
export const onPageLoadingFailed = (path: string, state: AppState) => ({
  ...state,
  pageCache: addPageToCache(state.pageCache, path, 'notfound')
});
