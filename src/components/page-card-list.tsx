import * as React from 'react';
import { PageSummary } from '../models';
import { PageCardComponent } from './page-card';

export interface PageCardListProps {
  pages: PageSummary[];
}

export const PageCardListComponent = (props: PageCardListProps) =>
  <div>
    <div className="page-card-list">
      {props.pages &&
        props.pages.map((page, index) =>
          <PageCardComponent page={page} key={index} />
        )}
    </div>
  </div>;
