import { h } from 'preact';
import { RoutableProps } from 'preact-router';
import { PageCache } from '../../models';

import { RecentPostsComponent } from './recent-posts';

export interface HomeRouteProps extends RoutableProps {
  pageCache?: PageCache;
  url?: string;
}

// tslint:disable-next-line:variable-name
export const HomeRouteComponent = (props: HomeRouteProps) => {
  const page = props.pageCache && props.pageCache[props.url] && props.pageCache[props.url].data;

  const recentPosts = page && page.type === 'index' ? page.queries["Recent blog posts"] : null;

  return (
    <div class="home">
      <h1 class="logo home__logo">mattdistefano</h1>
      <div class="home__about animation-slide-fade-in animation-delay-2">
        <h2 class="h3 home__about-heading">about</h2>
        <p class="home__about-content">
          I'm a web developer with 12 years of experience in the financial industry.
          I write about many aspects of web development,
          with a focus on modern frontend stacks, accessibility, and UX design.
        </p>
      </div>
      <RecentPostsComponent posts={recentPosts && recentPosts.results} moreUrl={recentPosts && recentPosts.root} />
    </div>
  );
};
