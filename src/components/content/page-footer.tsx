import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@mattdistefano/site-generator';
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

  const prevPage =
    page.prev ||
    (page.queries && page.queries.prev && page.queries.prev.results[0]);

  const nextPage =
    page.next ||
    (page.queries && page.queries.next && page.queries.next.results[0]);

  const prev = prevPage ? (
    <div className="page-footer__item page-footer__prev">
      <h2 className="h4 page-footer__item-heading">Previously on...</h2>
      <PageCardComponent className="page-footer__card" page={prevPage} />
    </div>
  ) : null;

  const next = nextPage ? (
    <div className="page-footer__item page-footer__next">
      <h2 className="h4 page-footer__item-heading">Next on...</h2>
      <PageCardComponent className="page-footer__card" page={nextPage} />
    </div>
  ) : null;

  return (
    <div className="page-footer">
      {prev} {next}
    </div>
  );
};
