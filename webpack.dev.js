const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const context = __dirname;

const ssl = {
  key: fs.readFileSync(
    path.join(context, 'src', 'server', 'ssl', 'ssl.key'),
    'utf-8',
  ),
  cert: fs.readFileSync(
    path.join(context, 'src', 'server', 'ssl', 'ssl.cert'),
    'utf-8',
  ),
};

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
                ['@babel/preset-env', { targets: { node: true } }],
                ['@babel/preset-typescript', { targets: { node: true } }],
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
        _global: {},
      }),
    ],
    devServer: {
      compress: false,
      contentBase: path.join(context, 'dist'),
      publicPath: '/dist/',
      sockPath: '/api/webpackdevserver',
      port: 9999,
      https: ssl,
      writeToDisk: true,
    },
    performance: {
      hints: 'warning',
    },
    devtool: 'source-map',
    mode: 'development',
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
    plugins: [
      new HTMLWebpackPlugin({
        filename: 'index.html',
        template: path.join(context, 'src', 'client', 'index.html'),
      }),
    ],
    devServer: {
      compress: false,
      contentBase: path.join(context, 'dist'),
      publicPath: '/dist/',
      sockPath: '/api/webpackdevserver',
      port: 9999,
      https: ssl,
      writeToDisk: true,
    },
    performance: {
      hints: 'warning',
    },
    devtool: 'source-map',
    mode: 'development',
  },
];
