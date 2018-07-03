import * as React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { IndexPage, PageSummary } from '@mattdistefano/site-generator';
import { formatDate, months } from '../../../utils/format-date';
import { AsyncData } from '../../../models';
import { PageContentComponent, PageCardListComponent } from '../../content';

export interface BlogArchiveIndexMatchParams {
  year?: string;
  month?: string;
  day?: string;
}

export interface BlogArchiveIndexPageProps {
  match: match<BlogArchiveIndexMatchParams>;
  page?: AsyncData<IndexPage | PageSummary>;
}

const flattenChildren = (page: IndexPage | PageSummary) =>
  page.children.reduce((a, b) => a.concat(b.pages), [] as PageSummary[]);

interface BlogArchiveDayProps {
  title: string;
  pages: PageSummary[];
}

// tslint:disable-next-line:variable-name
const BlogArchiveDayComponent = (props: BlogArchiveDayProps) => (
  <div>
    <div className="page__header">
      <div className="container animation-slide-fade-in animation-delay-1">
        <h1 className="page__title">Blog Archive</h1>
        <p className="page__summary">{props.title}</p>
      </div>
    </div>
    <div className="container animation-slide-fade-in animation-delay-2">
      <PageCardListComponent pages={props.pages} headingLevel={3} />
    </div>
  </div>
);

interface BlogArchiveMonthProps {
  title: string;
  pages: PageSummary[];
}

// tslint:disable-next-line:variable-name
const BlogArchiveMonthComponent = (props: BlogArchiveMonthProps) => (
  <div>
    <div className="page__header">
      <div className="container animation-slide-fade-in animation-delay-1">
        <h1 className="page__title">Blog Archive</h1>
        <p className="page__summary">{props.title}</p>
      </div>
    </div>
    <div className="container animation-slide-fade-in animation-delay-2">
      <PageCardListComponent pages={props.pages} headingLevel={3} />
    </div>
  </div>
);

interface BlogArchiveYearProps {
  year: string;
  pages: PageSummary[];
}

// tslint:disable-next-line:variable-name
const BlogArchiveYearComponent = (props: BlogArchiveYearProps) => (
  <div>
    <div className="page__header">
      <div className="container animation-slide-fade-in animation-delay-1">
        <h1 className="page__title">Blog Archive</h1>
        <p className="page__summary">Archive for {props.year}</p>
      </div>
    </div>
    <div className="container animation-slide-fade-in animation-delay-2">
      {props.pages.map((page, idx) => {
        const monthPath = page.path.substr(11, 2);

        const month = months[parseInt(monthPath, 10) - 1];

        return (
          <PageCardListComponent key={idx} pages={flattenChildren(page)} headingLevel={3} />
        );
      })}
    </div>
  </div>
);

const componentForMatch = (props: BlogArchiveIndexPageProps) => {
  if (props.match.params.day) {
    const pages =
      props.page.data.type === 'index' ? props.page.data.pages : null;

    const month = months[parseInt(props.match.params.month, 10) - 1];

    return (
      <BlogArchiveDayComponent
        title={`${month} ${props.match.params.day}, ${props.match.params.year}`}
        pages={pages}
      />
    );
  }

  if (props.match.params.month) {
    const pages =
      props.page.data.type === 'index'
        ? flattenChildren(props.page.data)
        : null;

    const month = months[parseInt(props.match.params.month, 10) - 1];

    return (
      <BlogArchiveMonthComponent
        title={`${month}, ${props.match.params.year}`}
        pages={pages}
      />
    );
  }

  if (props.match.params.year) {
    const pages = props.page.data.type === 'index' && props.page.data.children;

    return (
      <BlogArchiveYearComponent year={props.match.params.year} pages={pages} />
    );
  }

  return (
    <div>
      {props.page.data.type === 'index' &&
        props.page.data.children.map(page => (
          <BlogArchiveYearComponent
            year={page.path.substr(props.match.url.length, 4)}
            pages={page.children}
            key={page.path}
          />
        ))}
    </div>
  );
};

// tslint:disable-next-line:variable-name
export const BlogArchiveIndexPageComponent = (
  props: BlogArchiveIndexPageProps
) => {
  if (!props.page || !props.page.data) {
    return <div className="container text-center">Loading!</div>;
  }

  return (
    <div className="blog-archive-index-page">
      {componentForMatch(props)}
    </div>
  );
};
