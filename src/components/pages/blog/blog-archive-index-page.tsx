import * as React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate, months } from '../../../utils/format-date';
import { IndexPage, AsyncData, PageSummary } from '../../../models';
import { PageContentComponent } from '../../page-content';
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
    const title = `Blog posts on ${props.match.params.year}/${props.match.params
      .month}/${props.match.params.day}`;

    return (
      <div className="blog-archive-index-page">
        <PageContentComponent title={title} />
        <PageCardListComponent pages={props.page.data.pages} />
      </div>
    );
  }

  if (props.match.params.month) {
    const month = months[parseInt(props.match.params.month, 10) - 1];

    const pages = flattenChildren(props.page.data);

    const title = `Blog posts in ${month}, ${props.match.params.year}`;

    return (
      <div className="blog-archive-index-page">
        <PageContentComponent title={title} />
        <PageCardListComponent pages={props.page.data.pages} />
      </div>
    );
  }

  if (props.match.params.year) {
    const title = `Blog posts in ${props.match.params.year}`;

    return (
      <div className="blog-archive-index-page">
        <PageContentComponent title={title} />
        {props.page.data.children.map((child, idx) => {
          const monthPath = child.path.slice(
            props.page.data.path.length,
            -1
          );

          const month = months[parseInt(monthPath, 10) - 1];

          return (
            <div key={idx}>
              <h2>
                {month}, {props.match.params.year}
              </h2>
              <PageCardListComponent pages={flattenChildren(child)} />
            </div>
          );
        })}
      </div>
    );
  }
};
