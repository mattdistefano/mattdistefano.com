import { h } from 'preact';
import { Link, RoutableProps } from 'preact-router';
import { Page, PageSummary, IndexPage } from '@mattdistefano/site-generator';
import { AsyncData, PageCache } from '../../models';

export interface HomeRouteProps extends RoutableProps {
  pageCache?: PageCache;
  url?: string;
}

const formatDate = (dateString: string) => dateString.slice(0, 10);

// tslint:disable-next-line:variable-name
export const HomeRouteComponent = (props: HomeRouteProps) => {
  const page = props.pageCache && props.pageCache[props.url] && props.pageCache[props.url].data;

  if (!page || page.type === 'summary') {
    return <div className="container">Loading!</div>;
  }

  const recentPosts = page.type === 'index' ? page.queries["Recent blog posts"] : null;

  const recentPostsComponent = recentPosts ? <div className="home__index animation-slide-fade-in animation-delay-3">
    <h2 className="h3 home__index-heading">recent</h2>
    <ul className="list-unstyled">
      {
        recentPosts && recentPosts.results.map(result => (
          <li className="home__index-item" key={result.path}>
            <Link href={result.path} className="home__index-link">
              {formatDate(result.created)} - {result.title}
            </Link>
          </li>
        ))
      }
    </ul>
  </div> : null;

  return (
    <div className="home">
      <h1 className="logo home__logo animation-slide-fade-in">mattdistefano</h1>
      <div className="home__about animation-slide-fade-in animation-delay-2">
        <h2 className="h3 home__about-heading">about</h2>
        <p className="home__about-content">
          I'm a web developer with 12 years of experience in the financial industry.
          I write about many aspects of web development,
          with a focus on modern frontend stacks, accessibility, and UX design.
        </p>
      </div>
      { recentPostsComponent }
    </div>
  );
};
