import { h } from 'preact';
import { Link } from 'preact-router';
import { PageSummary, Page, IndexPage } from '@mattdistefano/site-generator';
import { DateComponent } from './date';

export interface PageCardProps {
  page?: PageSummary | Page | IndexPage;
  className?: string;
  headingLevel?: number;
}

// tslint:disable-next-line:variable-name
export const PageCardComponent = (props: PageCardProps) => {
  const title = { __html: props.page.title };

  // tslint:disable-next-line:variable-name
  const Heading = `h${props.headingLevel || 2}`;

  return (
    <Link className="card card--link" href={props.page.path}>
      <Heading className="card__title" dangerouslySetInnerHTML={title} />
      <DateComponent className="card__date" date={props.page.created} />
      <p className="card__summary">{props.page.summary}</p>
    </Link>
  );
};
