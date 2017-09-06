import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { PageCache, HtmlMetaData } from './models';
import { AppComponent } from './components/app';

export default (cache: PageCache) => {
  let appInstance: AppComponent = null;

  let descriptionElem: HTMLMetaElement = document.head.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement;

  if (!descriptionElem) {
    descriptionElem = document.createElement('meta');
    descriptionElem.setAttribute('name', 'description');
    document.head.appendChild(descriptionElem);
  }

  const onMeta = ({ title, description }: HtmlMetaData) => {
    document.title = title;
    descriptionElem.content = description;
  };

  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <AppComponent
          initialPageCache={cache}
          onMeta={onMeta}
          ref={app => (appInstance = app)}
        />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('app')
  );

  return appInstance;
};
