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
	isLoaded
} from '../models';

import { restoreScroll, trackPageView, IS_BROWSER_ENV } from '../utils';

import { HomeRouteComponent } from '../routes/home';
import { PageRouteComponent } from '../routes/page';

import { AppState, onPageLoaded, onPageLoading, onPageLoadingFailed } from './app-state';
import { SiteHeaderComponent } from './site-header';
import { SiteFooterComponent } from './site-footer';
import { MetaProxyComponent } from './meta-proxy';

export interface AppProps {

}

const getBlogArchiveComponent = () => import('../routes/blog-archive/index').then(m => {
	return m.BlogArchiveIndexPageComponent;
});

const getStyleGuideComponent = () => import('../routes/style-guide/index').then(m => {
	return m.StyleGuideRouteComponent;
});

export default class App extends Component<AppProps, AppState> {
	private _descriptionElem: HTMLMetaElement;

	constructor(props: AppProps) {
		super(props);

		this.state = {
			pageCache: {},
		};
	}

	private _onMetaChange(meta: HtmlMetaData) {
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

		if (page) {
			this._onMetaChange(getMetaData(page));
		}

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
		trackPageView(e.url);
		restoreScroll();

		if (e.current && 'pageCache' in e.current.attributes) {
			this._loadPageData(e.url);
		}
	};

	render() {
		return (
			<div id="app">
				<MetaProxyComponent description={this.state.description} title={this.state.title} />
				<Match
					path="/">
					{({ matches }) => matches ? null : <SiteHeaderComponent />}
				</Match>
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
				<Match
					path="/">
					{({ matches }) => matches ? null : <SiteFooterComponent />}
				</Match>
			</div>
		);
	}
}
