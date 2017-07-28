const path = require('path');
const createSummary = require('./create-summary');

module.exports = (pages, basePath) => {
  let index = pages.find(page => path.basename(page.path) === 'index');

  if (!index) {
    index = {
      path: path.join(basePath, 'index')
    };
    pages.push(index);
  }

  const siblings =
    typeof index.pagesLimit === 'number'
      ? pages.slice(0, index.pagesLimit)
      : pages;

  index.pages = siblings
    .filter(sibling => sibling !== index)
    .map(createSummary);
};
