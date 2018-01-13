import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@mattdistefano/site-generator';
import { DateComponent } from './date';
import { StaticContentComponent } from './static-content';

export interface PageContentProps {
  title?: string;
  summary?: string;
  created?: string;
  modified?: string;
  bannerUrl?: string;
  bannerAlt?: string;
  content?: string;
  className?: string;
  children?: JSX.Element;
}

export interface PageHeaderProps {
  title?: string;
  summary?: string;
  created?: string;
  modified?: string;
  bannerUrl?: string;
  bannerAlt?: string;
}

const hasRevisions = (created: string, modified: string) =>
  created && modified && created.slice(0, 10) !== modified.slice(0, 10);

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

  const created = props.created ? (
    <div className="page-header__date page-header__date-created">
      <span className="page-header__date-label">Published: </span>
      <DateComponent date={props.created} className="page-header__date-value" />
    </div>
  ) : null;

  const modified = hasRevisions(props.created, props.modified) ? (
    <div className="page-header__date page-header__date-modified">
      <span className="page-header__date-label">Revised: </span>
      <DateComponent
        date={props.modified}
        className="page-header__date-value"
      />
    </div>
  ) : null;

  const summary = props.summary ? (
    <p className="page-header__summary">{props.summary}</p>
  ) : null;

  return (
    <div className="page-header page-content__header">
      <h1 className="page-header__title" dangerouslySetInnerHTML={title} />
      {summary}
      {created}
      {modified}
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
