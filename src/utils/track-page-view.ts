import { IS_BROWSER_ENV } from './is-browser-env';

export const trackPageView = (url: string) => {
	if (!IS_BROWSER_ENV || !window['ga']) {
		return;
	}

	ga('set', 'page', url);
	ga('send', 'pageview');
};
