const path = require('path');
const readDirRecursive = require('./fs/read-dir-recursive');
const readPage = require('./read-page');
const sortPages = require('./sort-pages');
const linkPages = require('./link-pages');
const createSummary = require('./create-summary');
const query = require('./query');

const indexPredicate = page => page.path.endsWith('/index');

const removeIndex = pages => {
  const indexIndex = pages.findIndex(indexPredicate);

  if (indexIndex !== -1) {
    return pages.splice(indexIndex, 1)[0];
  }

  return null;
};

const populateIndex = (index, pages, children) => {
  index.pages = index.skipPages ? null : pages.map(createSummary);

  index.children = index.skipChildren
    ? null
    : children.map(child => child.find(indexPredicate));
};

const processDir = async (dirPath, basePath) => {
  const dir = await readDirRecursive(dirPath);

  const files = await Promise.all(
    dir.files
      .filter(file => file.name.endsWith('.md'))
      .map(file => readPage(file.path, basePath))
  );

  const index = removeIndex(files) || {
    path: '/' + path.join(path.relative(basePath, dirPath), 'index')
  };

  sortPages(files);

  if (!index.linkRoot) {
    linkPages(files);
  }

  const folders = await Promise.all(
    dir.folders.map(folder => processDir(folder.path, basePath))
  );

  populateIndex(index, files, folders);

  const allPages = [index, ...files];

  folders.forEach(child => {
    allPages.push(...child);
  });

  if (index.linkRoot) {
    sortPages(allPages);
    linkPages(allPages.filter(page => !indexPredicate(page)));
  }

  return allPages;
};

module.exports = async dataPath => {
  const pages = await processDir(dataPath, dataPath);

  pages.filter(indexPredicate).forEach(index => {
    if (index.queries) {
      query(index, pages);
    }
  });

  return pages;
};
