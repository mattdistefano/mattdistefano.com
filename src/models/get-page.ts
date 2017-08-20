import { HttpError } from './http-error';
import { Page } from './page';
import { IndexPage } from './index-page';
import { PageSummary } from './page-summary';
import { walkPage } from './walk-page';

// TODO maybe move this to a different folder?

const toJsonPath = (path: string) =>
  path.endsWith('/') ? `${path}index.json` : `${path}.json`;

const fromJsonPath = (path: string) =>
  path.endsWith('/index') ? path.slice(0, -5) : path;

const updatePath = (item: Page | IndexPage | PageSummary) =>
  (item.path = fromJsonPath(item.path));

const transformResponse = (page: Page | IndexPage) =>
  walkPage(page, updatePath) as Page | IndexPage;

/** Returns a promise that will resolve with the specified page or reject on any error */
export const getPage = (path: string): Promise<Page | IndexPage> =>
  fetch(toJsonPath(path)).then(res => {
    if (res.status !== 200) {
      throw new HttpError(
        `Error retrieving ${res.url}`,
        res.status,
        res.statusText
      );
    }
    return res.json().then(transformResponse);
  });
