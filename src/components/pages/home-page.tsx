import * as React from 'react';
import { IndexPage, AsyncData } from '../../models';
import { PageContentComponent } from '../page-content';
import { PageCardListComponent } from '../page-card-list';

export interface HomePageProps {
  page: AsyncData<IndexPage>;
}

// tslint:disable-next-line:variable-name
export const HomePageComponent = (props: HomePageProps) => {
  const page = props.page.data;

  const blogIndex =
    page &&
    page.children &&
    page.children.find(child => child.path === '/blog/index');

  const blogPosts = blogIndex && blogIndex.pages;

  return (
    <div className="home-page">
      <PageContentComponent page={page} hideDate={true} />
      <h2 className="h3">Recent blog posts...</h2>
      <PageCardListComponent pages={blogPosts} />
    </div>
  );
};
