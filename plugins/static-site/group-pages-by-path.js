const path = require('path');

module.exports = pages => {
  const groups = {};
  for (let page of pages) {
    const dirName = path.dirname(page.path);
    if (groups[dirName]) {
      groups[dirName].push(page);
    } else {
      groups[dirName] = [page];
    }
  }
  return groups;
};
