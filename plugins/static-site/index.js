const path = require('path');

const readAllPages = require('./read-all-pages');
const groupPagesByPath = require('./group-pages-by-path');
const generateIndex = require('./generate-index');
const linkPages = require('./link-pages');
const sortPages = require('./sort-pages');
const toJsonAsset = require('./to-json-asset');
const createSummary = require('./create-summary');

const countWhacks = p => (p.match(/\//g) || []).length;

class WebpackStaticSitePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const absDataPath = path.resolve(
      compiler.options.context,
      this.options.dataPath
    );

    compiler.plugin('emit', async (compilation, done) => {
      const groupedPages = groupPagesByPath(await readAllPages(absDataPath));
      const topLevelChildren = [];
      let homePage = null;

      for (let groupName in groupedPages) {
        const group = groupedPages[groupName];

        sortPages(group);
        linkPages(group);
        generateIndex(group, groupName);

        // TODO this is ugly and dumb and needs to be reworked
        // probably should just walk the fs tree manually vs. globing/grouping
        // and build a structure like this for every index page
        if (countWhacks(groupName) === 1) {
          topLevelChildren.push({
            path: groupName,
            children: group
              .filter(page => !page.path.endsWith('/index'))
              .slice(0, 6)
              .map(createSummary)
          });
        }

        for (let page of group) {
          if (page.path === '/index') {
            homePage = page;
          } else {
            compilation.assets[page.path.slice(1) + '.json'] = toJsonAsset(
              page
            );
          }
        }

        if (!homePage) {
          homePage = {
            path: '/index',
            pages: []
          };
        }

        homePage.children = topLevelChildren;

        compilation.assets[homePage.path.slice(1) + '.json'] = toJsonAsset(
          homePage
        );
      }

      done();
    });

    compiler.plugin('after-emit', (compilation, done) => {
      if (!compilation.contextDependencies.find(d => d === absDataPath)) {
        compilation.contextDependencies.push(absDataPath);
      }

      done();
    });
  }
}

module.exports = WebpackStaticSitePlugin;
