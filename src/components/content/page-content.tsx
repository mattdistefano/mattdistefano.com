import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@mattdistefano/site-generator';
import { DateComponent } from './date';

export interface PageContentProps {
  title?: string;
  date?: string;
  bannerUrl?: string;
  bannerAlt?: string;
  content?: string;
  className?: string;
  children?: JSX.Element;
}

// tslint:disable-next-line:variable-name
export const PageContentComponent = (props: PageContentProps) => {
  if (!props.title) {
    return <div>{props.children}</div>;
  }

  const title = { __html: props.title };

  if (!props.bannerUrl && !props.content) {
    return <h1 dangerouslySetInnerHTML={title}></h1>;
  }

  const content = { __html: props.content };

  const banner = props.bannerUrl ? (
    <div>
      <img src={props.bannerUrl} alt={props.bannerAlt} className="page-header__img" />
      <div className="page-header__img-meta">{props.bannerAlt}</div>
    </div>
  ) : null;

  return (
    <div className={`page-content ${props.className || ''}`}>
      <div className="page-header">
        <h1 className="page-title">
          <DateComponent date={props.date} className="page-title__date" />
          <span dangerouslySetInnerHTML={title} />
        </h1>
        {banner}
      </div>
      {content.__html ? (
        <div className="page-content__body" dangerouslySetInnerHTML={content} />
      ) : null}
      {props.children}
    </div>
  );
};
