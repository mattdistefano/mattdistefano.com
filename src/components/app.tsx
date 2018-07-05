import { h, Component } from 'preact';
import { Router, RouterOnChangeArgs } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Match from 'preact-router/match';

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
} from '../models';

import { restoreScroll, trackPageView, IS_BROWSER_ENV } from '../utils';

import { HomeRouteComponent } from '../routes/home';
import { PageRouteComponent } from '../routes/pages';

import { AppState, onPageLoaded, onPageLoading, onPageLoadingFailed } from './app-state';
import { SiteHeaderComponent } from './site-header';
import { SiteFooterComponent } from './site-footer';

export interface AppProps {
	onMeta?: (meta: HtmlMetaData) => void;
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

		if (IS_BROWSER_ENV) {
			// TODO move this elsewhere
			this._descriptionElem = document.head.querySelector(
				'meta[name="description"]'
			) as HTMLMetaElement;

			if (!this._descriptionElem) {
				this._descriptionElem = document.createElement('meta');
				this._descriptionElem.setAttribute('name', 'description');
				document.head.appendChild(this._descriptionElem);
			}
		}
	}

	private _onMetaChange(meta: HtmlMetaData) {
		if (!IS_BROWSER_ENV) {
			return;
		}

		document.title = meta.title;
		this._descriptionElem.content = meta.description;
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
