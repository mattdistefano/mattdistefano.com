const path = require('path');

const preactCliTypeScript = require('preact-cli-plugin-typescript');
const preactCliSwPrecachePlugin = require('preact-cli-sw-precache');
const preactCliPostCSS = require('preact-cli-postcss');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const SiteGeneratorWebpackPlugin = require('@mattdistefano/site-generator-webpack-plugin')
  .SiteGeneratorWebpackPlugin;

const precacheConfig = {
  staticFileGlobsIgnorePatterns: [
    /polyfills(\..*)?\.js$/,
    /\.htaccess$/,
    /\.robots\.txt$/,
    /\.map$/,
    /blog\//,
    // ignore all JSON files since we generate them
    /\.json$/,
    /.DS_Store/,
    /\.git/
  ]
};

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
  preactCliTypeScript(config);
  preactCliPostCSS(config, helpers);
  preactCliSwPrecachePlugin(config, precacheConfig);

  const siteGenPlugin = new SiteGeneratorWebpackPlugin({
    dataPath: path.resolve(__dirname, 'data'),
    prerender: false,
  });

  const copyPlugin = new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'data'),
      // TODO ignore dotfiles?
      ignore: ['*.md']
    },
    {
      from: path.resolve(__dirname, 'src/.htaccess')
    },
    {
      from: path.resolve(__dirname, 'src/robots.txt')
    }
  ]);

  config.plugins.push(siteGenPlugin, copyPlugin);

  return config;
}
