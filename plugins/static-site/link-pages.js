const createSummary = require('./create-summary');

module.exports = pages => {
  let last = null;
  for (let page of pages) {
    if (last) {
      last.prev = createSummary(page);
      page.next = createSummary(last);
    }
    last = page;
  }
};
