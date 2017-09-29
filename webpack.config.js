const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const nodeModules = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: 'bundle.js',
    publicPath: ''
  },
  resolve :{
    extensions: ['.html','.scss','.js','.ts']
  },
  plugins: [
      new webpack.ContextReplacementPlugin(
  /angular(\\|\/)core(\\|\/)@angular/,
  path.resolve(__dirname, '../dist')
)
  ],
  module: {
     /*rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
            }
        ],*/
    loaders: [
            // the following three loader are follow angular2-template-loader example usage  
            {   test: /\.ts$/, 
                loaders: ['awesome-typescript-loader'],
                exclude: [/\.spec.ts$/]
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader',
                exclude: /\.async\.(html|css)$/
            },
            {
                test: /\.async\.(html|css)$/,
                loaders: ['file?name=[name].[hash].[ext]', 'extract']
            }
        ]
      /*{
        test: /\.html$/,
        loaders: 'html'
      },
      {
        test: /\.(jpeg!png)/,
        loaders: 'url'
      },
      {
         test: /\.json$/, 
         loader: 'json-loader' 
      },
      {
        test: /\.css$/,
        loader: 'raw-loader!postcss-loader'
      },
      {
        test: /\.(scss|sass)$/,
        loader: 'raw-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.ts$/,
        loaders: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css',
          'sass'
        ]
      }
    ]*/
  },
  devServer: {
    contentBase: path.join(__dirname,"dist"),
    hot: true,
    port: 9000
  },
  plugins: [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin
  ]
}