import { IS_BROWSER_ENV } from './is-browser-env';

export const restoreScroll = () => {
	if (!IS_BROWSER_ENV) {
		return;
	}

	window.scroll({ top: 0, left: 0 });
}
