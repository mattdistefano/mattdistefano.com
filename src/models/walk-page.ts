import { Page } from './page';
import { IndexPage } from './index-page';
import { PageSummary } from './page-summary';

type walkPageOnItem = (item: Page | IndexPage | PageSummary) => void;

const visitDescendants = (
  itemWithDescendants: IndexPage | PageSummary,
  onItem: walkPageOnItem
) => {
  if (itemWithDescendants.pages) {
    itemWithDescendants.pages.forEach(item => {
      visitDescendants(item, onItem);
      onItem(item);
    });
  }
  if (itemWithDescendants.children) {
    itemWithDescendants.children.forEach(item => {
      visitDescendants(item, onItem);
      onItem(item);
    });
  }
};

const visitQueries = (page: IndexPage, onItem: walkPageOnItem) => {
  if (page.queries) {
    Object.keys(page.queries).forEach(key =>
      page.queries[key].results.forEach(item => {
        visitDescendants(item, onItem);
        onItem(item);
      })
    );
  }
};

const visitPage = (page: Page, onItem: walkPageOnItem) => {
  if (page.next) {
    visitDescendants(page.next, onItem);
    onItem(page.next);
  }
  if (page.prev) {
    visitDescendants(page.prev, onItem);
    onItem(page.prev);
  }
};

export const walkPage = (
  root: Page | IndexPage | PageSummary,
  onItem: walkPageOnItem
) => {
  if (root.type === 'index' || root.type === 'summary') {
    visitDescendants(root, onItem);
    if (root.type === 'index') {
      visitQueries(root, onItem);
    }
  } else {
    visitPage(root, onItem);
  }
  onItem(root);

  // purely for chaining purposes
  return root;
};
