import * as React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate, months } from '../../../utils/format-date';
import { IndexPage, AsyncData, PageSummary } from '../../../models';
import { PageCardListComponent } from '../../page-card-list';

export interface BlogArchiveIndexMatchParams {
  year?: string;
  month?: string;
  day?: string;
}

export interface BlogArchiveIndexPageProps {
  match: match<BlogArchiveIndexMatchParams>;
  page?: AsyncData<IndexPage>;
}

const flattenChildren = (page: IndexPage | PageSummary) =>
  page.children.reduce((a, b) => a.concat(b.pages), [] as PageSummary[]);

// tslint:disable-next-line:variable-name
export const BlogArchiveIndexPageComponent = (
  props: BlogArchiveIndexPageProps
) => {
  if (!props.page || !props.page.data) {
    return <div>Loading!</div>;
  }

  if (props.match.params.day) {
    return (
      <div className="blog-archive-index-page">
        <div className="page-content fade-in">
          <h1 className="page-content__title">
            Blog posts on {props.match.params.year}/{props.match.params.month}/{props.match.params.day}
          </h1>
          <PageCardListComponent pages={props.page.data.pages} />
        </div>
      </div>
    );
  }

  const month = months[parseInt(props.match.params.month, 10) - 1];

  if (props.match.params.month) {
    const pages = flattenChildren(props.page.data);

    return (
      <div className="blog-archive-index-page">
        <div className="page-content fade-in">
          <h1 className="page-content__title">
            Blog posts in {month}, {props.match.params.year}
          </h1>
          <PageCardListComponent pages={pages} />
        </div>
      </div>
    );
  }

  if (props.match.params.year) {
    return (
      <div className="blog-archive-index-page">
        <div className="page-content fade-in">
          <h1 className="page-content__title">
            Blog posts in {props.match.params.year}
          </h1>
          {props.page.data.children.map((child, idx) => {
            const pages = flattenChildren(child);

            return (
              <div key={idx}>
                <h2>
                  {month}
                </h2>
                <PageCardListComponent pages={pages} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};
