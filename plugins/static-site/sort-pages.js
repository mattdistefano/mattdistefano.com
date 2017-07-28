const path = require('path');

module.exports = pages =>
  pages.sort((a, b) => {
    const aBaseName = path.basename(a.path);
    const bBaseName = path.basename(b.path);

    if (aBaseName === 'index') {
      return path.basename(b.path) === 'index' ? 0 : -1;
    }
    if (bBaseName === 'index') {
      return 1;
    }
    if (a.created && b.created) {
      return a.created.localeCompare(b.created);
    }
    return a.path.localeCompare(b.path);
  });
