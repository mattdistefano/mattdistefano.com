import * as React from 'react';
import { Link } from 'react-router-dom';
import { PageSummary } from '@mattdistefano/site-generator';
import { DateComponent } from './date';

export interface PageCardProps {
  page?: PageSummary;
  className?: string;
  headingText?: string;
}

// tslint:disable-next-line:variable-name
export const PageCardComponent = (props: PageCardProps) => {
  const title = { __html: props.page.title };

  const heading = props.headingText ? (
    <h2 className="h4">{props.headingText}</h2>
  ) : null;

  const banner = props.page.bannerUrl ? (
    <div
      className="card__image"
      style={{ backgroundImage: `url(${props.page.bannerUrl})` }}
    >
      <span className="sr-only">{props.page.bannerAlt}></span>
    </div>
  ) : null;

  return (
    <Link className="card card--link" to={props.page.path}>
      {heading}
      <div className="page-header card__header">
        <h3 className="page-title page-title--small">
          <DateComponent date={props.page.created} className="date--small page-title__date" />
          <span dangerouslySetInnerHTML={title} />
        </h3>
        {banner}
      </div>
      <p className="card__summary">{props.page.summary}</p>
    </Link>
  );
};
