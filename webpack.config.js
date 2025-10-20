const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

require('dotenv').config();


module.exports = {
  entry: './layout/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './layout/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new ESLintPlugin({
      extensions:['js'],
      emitWarning:true,
      failOnError:false
    })
  ],
  devtool:'source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};