import * as React from 'react';
import { Component, ComponentType } from 'react';
import { Route, RouteProps, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import { IndexPage, Page, PageSummary } from '@mattdistefano/site-generator';

import {
  HtmlMetaData,
  AsyncData,
  PageCache,
  HttpError,
  getPage,
  getMetaData,
  isStale,
  isLoaded
} from '../../models';

import { SiteFooterComponent } from './site-footer';

import {
  StandardPageComponent,
  StandardPageProps,
  BlogArchiveIndexPageComponent,
  HomePageComponent,
} from '../pages';

import { IS_BROWSER_ENV } from '../../utils';

import { wrapPageComponent, WrappedProps } from './wrap-page-component';

import {
  AppState,
  onPageLoaded,
  onPageLoading,
  onPageLoadingFailed
} from './app-state';

// tslint:disable:variable-name
const WrappedStandardPage = wrapPageComponent(StandardPageComponent);

const WrappedBlogArchiveIndexPageComponent = wrapPageComponent(
  BlogArchiveIndexPageComponent
);

const WrappedHomePageComponent = wrapPageComponent(HomePageComponent);

// tslint:enable:variable-name

export interface AppProps {
  initialPageCache?: PageCache;
  onMeta?: (meta: HtmlMetaData) => void;
}

export class AppComponent extends Component<AppProps, AppState> {
  private _lastPath: string;

  constructor(props: AppProps) {
    super(props);

    // TODO autobind
    this._onRouteEnter = this._onRouteEnter.bind(this);

    this.state = {
      pageCache: props.initialPageCache || {}
    };
  }

  private _trackPageView(page: AsyncData<Page | IndexPage | PageSummary>) {
    if (!IS_BROWSER_ENV) {
      return;
    }

    ga('set', 'page', page.path);
    ga('send', 'pageview');
  }

  private _restoreScroll() {
    if (!IS_BROWSER_ENV) {
      return;
    }

    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
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
        animDelay={1}
        animKey={path}
      />
    );
  }

  render() {
    return (
      <div className="site">
        <header className="site-header">
          <Link to="/" className="site-header__link">
            <span className="site-header__first">matt</span>distefano.com
          </Link>
        </header>

        <main className="site-main">
          <Switch>
          <Route
              path="/"
              exact
              render={props =>
                this._renderPage(WrappedHomePageComponent, props)
              }
            />
            <Route
              path="/blog/:year?/:month?/:day?/"
              exact
              render={props =>
                this._renderPage(WrappedBlogArchiveIndexPageComponent, props)
              }
            />
            <Route
              path="*"
              render={props => this._renderPage(WrappedStandardPage, props)}
            />
          </Switch>
        </main>
        <SiteFooterComponent />
      </div>
    );
  }
}
