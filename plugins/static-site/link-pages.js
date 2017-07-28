const createSummary = require('./create-summary');

module.exports = pages => {
  let last = null;
  for (page of pages) {
    if (last) {
      last.next = createSummary(page);
      page.prev = createSummary(last);
    }
    last = page;
  }
};
