import * as smoothscroll from 'smoothscroll-polyfill';
import { IS_BROWSER_ENV } from './utils';

if (IS_BROWSER_ENV) {
  smoothscroll.polyfill();
}
