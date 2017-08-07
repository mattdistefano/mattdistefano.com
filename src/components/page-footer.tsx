import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../models';
import { PageCardComponent } from './page-card';

export interface PageFooterProps {
  page?: Page;
}

// tslint:disable-next-line:variable-name
export const PageFooterComponent = (props: PageFooterProps) => {
  const page = props.page;

  if (!page) {
    return null;
  }

  const prev = page.prev
    ? <div className="page-footer__item page-footer__prev">
        <h2 className="h4 page-footer__item-heading">Previously on...</h2>
        <PageCardComponent className="page-footer__card" page={page.prev} />
      </div>
    : null;

  const next = page.next
    ? <div className="page-footer__item page-footer__next">
        <h2 className="h4 page-footer__item-heading">Next on...</h2>
        <PageCardComponent className="page-footer__card" page={page.next} />
      </div>
    : null;

  return (
    <div className="page-footer">
      {prev} {next}
    </div>
  );
};
