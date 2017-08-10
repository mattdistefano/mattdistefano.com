const createSummary = require('./create-summary');
const sortPages = require('./sort-pages');

const empty = [];

const countSlashes = path => (path.match(/\//g) || empty).length;

const and = (a, b) => page => a(page) && b(page);

const prepQuery = (index, query) => {
  let predicate = page => true;

  if (query.type === 'index') {
    predicate = and(predicate, page => page.path.endsWith('/index'));
  } else if (query.type === 'page') {
    predicate = and(predicate, page => !page.path.endsWith('/index'));
  }

  if (query.root) {
    const root = query.root.endsWith('/') ? query.root : query.root + '/';

    predicate = and(predicate, page => page.path.startsWith(root));
  }

  if (query.depth) {
    predicate = and(predicate, page => countSlashes(page.path) === query.depth);
  }

  return pages => {
    let results = sortPages(pages.filter(predicate));

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results.map(createSummary);
  };
};

module.exports = (index, allPages) => {
  for (let key in index.queries) {
    index.queries[key].results = prepQuery(index, index.queries[key])(allPages);
  }
};
