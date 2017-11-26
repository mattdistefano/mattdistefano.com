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
    <div className="card-list__item">
      <PageCardComponent page={prevPage} headingText="Previous..." />
    </div>
  ) : null;

  const next = nextPage ? (
    <div className="card-list__item">
      <PageCardComponent page={nextPage} headingText="Next..." />
    </div>
  ) : null;

  return (
    <footer className="card-list">
      {prev} {next}
    </footer>
  );
};
