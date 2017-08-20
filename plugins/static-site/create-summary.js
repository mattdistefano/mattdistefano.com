module.exports = page => ({
  path: page.path,
  titleText: page.titleText,
  titleHtml: page.titleHtml,
  summary: page.summary,
  created: page.created,
  modified: page.modified,
  type: 'summary'
});
