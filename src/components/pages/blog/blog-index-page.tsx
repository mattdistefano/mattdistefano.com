import * as React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { IndexPage, AsyncData, PageSummary } from '../../../models';
import { PageContentComponent } from '../../page-content';
import { PageCardListComponent } from '../../page-card-list';

export interface BlogIndexMatchParams {
  year?: string;
  month?: string;
  day?: string;
}

export interface BlogIndexPageProps {
  match: match<BlogIndexMatchParams>;
  page?: AsyncData<IndexPage>;
}

const flattenAll = (page: IndexPage | PageSummary): PageSummary[] =>
  page.children.reduce((a, b) => {
    if (b.children.length > 0) {
      return a.concat(b.pages, flattenAll(b));
    }
    return a.concat(b.pages);
  }, [] as PageSummary[]);

// tslint:disable-next-line:variable-name
export const BlogIndexPageComponent = (props: BlogIndexPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  const pages =
    page.queries && page.queries.recent && page.queries.recent.results;

  const archivePages =
    page.queries &&
    page.queries.archive &&
    page.queries.archive.results.map(child => ({
      url: child.path.slice(0, -5),
      year: child.path.slice(-10, -6)
    }));

  return (
    <div className="blog-index-page">
      <PageContentComponent page={page} hideDate={true} />
      <PageCardListComponent pages={pages} />
      <h2>Archive</h2>
      {archivePages.map(p =>
        <Link to={p.url} className="button" key={p.year}>
          {p.year}
        </Link>
      )}
    </div>
  );
};
