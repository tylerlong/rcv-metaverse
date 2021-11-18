/* eslint-disable node/no-unpublished-require */
/* eslint-disable node/no-unpublished-import */
import {Configuration, DefinePlugin} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import dotenv from 'dotenv-override-true';

const config: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.join(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RCV Metaverse',
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
};

export default [config];
