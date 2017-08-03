import * as React from 'react';
import { IndexPage, AsyncData } from '../../models';
import { PageContentComponent } from '../page-content';
import { PageCardListComponent } from '../page-card-list';

export interface HomePageProps {
  page: AsyncData<IndexPage>;
}

export const HomePageComponent = (props: HomePageProps) => {
  const page = props.page.data;

  const blogPosts =
    page &&
    page.children &&
    page.children.find(child => child.path === '/blog/index');

  return (
    <div className="home-page">
      <PageContentComponent page={page} hideDate={true} />
      <h2 className="h3">Recent blog posts...</h2>
      <PageCardListComponent pages={blogPosts && blogPosts.pages} />
    </div>
  );
};
