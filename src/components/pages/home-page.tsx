import * as React from 'react';
import { IndexPage, AsyncData } from '../../models';
import { PageContentComponent } from '../page-content';
import { PageCardListComponent } from '../page-card-list';

export interface HomePageProps {
  page: AsyncData<IndexPage>;
}

// tslint:disable-next-line:variable-name
export const HomePageComponent = (props: HomePageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  const blogPosts =
    page && page.queries && page.queries.blog && page.queries.blog.results;

  return (
    <div className="home-page">
      <PageContentComponent title={page.titleHtml} content={page.content} />
      <h2 className="h3">Recent blog posts...</h2>
      <PageCardListComponent pages={blogPosts} />
    </div>
  );
};
