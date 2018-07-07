import { h } from 'preact';
import { Link } from 'preact-router';
import { Queries, Query } from '@mattdistefano/site-generator';
import { PageCardListComponent } from './page-card-list';

export interface QueriesProps {
  queries: Queries;
}

interface QueryProps {
  title: string;
  query: Query;
  key?: string;
}

// tslint:disable-next-line:variable-name
const QueryComponent = (props: QueryProps) =>
  props.query && props.query.results && props.query.results.length > 0 ? (
    <div class="query">
      <h2 class="h3">{props.title}</h2>
      <PageCardListComponent pages={props.query.results} headingLevel={3} />
      <div class="query__more">
        {props.query.linkText && (
          <Link
            class="button"
            href={props.query.root || props.query.path}
          >
            {props.query.linkText}
          </Link>
        )}
      </div>
    </div>
  ) : null;

// tslint:disable-next-line:variable-name
export const QueriesComponent = (props: QueriesProps) => (
  <div class="container">
    {props.queries
      ? Object.keys(props.queries).map(key => (
        <QueryComponent title={key} query={props.queries[key]} key={key} />
      ))
      : null}
  </div>
);
