const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { DefinePlugin } = webpack;
const context = __dirname;

module.exports = env => [
  {
    entry: {
      server: path.join(context, 'src', 'server', 'index.ts'),
    },
    output: {
      path: path.join(context, 'dist'),
      filename: '[name].bundle.js',
    },
    target: 'node',
    module: {
      rules: [
        {
          test: /\.(t|j)s$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                {
                  plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-transform-runtime',
                  ],
                },
              ],
            },
          },
        },
        {
          test: /\.txt$/,
          exclude: /node_modules/,
          use: {
            loader: 'raw-loader',
          },
        },
      ],
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.join(context, 'src'), path.join(context, 'node_modules')],
    },
    context,
    plugins: [
      new DefinePlugin({
        'process.env': {
          TARGET: JSON.stringify(env.TARGET),
        },
        _global: {},
      }),
    ],
    performance: {
      hints: false,
    },
    devtool: false,
    mode: 'production',
  },
  {
    entry: path.join(context, 'src', 'client', 'index.tsx'),
    output: {
      path: path.join(context, 'dist', 'client'),
      filename: '[name].bundle.js',
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react',
                {
                  plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-transform-runtime',
                  ],
                },
              ],
            },
          },
        },
        {
          test: /\.(png|jpg|gif|svg|webp|woff|woff2)$/,
          use: ['file-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.txt$/,
          exclude: /node_modules/,
          use: {
            loader: 'raw-loader',
          },
        },
      ],
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      modules: [path.join(context, 'src'), path.join(context, 'node_modules')],
    },
    context,
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: 'index.html',
        template: path.join(context, 'src', 'client', 'index.html'),
        minify: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      new OptimizeCSSAssetsPlugin({}),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|eot|ttf|woff2?|svg)$/,
        cache: true,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    performance: {
      hints: false,
    },
    devtool: false,
    mode: 'production',
  },
];
