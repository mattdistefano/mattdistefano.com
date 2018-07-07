import { h } from 'preact';
import { Link } from 'preact-router';
import { PageSummary, Page, IndexPage } from '@mattdistefano/site-generator';

export interface RecentPostsProps {
  posts?: Array<PageSummary | Page | IndexPage>;
  moreUrl?: string;
}

const formatDate = (dateString: string) => dateString.slice(0, 10);

// tslint:disable-next-line:variable-name
export const RecentPostsComponent = (props: RecentPostsProps) => {
  // TODO orchestrate animation delay

  return <div class="home__index animation-slide-fade-in animation-delay-3">
    <h2 class="h3 home__index-heading">recent</h2>
    <ul class="list-unstyled">
      {
        props.posts && props.posts.map(result => (
          <li class="home__index-item" key={result.path}>
            <Link href={result.path} class="link-muted">
              {formatDate(result.created)} - {result.title}
            </Link>
          </li>
        ))
      }
      <li class="home__index-item">
        <Link href={props.moreUrl} class="link-muted">
          More posts...
        </Link>
      </li>
    </ul>
  </div>
};
