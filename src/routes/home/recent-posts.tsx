import { h } from 'preact';
import { Link } from 'preact-router';
import { PageSummary, Page, IndexPage } from '@mattdistefano/site-generator';

export interface RecentPostsProps {
  posts?: Array<PageSummary | Page | IndexPage>;
}

const formatDate = (dateString: string) => dateString.slice(0, 10);

// tslint:disable-next-line:variable-name
export const RecentPostsComponent = (props: RecentPostsProps) => {
  // TODO orchestrate animation delay

  return <div className="home__index animation-slide-fade-in animation-delay-3">
    <h2 className="h3 home__index-heading">recent</h2>
    <ul className="list-unstyled">
      {
        props.posts && props.posts.map(result => (
          <li className="home__index-item" key={result.path}>
            <Link href={result.path} className="home__index-link">
              {formatDate(result.created)} - {result.title}
            </Link>
          </li>
        ))
      }
    </ul>
  </div>
};
