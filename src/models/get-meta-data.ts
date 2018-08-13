import { IndexPage, Page, PageSummary } from '@mattdistefano/site-generator';
import { AsyncData } from './async-data';
import { HtmlMetaData } from './html-meta-data';
import { htmlToText } from '../utils';

export const getMetaData = (page: AsyncData<Page | IndexPage| PageSummary>): HtmlMetaData => {
  let title: string;
  let description: string;

  if (!page || page.status === 'loading') {
    title = 'mattdistefano.com | Loading...';
    description = '';
  } else if (page.status === 'notfound') {
    title = 'mattdistefano.com | Not Found!';
    description = '';
  } else if (page.status === 'loaded') {
    title = `mattdistefano.com | ${htmlToText(page.data.title || '')}`;
    description = page.data.summary || '';
  }

  return { title, description };
};
