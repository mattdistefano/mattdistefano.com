import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Page, IndexPage, PageCache } from './models';
import { AppComponent } from './components/app/app';

export default () =>
  ReactDOM.render(
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>,
    document.getElementById('app')
  );
