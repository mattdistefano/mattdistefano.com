import * as React from 'react';
import { Component, ComponentType } from 'react';
import { Route, RouteProps, RouteComponentProps, Switch } from 'react-router';

import {
  Page,
  IndexPage,
  HtmlMetaData,
  AsyncData,
  PageCache,
  getPage,
  getMetaData,
  isStale,
  breakpoints,
  headerHeight
} from '../../models';

import { SiteHeaderComponent } from './site-header';
import { SiteFooterComponent } from './site-footer';

import {
  StandardPageComponent,
  StandardPageProps,
  StandardIndexPageComponent,
  BlogArchiveIndexPageComponent,
  BlogIndexPageComponent,
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

// tslint:disable:variable-name
const WrappedStandardPage = wrapPageComponent(StandardPageComponent);

const WrappedStandardIndexPage = wrapPageComponent(StandardIndexPageComponent);

const WrappedBlogPage = wrapPageComponent(BlogPageComponent);

const WrappedBlogIndexPageComponent = wrapPageComponent(BlogIndexPageComponent);

const WrappedBlogArchiveIndexPageComponent = wrapPageComponent(
  BlogArchiveIndexPageComponent
);

const WrappedHomePage = wrapPageComponent(HomePageComponent);
// tslint:enable:variable-name

const headerHeightPx = parseInt(headerHeight, 10);

export interface AppProps {
  initialPageCache?: PageCache;
  onMeta?: (meta: HtmlMetaData) => void;
}

export class AppComponent extends Component<AppProps, AppState> {
  private _mq = isBrowserEnv &&
    window.matchMedia(`(min-width: ${breakpoints.small})`);

  constructor(props: AppProps) {
    super(props);

    // TODO autobind
    this._onRouteEnter = this._onRouteEnter.bind(this);

    this.state = {
      pageCache: props.initialPageCache || {}
    };
  }

  private _onRouteEnter(path: string) {
    if (this._mq) {
      // TODO this is still imperfect
      // basically need to capture this value *before* navigation
      // since after navigation the overall page height will be ~100vh
      // and no scroll
      // unless the new page content is cached
      if (this._mq.matches && window.scrollY > headerHeightPx) {
        window.scroll({ top: headerHeightPx, left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      }
    }

    const page = this.state.pageCache[path];

    if (page && page.status === 'loading') {
      return;
    }

    if (page && page.data && page.data.type !== 'summary' && !isStale(page)) {
      return;
    }

    this.setState(onPageLoading(path, this.state));

    getPage(path)
      .then(loadedPage => this.setState(onPageLoaded(loadedPage, this.state)))
      .catch(() => this.setState(onPageLoadingFailed(path, this.state)));
  }

  // TODO might be losing too much of the value of type-checking here
  private _renderPage<T extends WrappedProps>(
    // tslint:disable-next-line:variable-name
    PageComponent: ComponentType<T>,
    props: RouteComponentProps<any>
  ) {
    const path = props.match.url || '/';

    const page = this.state.pageCache[path];

    if (this.props.onMeta) {
      this.props.onMeta(getMetaData(page));
    }

    // TODO factor this out to a component or HOC?
    if (
      isBrowserEnv &&
      page &&
      page.status !== 'loading' &&
      (!page.data || page.data.type !== 'summary')
    ) {
      ga('set', 'page', path);
      ga('send', 'pageview');
    }

    return (
      <PageComponent
        onEnter={this._onRouteEnter}
        page={page}
        {...props}
        delay={2}
        key={path}
      />
    );
  }

  private _renderDefault(props: RouteComponentProps<any>) {
    if (props.match.url.endsWith('/')) {
      return this._renderPage(WrappedStandardIndexPage, props);
    }

    return this._renderPage(WrappedStandardPage, props);
  }

  render() {
    return (
      <div>
        <Route component={SiteHeaderComponent} />
        <div className="container">
          <div className="site-content">
            <main>
              <Switch>
                <Route
                  path="/"
                  exact
                  render={props => this._renderPage(WrappedHomePage, props)}
                />
                <Route
                  path="/blog/"
                  exact
                  render={props =>
                    this._renderPage(WrappedBlogIndexPageComponent, props)}
                />
                <Route
                  path="/blog/:year/:month?/:day?/"
                  exact
                  render={props =>
                    this._renderPage(
                      WrappedBlogArchiveIndexPageComponent,
                      props
                    )}
                />
                <Route
                  path="/blog/:year/:month/:day/:slug"
                  render={props => this._renderPage(WrappedBlogPage, props)}
                />
                <Route path="*" render={props => this._renderDefault(props)} />
              </Switch>
            </main>
            <SiteFooterComponent />
          </div>
        </div>
      </div>
    );
  }
}
