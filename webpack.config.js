const nodeExternals = require('webpack-node-externals');
const path = require('path');
const severlessWebpack = require('serverless-webpack');
const terserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: severlessWebpack.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.join(__dirname, './.webpack'),
  },
  resolve: {
    alias: {
      '@data': path.resolve(__dirname, './src/data'),
      '@effect': path.resolve(__dirname, './src/effect'),
      '@type': path.resolve(__dirname, './src/type'),
      '@utility': path.resolve(__dirname, './src/utility'),
    },
    cacheWithContext: false,
    extensions: ['.js', '.json', '.ts'],
    modules: [path.join(__dirname, './node_modules')],
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new terserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: false,
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          safari10: false,
        },
        parallel: true,
      }),
    ],
  },
};
