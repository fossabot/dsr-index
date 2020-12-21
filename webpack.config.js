const env = process.env.NODE_ENV || 'production';
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: env,
  // set entry and output dist
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    hashDigestLength: 6,
    filename: 'assets/[name].[contenthash].js',
  },
  // js minification settings
  optimization: {
    minimizer: [new TerserWebpackPlugin({ extractComments: false })],
  },
  module: {
    rules: [
      // css & scss
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    // clean last built files
    new CleanWebpackPlugin(),
    // create css files
    new MiniCssExtractPlugin(),
    // create html files
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify:
        env === 'production'
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
  ],
};
