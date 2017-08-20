import { AsyncData } from './async-data';
import { IndexPage } from './index-page';
import { PageSummary } from './page-summary';
import { Page } from './page';
import { HtmlMetaData } from './html-meta-data';
import htmlToText from '../utils/html-to-text';

export const getMetaData = (page: AsyncData<Page | IndexPage| PageSummary>): HtmlMetaData => {
  let title: string;
  let description: string;

  if (!page || page.status === 'notfound') {
    title = 'mattdistefano.com | Not Found!';
    description = '';
  } else if (page.status === 'loading') {
    title = 'mattdistefano.com | Loading...';
    description = '';
  } else if (page.status === 'loaded') {
    title = `mattdistefano.com | ${htmlToText(page.data.title || '')}`;
    description = page.data.summary || '';
  }

  return { title, description };
};
