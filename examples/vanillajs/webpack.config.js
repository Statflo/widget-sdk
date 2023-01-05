const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
    publicPath: "http://localhost:3000/",
  },
  devServer: {
    port: 3000,
    allowedHosts: "all",
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: "",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
      manifest: "./public/manifest.json",
    }),
  ],
};
