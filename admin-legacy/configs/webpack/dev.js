// development config
const { merge } = require("webpack-merge");
const commonConfig = require("./common");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = merge(commonConfig, {
  mode: "development",
  devServer: {
    hot: true, // enable HMR on the server
    historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: 
  },
  devtool: "cheap-module-source-map",
  plugins: [
   
      // Use dotenv-webpack to load environment variables
      new Dotenv({
        path: path.resolve(__dirname, '../..', '.env.development'), // Adjust the path accordingly
        systemvars: true
      }),
  ],
});
