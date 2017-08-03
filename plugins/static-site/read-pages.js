const path = require('path');
const readDirRecursive = require('./fs/read-dir-recursive');
const readPage = require('./read-page');
const sortPages = require('./sort-pages');
const linkPages = require('./link-pages');
const createSummary = require('./create-summary');

const indexPredicate = page => page.path.endsWith('/index');

const removeIndex = pages => {
  const indexIndex = pages.findIndex(indexPredicate);

  if (indexIndex !== -1) {
    return pages.splice(indexIndex, 0)[0];
  }

  return null;
};

const populateIndex = (index, pages, children) => {
  const pagesSelection =
    typeof index.pagesLimit === 'number'
      ? pages.slice(0, index.pagesLimit)
      : pages;

  index.pages = pagesSelection.map(createSummary);

  index.children = children.map(child => child.find(indexPredicate));
};

const processDir = async (dirPath, basePath) => {
  const dir = await readDirRecursive(dirPath);

  const files = await Promise.all(
    dir.files
      .filter(file => file.name.endsWith('.md'))
      .map(file => readPage(file.path, basePath))
  );

  const folders = await Promise.all(
    dir.folders.map(folder => processDir(folder.path, basePath))
  );

  const index = removeIndex(files) || {
    path: '/' + path.join(path.relative(basePath, dirPath), 'index')
  };

  sortPages(files);

  linkPages(files);

  populateIndex(index, files, folders);

  const allPages = [index, ...files];

  folders.forEach(child => {
    allPages.push(...child);
  });

  return allPages;
};

module.exports = async dataPath => await processDir(dataPath, dataPath);
