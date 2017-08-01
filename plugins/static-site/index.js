const path = require('path');
const evaluate = require('eval');
const toStringAsset = require('./to-string-asset');
const readPages = require('./read-pages');

// borrowed from https://github.com/markdalgleish/static-site-generator-webpack-plugin
const findAsset = (src, compilation, webpackStatsJson) => {
  if (!src) {
    const chunkNames = Object.keys(webpackStatsJson.assetsByChunkName);

    src = chunkNames[0];
  }

  const asset = compilation.assets[src];

  if (asset) {
    return asset;
  }

  let chunkValue = webpackStatsJson.assetsByChunkName[src];

  if (!chunkValue) {
    return null;
  }
  // Webpack outputs an array for each chunk when using sourcemaps
  if (chunkValue instanceof Array) {
    // Is the main bundle always the first element?
    chunkValue = chunkValue[0];
  }

  return compilation.assets[chunkValue];
};

const getRenderer = source => {
  let renderer = evaluate(
    source,
    null,
    {
      window: {}
    },
    true
  );

  if (renderer.hasOwnProperty('default')) {
    renderer = renderer['default'];
  }

  if (typeof renderer !== 'function') {
    throw new Error('Default export is not a function');
  }

  return renderer;
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
  }

  apply(compiler) {
    const cache = {
      html: null
    };

    const absDataPath = path.isAbsolute(this.options.dataPath)
      ? this.options.dataPath
      : path.resolve(compiler.options.context, this.options.dataPath);

    compiler.plugin('this-compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-after-emit', function(
        htmlPluginData,
        callback
      ) {
        cache.html = htmlPluginData.html.source();
        callback(null, htmlPluginData);
      });
    });

    compiler.plugin('emit', async (compilation, done) => {
      const dir = await readPages(absDataPath);

      for (let page of dir) {
        compilation.assets[page.path.slice(1) + '.json'] = toStringAsset(
          JSON.stringify(page)
        );
      }

      if (!this.options.prerender) {
        done();
        return;
      }

      const asset = findAsset(
        null,
        compilation,
        compilation.getStats().toJson()
      );

      const source = asset.source();

      try {
        // when the dev server is running, we get its client code in our chunk
        // which doesn't play nice w/ evaluating the code in node
        // realistically we don't need to run this in the dev server anyway
        // for now just swallow the error
        // TODO - either make this a separate plugin or skip when in dev mode
        const renderer = getRenderer(source);

        const rendered = renderer(dir);

        for (let key in rendered) {
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
      if (!compilation.contextDependencies.find(d => d === absDataPath)) {
        compilation.contextDependencies.push(absDataPath);
      }

      done();
    });
  }
}

module.exports = WebpackStaticSitePlugin;
