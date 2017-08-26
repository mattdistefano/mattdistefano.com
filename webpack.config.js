const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const WebpackStaticSitePlugin = require('./plugins/static-site');

const entry = './index.ts';

const assets = '_assets';

const hmrEntry = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/only-dev-server',
  entry
];

const mozjpegOptions = {
  quality: 75,
  progressive: true
};

module.exports = (env = {}) => ({
  entry: env.production ? entry : hmrEntry,
  output: {
    filename: env.production
      ? `${assets}/[name].[chunkhash].js`
      : `${assets}/[name].js`,
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    publicPath: '/'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  context: path.resolve(__dirname, 'src'),
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /svg$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 7000,
              name: `${assets}/[name].[hash].[ext]`
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              progressive: true,
              optipng: {
                optimizationLevel: 7
              },
              gifsicle: {
                interlaced: false
              },
              mozjpeg: mozjpegOptions,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.tsx?$/,
        loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader']
      },
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          configFile: 'tslint.json'
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        env.production ? 'production' : 'development'
      )
    }),
    new ExtractTextPlugin({
      filename: `${assets}/styles.[contenthash].css`,
      disable: !env.production
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'data'),
        // TODO ignore dotfiles?
        ignore: ['*.md']
      }
    ]),
    new CleanWebpackPlugin(['dist']),
    new WebpackStaticSitePlugin({
      dataPath: path.resolve(__dirname, 'data'),
      prerender: env.production
    })
  ].concat(
    env.production
      ? [
          new webpack.HashedModuleIdsPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            parallel: true
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource)
          }),
          new ImageminPlugin({
            test: '!\_assets/**',
            plugins: [
              imageminMozjpeg(mozjpegOptions)
            ]
          })
        ]
      : [
          new webpack.NamedModulesPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ]
  ),

  devServer: {
    hot: true,
    historyApiFallback: true,
    host: 'localhost',
    port: 3000
  }
});
