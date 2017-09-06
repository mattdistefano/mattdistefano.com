import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import { AppComponent, AppProps } from './components/app';
import { IndexPage, Page, HtmlMetaData, PageCache } from './models';

interface Prerendered {
  [path: string]: {
    title: string;
    description: string;
    content: string;
    state?: string;
  };
}

const pathToUrl = (path: string) =>
  path.endsWith('/index') ? path.slice(0, -5) : path;

const buildCache = (page: Page) =>
  ({
    [pathToUrl(page.path)]: {
      status: 'loaded',
      data: page,
      timestamp: Date.now()
    }
  } as PageCache);

export default (pages: Page[]) =>
  pages.reduce((prev: Prerendered, curr: Page) => {
    const initialPageCache = buildCache(curr);

    const url = pathToUrl(curr.path);

    prev[curr.path] = {
      title: null,
      description: null,
      content: null,
      state: JSON.stringify({ initialPageCache }).replace(/</g, '\\u003c')
    };

    const setMeta = ({ title, description }: HtmlMetaData) => {
      prev[curr.path].title = title;
      prev[curr.path].description = description;
    };

    prev[curr.path].content = ReactDOMServer.renderToString(
      <StaticRouter context={{}} location={url}>
        <AppComponent initialPageCache={initialPageCache} onMeta={setMeta} />
      </StaticRouter>
    );

    return prev;
  }, {});
