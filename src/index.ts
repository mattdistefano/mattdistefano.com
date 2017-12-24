import './polyfills';
import browserRender from './browser';
import { PageCache } from './models';
import { AppComponent } from './components/app/app';
import { IS_BROWSER_ENV } from './utils';

import './css/index.css';

declare global {
  interface Window {
    __PRELOADED_STATE__: {
      initialPageCache: PageCache
    };
  }
}

if (IS_BROWSER_ENV) {
  const initialPageCache = window.__PRELOADED_STATE__ ? window.__PRELOADED_STATE__.initialPageCache : {};

  let appInstance = browserRender(initialPageCache);

  if (module.hot) {
    module.hot.accept();
    module.hot.accept('./components/app/app', () => {
      appInstance = browserRender(appInstance && appInstance.state.pageCache);
    });
  }
}
