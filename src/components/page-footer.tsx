import { h } from 'preact';
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

  // TODO components
  const prev = prevPage ? (
    <div class="card-list__item">
      <h2 class="h4 card-list__item-heading">Previous...</h2>
      <PageCardComponent page={prevPage} headingLevel={3} />
    </div>
  ) : null;

  const next = nextPage ? (
    <div class="card-list__item">
      <h2 class="h4 card-list__item-heading">Next...</h2>
      <PageCardComponent page={nextPage} headingLevel={3} />
    </div>
  ) : null;

  if (!next && !prev) {
    return null;
  }

  return (
    <div class="container">
      <div class="card-list">
        {prev} {next}
      </div>
    </div>
  );
};
