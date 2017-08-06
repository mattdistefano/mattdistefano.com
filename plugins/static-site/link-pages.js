const createSummary = require('./create-summary');

module.exports = pages => {
  let last = null;
  for (let page of pages) {
    if (last) {
      last.next = createSummary(page);
      page.prev = createSummary(last);
    }
    last = page;
  }
};
