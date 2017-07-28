import { HttpError } from './http-error';
import { Page } from './page';
import { IndexPage } from './index-page';

// TODO maybe move this to a different folder?

/** Returns a promise that will resolve with the specified page or reject on any error */
export const getPage = (path: string): Promise<Page | IndexPage> =>
  fetch(path + '.json').then(res => {
    if (res.status !== 200) {
      throw new HttpError(
        `Error retrieving ${res.url}`,
        res.status,
        res.statusText
      );
    }
    return res.json();
  });
