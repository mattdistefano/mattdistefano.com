import { h } from 'preact';
import { PageSummary, Page, IndexPage } from '@mattdistefano/site-generator';
import { PageCardComponent } from './page-card';

export interface PageCardListProps {
  pages: Array<PageSummary | Page | IndexPage>;
  headingLevel?: number;
}

// tslint:disable-next-line:variable-name
export const PageCardListComponent = (props: PageCardListProps) =>
  props.pages ? (
    <div className="container">
      <ul className="card-list">
        {props.pages.map((page, index) => (
          <li className="card-list__item" key={index}>
            <PageCardComponent page={page} headingLevel={props.headingLevel} />
          </li>
        ))}
      </ul>
    </div>
  ) : null;
