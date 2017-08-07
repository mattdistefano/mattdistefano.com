import * as smoothscroll from 'smoothscroll-polyfill';
import isBrowserEnv from './utils/is-browser-env';

if (isBrowserEnv) {
  smoothscroll.polyfill();
}
