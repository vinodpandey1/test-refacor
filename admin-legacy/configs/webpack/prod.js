const { merge } = require("webpack-merge");
const { resolve } = require("path");
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "js/bundle.[contenthash].min.js",
    path: resolve(__dirname, "../../dist"),
    publicPath: "/",
  },
  devtool: "source-map",
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  plugins: [
    // Use dotenv-webpack to load environment variables
    new Dotenv({
      path: resolve(__dirname, '../../', '.env'), 
      systemvars: true
    }),
  ],
});
