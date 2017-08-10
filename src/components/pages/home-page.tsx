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

  const blogPosts =
    page && page.queries && page.queries.blog && page.queries.blog.results;

  return (
    <div className="home-page">
      <PageContentComponent page={page} hideDate={true} />
      <h2 className="h3">Recent blog posts...</h2>
      <PageCardListComponent pages={blogPosts} />
    </div>
  );
};
