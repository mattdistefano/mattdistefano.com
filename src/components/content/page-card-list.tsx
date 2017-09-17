import * as React from 'react';
import { PageSummary } from '@mattdistefano/site-generator';
import { PageCardComponent } from './page-card';

export interface PageCardListProps {
  pages: PageSummary[];
}

// tslint:disable-next-line:variable-name
export const PageCardListComponent = (props: PageCardListProps) =>
  <ul className="list-unstyled page-card-list">
    {props.pages &&
      props.pages.map((page, index) =>
        <li className="page-card-list__item" key={index}>
          <PageCardComponent page={page} className="page-card-list__link" />
        </li>
      )}
  </ul>;
