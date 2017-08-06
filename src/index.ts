import browserRender from './browser';
import prerender from './prerender';
import { PageCache } from './models';
import { AppComponent } from './components/app/app';

import './css/index.css';

declare global {
  interface Window {
    __PRELOADED_STATE__: string;
  }
}

if (typeof document !== 'undefined') {
  const initialPageCache: PageCache = JSON.parse(
    window.__PRELOADED_STATE__ || '{}'
  ).initialPageCache;

  let appInstance = browserRender(initialPageCache);

  if (module.hot) {
    module.hot.accept();
    module.hot.accept('./components/app/app', () => {
      appInstance = browserRender(appInstance && appInstance.state.pageCache);
    });
  }
}

export const __PRERENDERER = prerender;