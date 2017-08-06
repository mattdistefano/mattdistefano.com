const path = require('path');
const vm = require('vm');
const sortChunks = require('webpack-sort-chunks').default;
const toStringAsset = require('./to-string-asset');
const readPages = require('./read-pages');

const getRenderer = chunks => {
  const sandbox = {
    allExports: {}
  };

  // add window as an alias of the sandbox itself
  // this is necessary as webpack basically expects window to be the global
  // i.e. webpackJsonp is set on window, but accessed as a global
  sandbox.window = sandbox;

  // generate a script containing the content of all our chunks
  // with each chunk wrapped in an IEFE that provides a separate
  // module and exports object for the UMD wrapper
  // then aggregate the exports
  const code = chunks
    .map(
      (chunk, i) => `
      const chunk${i}Module = { exports: {} };
      
      (function(module, exports) {
        ${chunk};
      })(chunk${i}Module, chunk${i}Module.exports);

      Object.assign(allExports, chunk${i}Module.exports);
    `
    )
    .join('');

  const result = vm.runInNewContext(code, sandbox);

  // finally, look for an exported function named __PRERENDERER
  // the expectation being that one of the chunks will contain it
  if (typeof result.__PRERENDERER !== 'function') {
    throw new Error('No chunk exports a __PRERENDERER function');
  }

  return result.__PRERENDERER;
};

const insertIntoHtml = (html, rendered) =>
  html
    .replace(
      '<div id="app"></div>',
      `
      <div id="app">${rendered.content}</div> 
      <script>window.__PRELOADED_STATE__ = ${rendered.state}</script>
      `
    )
    .replace('<title></title>', `<title>${rendered.title}</title>`)
    .replace(
      '<meta name="description" content="">',
      `<meta name="description" content="${rendered.description || ''}">`
    );

class WebpackStaticSitePlugin {
  constructor(options) {
    this.options = options;
    this.startTime = Date.now();
    this.prevTimestamps = {};
  }

  hasChanges(compilation) {
    const keys = Object.keys(compilation.fileTimestamps);

    if (keys.length === 0) {
      // assume first run
      return true;
    }

    const changedFiles = keys.filter(
      watchfile =>
        watchfile.startsWith(this.absDataPath) &&
        watchfile.endsWith('.md') &&
        (this.prevTimestamps[watchfile] || this.startTime) <
          (compilation.fileTimestamps[watchfile] || Infinity)
    );

    this.prevTimestamps = compilation.fileTimestamps;

    return changedFiles.length > 0;
  }

  apply(compiler) {
    const cache = {
      html: null
    };

    this.absDataPath = path.isAbsolute(this.options.dataPath)
      ? this.options.dataPath
      : path.resolve(compiler.options.context, this.options.dataPath);

    compiler.plugin('this-compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-after-emit',
        (htmlPluginData, callback) => {
          cache.html = htmlPluginData.html.source();
          callback(null, htmlPluginData);
        }
      );
    });

    compiler.plugin('emit', async (compilation, done) => {
      if (!this.hasChanges(compilation)) {
        // only run if we have changes in the files we care about
        return done();
      }

      const dir = await readPages(this.absDataPath);

      for (let page of dir) {
        // add json assets for each page
        compilation.assets[page.path.slice(1) + '.json'] = toStringAsset(
          JSON.stringify(page)
        );
      }

      if (!this.options.prerender) {
        return done();
      }

      const stats = compilation.getStats().toJson();

      // get the chunks in order by dependency
      const sortedChunks = sortChunks(stats.chunks);

      // extract the source of each chunk
      // TODO is this the right way to use chunk.files?
      const chunkAssets = sortedChunks.map(chunk =>
        compilation.assets[chunk.files[0]].source()
      );

      try {
        // obtain a renderer function from the chunks
        const renderer = getRenderer(chunkAssets);

        // use the function to pre-render the html for the directory tree
        const rendered = renderer(dir);

        for (let key in rendered) {
          // add html assets for each pre-rendered page
          compilation.assets[key.slice(1) + '.html'] = toStringAsset(
            insertIntoHtml(cache.html, rendered[key])
          );
        }
      } catch (e) {
        console.log(e);
      }

      done();
    });

    compiler.plugin('after-emit', (compilation, done) => {
      if (!compilation.contextDependencies.find(d => d === this.absDataPath)) {
        compilation.contextDependencies.push(this.absDataPath);
      }

      done();
    });
  }
}

module.exports = WebpackStaticSitePlugin;
