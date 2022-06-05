const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconWebpackPlugin = require('favicons-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (env, argv) => {
  console.log('mode:', argv.mode)
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  const filename = (ext) =>
    isProd ? `[name].[contenthash].bundle.${ext}`:`[name].bundle.${ext}`

  const config = {
    context: path.resolve(__dirname, 'src'),
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src', 'core'),
      },
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
      port: '3000',
      open: true,
      hot: true,
      watchFiles: './',
    },
    entry: {
      main: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        './index.js',
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename('js'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
      }),
      new FaviconWebpackPlugin('./static/favicon.png'),
      new MiniCssExtractPlugin({
        filename: filename('css'),
      }),
    ],
  }

  isDev ? config.plugins.push(new ESLintPlugin()):''

  return config
}
