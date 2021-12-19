/* eslint-disable node/no-unpublished-require */
/* eslint-disable node/no-unpublished-import */
import {Configuration, DefinePlugin} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import dotenv from 'dotenv-override-true';

const f = (env: {}, argv: Configuration): Configuration => {
  const config: Configuration = {
    mode: argv.mode,
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
        {
          test: /\.(?:png|jpg)$/i,
          use: 'file-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'RCV Metaverse',
        meta: {
          'origin-trial': {
            'http-equiv': 'origin-trial',
            content:
              argv.mode === 'production'
                ? 'AlzgT2e7AUfad0+/eTgcFIJ9Qr1j6eAnHZtqvGGRNsRSDiDGwFdF9ABhott7a/03p++Dcy48oJx+VvUPkw+/PwcAAABoeyJvcmlnaW4iOiJodHRwczovL2NodW50YW9saXUuY29tOjQ0MyIsImZlYXR1cmUiOiJSVENFeHRlbmREZWFkbGluZUZvclBsYW5CUmVtb3ZhbCIsImV4cGlyeSI6MTY1MzQzNjc5OX0='
                : 'AiobAcmMQ6Z01QsBkPln9CP5oSPo9EJsBHB0ef+XUoZh/wT719hTGgWf/g4n3s0OS5FiPkCbN1fk482lKjTJaQwAAABjeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJmZWF0dXJlIjoiUlRDRXh0ZW5kRGVhZGxpbmVGb3JQbGFuQlJlbW92YWwiLCJleHBpcnkiOjE2NTM0MzY3OTl9',
          },
        },
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
  return config;
};

export default f;
