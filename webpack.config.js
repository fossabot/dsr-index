const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const BASE_PATH = '/';
  const CDN_BASE_PATH = 'https://cdn.jsdelivr.net/gh/amzrk2/dsr-cdn@1/';

  return {
    // set entry and output dist
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash:6].js',
      publicPath: BASE_PATH,
    },
    optimization: {
      minimizer: [new TerserWebpackPlugin({ extractComments: false })],
    },
    module: {
      rules: [
        // css & scss
        {
          test: /\.s?[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        // inline svg required in html template
        {
          test: /\.svg$/,
          loader: 'raw-loader',
          options: {
            esModule: false,
          },
        },
        // files
        {
          test: /\.(jpe?g|png|gif|webp|ico|woff2?|[to]tf)$/i,
          loader: 'file-loader',
          options: {
            // prevent no default issue
            esModule: false,
            // output to dist/* with same path as src/*
            context: 'src',
            // remove hash when using cdn
            name: `[path][name]${env.production ? '' : '.[contenthash:6]'}.[ext]`,
            publicPath: env.production ? CDN_BASE_PATH : BASE_PATH,
          },
        },
      ],
    },
    plugins: [
      // clean last built files
      new CleanWebpackPlugin(),
      // extract css files from loader
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:6].css',
      }),
      // create html files use `html-loader` and `svg-inline-loader`
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: env.production
          ? {
              // custom
              collapseBooleanAttributes: true,
              ignoreCustomComments: [/^!/, /^\s*#/],
              // html-webpack-plugin default
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'static' }],
      }),
    ],
    devServer: {
      contentBase: 'dist',
      compress: true,
      port: 9000,
    },
    devtool: env.production ? false : 'cheap-module-source-map',
  };
};
