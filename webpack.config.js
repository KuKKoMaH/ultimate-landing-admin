var path = require("path");

module.exports = {
  devtool: 'eval',
  watch: true,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["style", "css?modules", "sass"]
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
        query: {
          presets: ['react-hmre'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};