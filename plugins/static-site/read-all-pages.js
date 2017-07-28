const globMarkdown = require('./glob-markdown');
const readPage = require('./read-page');

module.exports = async dataPath =>
  Promise.all(
    (await globMarkdown(dataPath)).map(page => readPage(page, dataPath))
  );
