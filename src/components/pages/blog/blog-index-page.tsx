import * as React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { IndexPage, AsyncData, PageSummary } from '../../../models';
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
  if (!props.page || !props.page.data) {
    return <div>Loading!</div>;
  }

  // const pages = flattenAll(props.page.data)
  //   .sort((a, b) => b.created.localeCompare(a.created))
  //   .slice(0, 8);

  const pages =
    props.page.data.queries &&
    props.page.data.queries.recent &&
    props.page.data.queries.recent.results;

  const archivePages =
    props.page.data.queries &&
    props.page.data.queries.archive &&
    props.page.data.queries.archive.results.map(child => ({
      url: child.path.slice(0, -5),
      year: child.path.slice(-10, -6)
    }));

  return (
    <div className="standard-index-page">
      <h1>Recent blog posts</h1>
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
