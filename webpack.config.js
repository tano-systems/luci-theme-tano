const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    theme: path.resolve(__dirname, "src", "scripts", "index.js")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader", options: { url: false, minimize: true } },
          { loader: "postcss-loader" },
          { loader: "sass-loader"}
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "cascade.css"
    })
  ]
};
