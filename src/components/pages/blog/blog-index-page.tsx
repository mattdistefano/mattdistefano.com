import * as React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { IndexPage, PageSummary } from '@mattdistefano/site-generator';
import { AsyncData } from '../../../models';
import { PageContentComponent, PageCardListComponent } from '../../content';

export interface BlogIndexMatchParams {
  year?: string;
  month?: string;
  day?: string;
}

export interface BlogIndexPageProps {
  match: match<BlogIndexMatchParams>;
  page?: AsyncData<IndexPage | PageSummary>;
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
    return <div className="container text-center">Loading!</div>;
  }

  const pages =
    page.type === 'index' &&
    page.queries &&
    page.queries.recent &&
    page.queries.recent.results;

  const archivePages =
    page.type === 'index' &&
    page.queries &&
    page.queries.archive &&
    page.queries.archive.results.map(child => ({
      url: child.path,
      year: child.path.slice(-5, -1)
    }));

  return (
    <div className="blog-index-page container">
      <h1>{page.title}</h1>
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
