import { IndexPage, Page, PageSummary } from '@mattdistefano/site-generator';

import {
  PageCache,
  walkPage,
  asyncDataStatus
} from '../models';

export interface AppState {
  pageCache: PageCache;
}

const addToCache = (
  cache: PageCache,
  page: Page | IndexPage | PageSummary,
  status: asyncDataStatus
) => {
  walkPage(page, item => {
    const cached = cache[item.path];

    if (
      cached &&
      cached.status === 'loaded' &&
      cached.data.type !== 'summary'
    ) {
      // don't bother replacing any fully-loaded pages
      return;
    }

    cache[item.path] = {
      timestamp: Date.now(),
      data: item,
      path: item.path,
      status
    };
  });
};

// TODO just combine these?
const addPageToCache = (
  cache: PageCache,
  path: string,
  status: asyncDataStatus,
  data?: Page | IndexPage
) => {
  const cloned = Object.assign({}, cache);

  if (status === 'loading') {
    cloned[path] = {
      ...cloned[path] || {},
      status: 'loading',
      timestamp: Date.now(),
      path,
    };
  } else if (status === 'notfound') {
    cloned[path] = {
      status: 'notfound',
      timestamp: Date.now(),
      path,
    };
  } else if (status === 'loaded') {
    walkPage(data, item => addToCache(cloned, item, 'loaded'));
  }

  return cloned;
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
