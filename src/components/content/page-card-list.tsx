import * as React from 'react';
import { PageSummary } from '@mattdistefano/site-generator';
import { PageCardComponent } from './page-card';

export interface PageCardListProps {
  pages: PageSummary[];
}

// tslint:disable-next-line:variable-name
export const PageCardListComponent = (props: PageCardListProps) =>
  props.pages ? (
    <ul className="card-list">
      {props.pages.map((page, index) => (
        <li className="card-list__item" key={index}>
          <PageCardComponent page={page} />
        </li>
      ))}
    </ul>
  ) : null;
