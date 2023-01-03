const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = {
  entry: "./src/index",
  mode: "development",
  output: {
    publicPath: 'http://localhost:3000/'
  },
  devServer: {
    port: 3000,
    allowedHosts: 'all'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  target: "web",
};
