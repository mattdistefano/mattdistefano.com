const path = require('path');
const MarkdownIt = require('markdown-it');
const blockImagePlugin = require('markdown-it-block-image');
const prism = require('prismjs');
const matter = require('gray-matter');
const extractTitle = require('./extract-title');
const readFile = require('./fs/read-file');

const prismHighlighter = (str, lang) => {
  if (lang && prism.languages[lang]) {
    try {
      return prism.highlight(str, prism.languages[lang]);
    } catch (__) {}
  }

  return '';
};

const markdownItOptions = {
  highlight: prismHighlighter
};

const md = new MarkdownIt('commonmark', markdownItOptions);

md.use(blockImagePlugin, {
  outputContainer: 'div',
  containerClassName: 'image-container'
});

const toIsoDate = dateString => {
  const d = new Date(dateString);

  if (isNaN(d.getTime())) {
    throw 'Invalid date';
  }

  return d.toISOString();
};

module.exports = async (pagePath, basePath) => {
  //console.log(pagePath);
  const markdown = await readFile(pagePath);

  const fm = matter(markdown);

  const html = md.render(fm.content);

  const title = extractTitle(html);

  let created = fm.data.created;

  return Object.assign({}, fm.data, {
    path: `/${path.relative(basePath, pagePath).slice(0, -3)}`,
    titleText: title.titleText,
    titleHtml: title.titleHtml,
    content: title.html,
    created: fm.data.created && toIsoDate(fm.data.created),
    modified: fm.data.modified && toIsoDate(fm.data.modified)
  });
};
