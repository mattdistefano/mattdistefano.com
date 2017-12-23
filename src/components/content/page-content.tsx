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

// tslint:disable-next-line:variable-name
export const PageContentComponent = (props: PageContentProps) => {
  if (!props.title) {
    return <div>{props.children}</div>;
  }

  const title = { __html: props.title };

  if (!props.bannerUrl && !props.content) {
    return (
      <div className={`page-content ${props.className || ''}`}>
        <div className="page-header page-content__header">
          <h1 className="page-header__title" dangerouslySetInnerHTML={title} />
        </div>
      </div>
    );
  }

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

  return (
    <div className={`page-content ${props.className || ''}`}>
      <div className="page-header page-content__header">
        <h1 className="page-header__title" dangerouslySetInnerHTML={title} />
        <p className="page-header__summary">{props.summary}</p>
        <div className="page-header__date">
          <span className="page-header__date-label">Published: </span>
          <DateComponent
            date={props.date}
            className="page-header__date-value"
          />
        </div>
        {banner}
      </div>
      {props.content ? (
        <StaticContentComponent
          className="page-content__body"
          html={props.content}
        />
      ) : null}
      {props.children}
    </div>
  );
};
