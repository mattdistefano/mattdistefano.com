import { Page, IndexPage, PageCache } from '../../models';

export interface AppState {
  pageCache: PageCache;
}

/** Returns a new state representing the start of loading of the specified post */
export const onPageLoading = (path: string, state: AppState) =>
  ({
    pageCache: {
      ...state.pageCache,
      [path]: {
        status: 'loading',
        timestamp: Date.now()
      }
    }
  } as AppState);

/** Returns a new state representing the successful load of the specified post */
export const onPageLoaded = (page: Page | IndexPage, state: AppState) =>
  ({
    pageCache: {
      ...state.pageCache,
      [page.path]: {
        status: 'loaded',
        timestamp: Date.now(),
        data: page
      }
    }
  } as AppState);

/** Returns a new state representing the failed load of the specified post */
export const onPageLoadingFailed = (path: string, state: AppState) =>
  ({
    pageCache: {
      ...state.pageCache,
      [path]: {
        status: 'notfound',
        timestamp: Date.now()
      }
    }
  } as AppState);
