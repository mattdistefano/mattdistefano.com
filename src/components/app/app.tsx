import * as React from 'react';
import { Component, ComponentType } from 'react';
import { Route, RouteProps, RouteComponentProps, Switch } from 'react-router';

import { IndexPage, Page, PageSummary } from '@mattdistefano/site-generator';

import {
  HtmlMetaData,
  AsyncData,
  PageCache,
  HttpError,
  getPage,
  getMetaData,
  isStale,
  isLoaded,
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
  BlogIndexPageComponent
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

const WrappedBlogIndexPageComponent = wrapPageComponent(BlogIndexPageComponent);

const WrappedBlogArchiveIndexPageComponent = wrapPageComponent(
  BlogArchiveIndexPageComponent
);

// tslint:enable:variable-name

const headerHeightPx = parseInt(headerHeight.medium, 10);

export interface AppProps {
  initialPageCache?: PageCache;
  onMeta?: (meta: HtmlMetaData) => void;
}

export class AppComponent extends Component<AppProps, AppState> {
  private _mq = isBrowserEnv &&
    window.matchMedia(`(min-width: ${breakpoints.small})`);

  private _lastPath: string;

  private _lastScrollY: number;

  constructor(props: AppProps) {
    super(props);

    // TODO autobind
    this._onRouteEnter = this._onRouteEnter.bind(this);

    this.state = {
      pageCache: props.initialPageCache || {}
    };
  }

  private _trackPageView(page: AsyncData<Page | IndexPage | PageSummary>) {
    if (!isBrowserEnv) {
      return;
    }

    ga('set', 'page', page.path);
    ga('send', 'pageview');
  }

  private _restoreScroll() {
    if (!this._mq) {
      return;
    }

    // TODO this is still imperfect
    // basically need to capture this value *before* navigation
    // since after navigation the overall page height will be ~100vh
    // and no scroll
    // unless the new page content is cached
    if (this._mq.matches && this._lastScrollY > headerHeightPx) {
      window.scroll({ top: headerHeightPx, left: 0, behavior: 'smooth' });
    } else {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  private _ensurePage(path: string) {
    const page = this.state.pageCache[path];

    if (isLoaded(page) && !isStale(page)) {
      return;
    }

    this.setState(onPageLoading(path, this.state));

    getPage(path)
      .then(loadedPage => this.setState(onPageLoaded(loadedPage, this.state)))
      .catch(e => {
        if (e instanceof HttpError) {
          // it's a data error
          this.setState(onPageLoadingFailed(path, this.state));
        } else {
          // it's another - probably rendering - error
          throw e;
        }
      });
  }

  private _onRouteEnter(path: string) {
    this._restoreScroll();

    this._ensurePage(path);
  }

  // TODO might be losing too much of the value of type-checking here
  private _renderPage<T extends WrappedProps>(
    // tslint:disable-next-line:variable-name
    PageComponent: ComponentType<T>,
    props: RouteComponentProps<any>
  ) {
    const path = props.match.url || '/';

    if (path !== this._lastPath) {
      this._lastPath = path;
      this._lastScrollY = isBrowserEnv ? window.scrollY : null;
    }

    const page = this.state.pageCache[path];

    if (page && (isLoaded(page) || page.status === 'notfound')) {
      this._restoreScroll();
      this._trackPageView(page);
    }

    if (this.props.onMeta) {
      this.props.onMeta(getMetaData(page));
    }

    return (
      <PageComponent
        onEnter={this._onRouteEnter}
        page={page}
        {...props}
        animDelay={2}
        animKey={path}
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
