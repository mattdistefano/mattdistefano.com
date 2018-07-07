import { h } from 'preact';
import { Link } from 'preact-router';
import { PageSummary, Page, IndexPage } from '@mattdistefano/site-generator';
import { DateComponent } from './date';

export interface PageCardProps {
  page?: PageSummary | Page | IndexPage;
  class?: string;
  headingLevel?: number;
}

// tslint:disable-next-line:variable-name
export const PageCardComponent = (props: PageCardProps) => {
  const title = { __html: props.page.title };

  // tslint:disable-next-line:variable-name
  const Heading = `h${props.headingLevel || 2}`;

  return (
    <Link class="card card--link" href={props.page.path}>
      <Heading class="card__title" dangerouslySetInnerHTML={title} />
      <DateComponent class="card__date" date={props.page.created} />
      <p class="card__summary">{props.page.summary}</p>
    </Link>
  );
};
