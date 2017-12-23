import * as React from 'react';
import { Link } from 'react-router-dom';
import { PageSummary, Page, IndexPage } from '@mattdistefano/site-generator';
import { DateComponent } from './date';

export interface PageCardProps {
  page?: PageSummary | Page | IndexPage;
  className?: string;
  headingText?: string;
}

// tslint:disable-next-line:variable-name
export const PageCardComponent = (props: PageCardProps) => {
  const title = { __html: props.page.title };

  const heading = props.headingText ? (
    <h2 className="h4 card__heading">{props.headingText}</h2>
  ) : null;

  return (
    <Link className="card card--link" to={props.page.path}>
      {heading}
      <h3 className="card__title" dangerouslySetInnerHTML={title} />
      <DateComponent className="card__date" date={props.page.created} />
      <p className="card__summary">{props.page.summary}</p>
    </Link>
  );
};
