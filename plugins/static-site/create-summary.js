module.exports = page => ({
  path: page.path,
  title: page.title,
  summary: page.summary,
  created: page.created,
  modified: page.modified,
  type: 'summary'
});
