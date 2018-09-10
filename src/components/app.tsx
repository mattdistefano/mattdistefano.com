import { h, Component } from 'preact';
import { Router, RouterOnChangeArgs } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Match from 'preact-router/match';

import {
	HtmlMetaData,
	HttpError,
	getPage,
	getMetaData,
	isStale,
	isLoaded,
	PageCache
} from '../models';

import { restoreScroll, trackPageView, IS_BROWSER_ENV } from '../utils';

import { HomeRouteComponent } from '../routes/home';
import { PageRouteComponent } from '../routes/page';

import { AppState, onPageLoaded, onPageLoading, onPageLoadingFailed } from './app-state';
import { SiteHeaderComponent } from './site-header';
import { SiteFooterComponent } from './site-footer';
import { MetaProxyComponent } from './meta-proxy';

export interface AppProps {
	initialPageCache?: PageCache;
}

const getBlogArchiveComponent = () => import('../routes/blog-archive/index').then(m => {
	return m.BlogArchiveIndexPageComponent;
});

const getStyleGuideComponent = () => import('../routes/style-guide/index').then(m => {
	return m.StyleGuideRouteComponent;
});

export default class App extends Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state = {
			pageCache: props.initialPageCache || {},
		};
	}

	private _onMetaChange(meta: HtmlMetaData) {
		// TODO just move this into the state fns
		this.setState({
			...this.state,
			...meta
		});
	}

	private _loadPageData(path: string) {
		if (!IS_BROWSER_ENV) {
			return;
		}

		const page = this.state.pageCache[path];

		this._onMetaChange(getMetaData(page));

		if (isLoaded(page) && !isStale(page)) {
			return;
		}

		this.setState(onPageLoading(path, this.state));

		getPage(path)
			.then(loadedPage => {
				this.setState(onPageLoaded(loadedPage, this.state));
				this._onMetaChange(getMetaData(this.state.pageCache[path]));
			})
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

	private _onRouteChange = (e: RouterOnChangeArgs) => {
		if (process.env.NODE_ENV !== 'development') {
			trackPageView(e.url);
		}

		restoreScroll();

		if (e.current && 'pageCache' in e.current.attributes) {
			this._loadPageData(e.url);
		}
	};

	render() {
		return (
			<div class="site">
				<MetaProxyComponent description={this.state.description} title={this.state.title} />
				<Match
					path="/">
					{({ matches }) => matches ? null : <SiteHeaderComponent />}
				</Match>
				<main class="site-content">
					<Router onChange={this._onRouteChange}>
						<HomeRouteComponent
							path="/"
							pageCache={this.state.pageCache} />

						<AsyncRoute
							path="/style-guide/"
							getComponent={getStyleGuideComponent}
							pageCache={this.state.pageCache} />

						<AsyncRoute
							path="/blog/:year?/:month?/:day?/"
							getComponent={getBlogArchiveComponent}
							pageCache={this.state.pageCache} />

						<PageRouteComponent
							default
							pageCache={this.state.pageCache} />
					</Router>
				</main>
				<Match
					path="/">
					{({ matches }) => matches ? null : <SiteFooterComponent />}
				</Match>
			</div>
		);
	}
}
