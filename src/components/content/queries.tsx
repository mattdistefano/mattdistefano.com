import * as React from 'react';
import { Queries, Query } from '@mattdistefano/site-generator';
import { PageCardListComponent } from './page-card-list';

export interface QueriesProps {
  queries: Queries;
}

interface QueryProps {
  title: string;
  query: Query;
}

// tslint:disable-next-line:variable-name
const QueryComponent = (props: QueryProps) =>
  props.query && props.query.results && props.query.results.length > 0 ? (
    <div>
      <h2 className="h3">{props.title}</h2>
      <PageCardListComponent pages={props.query.results} />
    </div>
  ) : null;

// tslint:disable-next-line:variable-name
export const QueriesComponent = (props: QueriesProps) => (
  <div>
    {props.queries ? (
      Object.keys(props.queries).map(key => (
        <QueryComponent title={key} query={props.queries[key]} key={key} />
      ))
    ) : null}
  </div>
);
