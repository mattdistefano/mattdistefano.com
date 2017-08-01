import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { PageCache } from './models';
import { AppComponent } from './components/app';

export default (cache: PageCache) => {
  let appInstance: AppComponent = null;

  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <AppComponent
          initialPageCache={cache}
          ref={app => (appInstance = app)}
        />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('app')
  );

  return appInstance;
};

