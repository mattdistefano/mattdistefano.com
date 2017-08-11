import { HttpError } from './http-error';
import { Page } from './page';
import { IndexPage } from './index-page';
import { PageSummary } from './page-summary';

// TODO maybe move this to a different folder?

const toJsonPath = (path: string) =>
  path.endsWith('/') ? `${path}index.json` : `${path}.json`;

const fromJsonPath = (path: string) =>
  path.endsWith('/index') ? path.slice(0, -5) : path;

const transformSummary = (summary: PageSummary) => {
  summary.path = fromJsonPath(summary.path);

  if (summary.children) {
    summary.children.forEach(transformSummary);
  }

  if (summary.children) {
    summary.children.forEach(transformSummary);
  }

  return summary;
};

const transformPage = (page: Page) => {
  if (page.type === 'page') {
    if (page.prev) {
      transformSummary(page.prev);
    }
    if (page.next) {
      transformSummary(page.next);
    }

    return page;
  }
};

const transformIndexPage = (page: IndexPage) => {
  if (page.pages) {
    page.pages.forEach(transformSummary);
  }

  if (page.children) {
    page.children.forEach(transformSummary);
  }

  if (page.queries) {
    Object.keys(page.queries).forEach(key =>
      page.queries[key].results.forEach(transformSummary)
    );
  }

  return page;
};

const transformResponse = (page: Page | IndexPage) => {
  page.path = fromJsonPath(page.path);

  if (page.type === 'index') {
    transformIndexPage(page);
  } else {
    transformPage(page);
  }
  return page;
};

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
