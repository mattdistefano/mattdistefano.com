import * as React from 'react';
import { IndexPage, AsyncData } from '../../models';
import { PageCardListComponent } from '../page-card-list';

export interface HomePageProps {
  page: AsyncData<IndexPage>;
}

export const HomePageComponent = (props: HomePageProps) => {
  const blogPosts =
    props.page.data &&
    props.page.data.children.find(child => child.path === '/blog/index');

  return (
    <div className="home-page">
      <h1 className="sr-only">mattdistefano.com home</h1>
      <h2 className="home-page__heading h1">Recent blog posts..</h2>
      <PageCardListComponent pages={blogPosts && blogPosts.pages} />
    </div>
  );
};
