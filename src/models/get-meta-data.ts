import { AsyncData } from './async-data';
import { IndexPage } from './index-page';
import { Page } from './page';
import { HtmlMetaData } from './html-meta-data';

export const getMetaData = (page: AsyncData<Page | IndexPage>): HtmlMetaData => {
  let title: string;
  let description: string;

  if (!page || page.status === 'notfound') {
    title = 'mattdistefano.com | Not Found!';
    description = '';
  } else if (page.status === 'loading') {
    title = 'mattdistefano.com | Loading...';
    description = '';
  } else if (page.status === 'loaded') {
    title = `mattdistefano.com | ${page.data.titleText || ''}`;
    description = page.data.summary || '';
  }

  return { title, description };
};
