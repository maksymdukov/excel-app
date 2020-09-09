const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = (ext) => (isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`);

const jsLoaders = () => {
  return [
    {
      loader: 'babel-loader',
    },
    { loader: 'eslint-loader' },
  ];
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: 'index.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js'),
  },
  devServer: {
    port: 3000,
    contentBase: 'dist',
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: jsLoaders(),
        exclude: [/node_modules/],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: path.resolve(__dirname, 'dist', 'index.html'),
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, 'src', 'favicon.ico') }],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
