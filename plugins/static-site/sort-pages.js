const path = require('path');

module.exports = pages =>
  pages.sort((a, b) => {
    const aBaseName = path.basename(a.path);
    const bBaseName = path.basename(b.path);

    if (aBaseName === 'index') {
      return bBaseName === 'index' ? 0 : -1;
    }
    if (bBaseName === 'index') {
      return 1;
    }
    if (a.created && b.created && a.created !== b.created) {
      return b.created.localeCompare(a.created);
    }
    return b.path.localeCompare(a.path);
  });
