import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@mattdistefano/site-generator';
import { DateComponent } from './date';
import { StaticContentComponent } from './static-content';

export interface PageContentProps {
  title?: string;
  summary?: string;
  date?: string;
  bannerUrl?: string;
  bannerAlt?: string;
  content?: string;
  className?: string;
  children?: JSX.Element;
}

export interface PageHeaderProps {
  title?: string;
  summary?: string;
  date?: string;
  bannerUrl?: string;
  bannerAlt?: string;
}

// tslint:disable-next-line:variable-name
const PageHeaderComponent = (props: PageHeaderProps) => {
  if (!props.title) {
    return null;
  }

  const title = { __html: props.title };

  const banner = props.bannerUrl ? (
    <div className="page-header__img-container">
      <img
        src={props.bannerUrl}
        alt={props.bannerAlt}
        className="page-header__img"
      />
      <div className="page-header__img-meta">{props.bannerAlt}</div>
    </div>
  ) : null;

  const date = props.date ? (
    <div className="page-header__date">
      <span className="page-header__date-label">Published: </span>
      <DateComponent date={props.date} className="page-header__date-value" />
    </div>
  ) : null;

  const summary = props.summary ? (
    <p className="page-header__summary">{props.summary}</p>
  ) : null;

  return (
    <div className="page-header page-content__header">
      <h1 className="page-header__title" dangerouslySetInnerHTML={title} />
      {summary}
      {date}
      {banner}
    </div>
  );
};

// tslint:disable-next-line:variable-name
export const PageContentComponent = (props: PageContentProps) => {
  if (!props.title) {
    return <div>{props.children}</div>;
  }

  const content = props.content ? (
    <StaticContentComponent
      className="page-content__body"
      html={props.content}
    />
  ) : null;

  return (
    <div className={`page-content ${props.className || ''}`}>
      <PageHeaderComponent {...props} />
      {content}
      {props.children}
    </div>
  );
};
