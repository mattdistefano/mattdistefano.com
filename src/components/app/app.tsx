import * as React from 'react';
import { ComponentType } from 'react';
import { Route, RouteProps, RouteComponentProps, Switch } from 'react-router';

import {
  Page,
  IndexPage,
  AsyncData,
  PageCache,
  getPage,
  isStale
} from '../../models';

import { SiteHeaderComponent, SiteFooterComponent } from '../layout';

import {
  StandardPageComponent,
  StandardIndexPageComponent,
  BlogPageComponent,
  HomePageComponent
} from '../pages';

import isBrowserEnv from '../../utils/is-browser-env';

import { wrapPageComponent, WrappedProps } from './wrap-page-component';

import {
  AppState,
  onPageLoaded,
  onPageLoading,
  onPageLoadingFailed
} from './app-state';

const WrappedStandardPage = wrapPageComponent(StandardPageComponent);

const WrappedStandardIndexPage = wrapPageComponent(StandardIndexPageComponent);

const WrappedBlogPage = wrapPageComponent(BlogPageComponent);

const WrappedHomePage = wrapPageComponent(HomePageComponent);

export interface AppProps {
  initialPageCache?: PageCache;
}

export class AppComponent extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    // TODO autobind
    this._onRouteEnter = this._onRouteEnter.bind(this);

    this.state = {
      pageCache: props.initialPageCache || {}
    };
  }

  private _onRouteEnter(path: string) {
    if (isBrowserEnv) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }

    const page = this.state.pageCache[path];

    if (page && (page.status === 'loading' || !isStale(page))) {
      return;
    }

    this.setState(onPageLoading(path, this.state));

    getPage(path)
      .then(loadedPage => this.setState(onPageLoaded(loadedPage, this.state)))
      .catch(() => this.setState(onPageLoadingFailed(path, this.state)));
  }

  private _getStandardProps<T extends Page | IndexPage>(path: string) {
    const page = this.state.pageCache[path] as AsyncData<T>;

    let title: string;
    let description: string;
    let found = page && page.status !== 'notfound';

    if (!found) {
      title = 'mattdistefano.com | Not Found!';
      description = '';
    } else if (page.status === 'loading') {
      title = 'mattdistefano.com | Loading...';
      description = '';
    } else if (page.status === 'loaded') {
      title = `mattdistefano.com | ${page.data.titleText || ''}`;
      description = page.data.summary;
    }

    return {
      routeKey: path,
      onEnter: this._onRouteEnter,
      title,
      description,
      page,
      found
    };
  }

  // TODO might be losing too much of the value of type-checking here
  private _renderPage<T extends WrappedProps>(
    Component: ComponentType<T>,
    path: string,
    props = {}
  ) {
    return <Component {...this._getStandardProps(path)} {...props} />;
  }

  private _renderDefault(props: RouteComponentProps<any>) {
    const path = props.match.url;

    if (path.endsWith('/')) {
      return this._renderPage(WrappedStandardIndexPage, path + 'index');
    }

    return this._renderPage(WrappedStandardPage, path);
  }

  render() {
    return (
      <div>
        <SiteHeaderComponent />
        <div className="container">
          <div className="site-content">
            <main className="site-content__animated">
              <Switch>
                <Route
                  path="/"
                  exact
                  render={props => this._renderPage(WrappedHomePage, '/index')}
                />
                <Route
                  path="/blog/:slug"
                  render={props =>
                    this._renderPage(WrappedBlogPage, props.match.url)}
                />
                <Route path="*" render={props => this._renderDefault(props)} />
              </Switch>
            </main>
            <SiteFooterComponent className="site-content__animated" />
          </div>
        </div>
      </div>
    );
  }
}
