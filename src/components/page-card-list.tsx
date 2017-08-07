import * as React from 'react';
import { PageSummary } from '../models';
import { PageCardComponent } from './page-card';

export interface PageCardListProps {
  pages: PageSummary[];
}

// tslint:disable-next-line:variable-name
export const PageCardListComponent = (props: PageCardListProps) =>
  <div className="fade-in">
    <ul className="list-unstyled page-card-list">
      {props.pages &&
        props.pages.map((page, index) =>
          <li className="page-card-list__item" key={index}>
            <PageCardComponent page={page} className="page-card-list__link" />
          </li>
        )}
    </ul>
  </div>;
