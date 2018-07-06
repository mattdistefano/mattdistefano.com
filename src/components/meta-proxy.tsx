import { h, Component } from 'preact';

import {
	IS_BROWSER_ENV
} from '../utils';

import {
	HtmlMetaData,
} from '../models';

const getMetaDescription = () => {
	let descriptionElem = document.head.querySelector(
		'meta[name="description"]'
	) as HTMLMetaElement;

	if (!descriptionElem) {
		descriptionElem = document.createElement('meta');
		descriptionElem.setAttribute('name', 'description');
		document.head.appendChild(descriptionElem);
	}
	return descriptionElem;
}

export interface MetaProxyProps extends HtmlMetaData {

}

export const MetaProxyComponent = (props: MetaProxyProps) => {
	if (IS_BROWSER_ENV) {
		const descriptionElem = getMetaDescription();

		document.title = props.title;
		descriptionElem.content = props.description;
	}

	return null;
}
