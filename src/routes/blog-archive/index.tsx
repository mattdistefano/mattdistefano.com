import { h } from 'preact';
import { Link, RoutableProps } from 'preact-router';
import { IndexPage, PageSummary } from '@mattdistefano/site-generator';
import { formatDate, months } from '../../utils/format-date';
import { AsyncData, PageCache } from '../../models';
import { PageCardListComponent, PageHeaderComponent } from '../../components';

export interface BlogArchiveIndexPageProps extends RoutableProps {
  year?: string;
  month?: string;
  day?: string;
  pageCache?: PageCache;
  url?: string;
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
    <PageHeaderComponent
      title="Blog Archive"
      summary={props.title} />
    <div class="container animation-slide-fade-in animation-delay-2">
      <PageCardListComponent pages={props.pages} headingLevel={2} />
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
    <PageHeaderComponent
      title="Blog Archive"
      summary={props.title} />
    <div class="container animation-slide-fade-in animation-delay-2">
      <PageCardListComponent pages={props.pages} headingLevel={2} />
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
    <PageHeaderComponent
      title="Blog Archive"
      summary={`Archive for ${props.year}.`} />
    <div class="container animation-slide-fade-in animation-delay-2">
      {props.pages.map((page, idx) =>
        <PageCardListComponent pages={flattenChildren(page)} headingLevel={2} />
      )}
    </div>
  </div>
);

const componentForMatch = (props: BlogArchiveIndexPageProps) => {
  const page = props.pageCache && props.pageCache[props.url] && props.pageCache[props.url].data as IndexPage;

  if (props.day) {
    const pages = page.type === 'index' ? page.pages : null;

    const month = months[parseInt(props.month, 10) - 1];

    return (
      <BlogArchiveDayComponent
        title={`${month} ${props.day}, ${props.year}.`}
        pages={pages}
      />
    );
  }

  if (props.month) {
    const pages = page.type === 'index'
      ? flattenChildren(page)
      : null;

    const month = months[parseInt(props.month, 10) - 1];

    return (
      <BlogArchiveMonthComponent
        title={`${month}, ${props.year}.`}
        pages={pages}
      />
    );
  }

  if (props.year) {
    const pages = page.type === 'index' && page.children;

    return (
      <BlogArchiveYearComponent year={props.year} pages={pages} />
    );
  }

  const years = page.children.map(page => ({
    page,
    year: page.path.substr(props.url.length, 4)
  }));

  return (
    <div>
      <PageHeaderComponent
        title="Blog Archive"
        summary="Complete archive of posts." />

      <div class="container animation-slide-fade-in animation-delay-2">
        {
          years.map(year => (
            <div key={year.year}>
              <h2>{year.year}</h2>
              {year.page.children.map((childPage, idx) =>
                <PageCardListComponent pages={flattenChildren(childPage)} headingLevel={2} />
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
};

// tslint:disable-next-line:variable-name
export const BlogArchiveIndexPageComponent = (
  props: BlogArchiveIndexPageProps
) => {
  const page = props.pageCache && props.pageCache[props.url] && props.pageCache[props.url].data;

  if (!page || page.type === 'summary') {
    return <div class="container">Loading!</div>;
  }

  return componentForMatch(props);
};
