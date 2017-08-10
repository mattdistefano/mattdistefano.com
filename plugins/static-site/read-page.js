const path = require('path');
const MarkdownIt = require('markdown-it');
const blockImagePlugin = require('markdown-it-block-image');
const prism = require('prismjs');
const matter = require('gray-matter');
const extractTitle = require('./extract-title');
const readFile = require('./fs/read-file');
const stat = require('./fs/stat');

const prismHighlighter = (str, lang) => {
  if (lang && prism.languages[lang]) {
    try {
      return prism.highlight(str, prism.languages[lang]);
    } catch (__) {}
  }

  return '';
};

const markdownItOptions = {
  // highlight: prismHighlighter
};

const md = new MarkdownIt('commonmark', markdownItOptions);

md.use(blockImagePlugin, {
  outputContainer: 'div',
  containerClassName: 'image-container'
});

const toIsoDate = dateString => {
  const d = new Date(dateString);

  if (isNaN(d.getTime())) {
    return null;
  }

  return d.toISOString();
};

module.exports = async (pagePath, basePath) => {
  const stats = await stat(pagePath);

  const markdown = await readFile(pagePath);

  const fm = matter(markdown);

  const { titleHtml, titleText, html: content } = extractTitle(
    md.render(fm.content)
  );

  const created = toIsoDate(fm.data.created) || toIsoDate(stats.ctime);

  const modified = toIsoDate(fm.data.modified) || toIsoDate(stats.mtime);

  return Object.assign({}, fm.data, {
    path: `/${path.relative(basePath, pagePath).slice(0, -3)}`,
    titleText: titleText && titleText.trim(),
    titleHtml: titleHtml && titleHtml.trim(),
    content: content && content.trim(),
    created,
    modified
  });
};
