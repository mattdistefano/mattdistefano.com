const path = require('path');
const toJsonAsset = require('./to-json-asset');
const readPages = require('./read-pages');

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
      const dir = await readPages(absDataPath);

      for (let page of dir) {
        compilation.assets[page.path.slice(1) + '.json'] = toJsonAsset(page);
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
