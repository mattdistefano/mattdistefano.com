import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import { Page, IndexPage, PageCache } from './models';
import { AppComponent, AppProps } from './components/app';

interface Prerendered {
  [path: string]: {
    title: string;
    description: string;
    content: string;
    state?: string;
  };
}

const buildCache = (page: Page) =>
  ({
    [page.path]: {
      status: 'loaded',
      data: page,
      timestamp: Date.now()
    }
  } as PageCache);

const pathToUrl = (path: string) =>
  path.endsWith('/index') ? path.slice(0, -5) : path;

export default (pages: Page[]) =>
  pages.reduce((prev: Prerendered, curr: Page) => {
    const initialPageCache = buildCache(curr);

    const url = pathToUrl(curr.path);

    prev[curr.path] = {
      title: `mattdistefano.com | ${curr.titleText || ''}`,
      description: curr.summary || '',
      state: JSON.stringify({ initialPageCache }).replace(/</g, '\\u003c'),
      content: ReactDOMServer.renderToString(
        <div>
          <StaticRouter context={{}} location={url}>
            <AppComponent initialPageCache={initialPageCache} />
          </StaticRouter>
        </div>
      )
    };
    return prev;
  }, {});
