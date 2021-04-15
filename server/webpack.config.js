var path = require("path");
var fs = require("fs");
var nodeExternals = require("webpack-node-externals");

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function (x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  entry: "./index.js",
  target: "node", // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    path: path.join(__dirname, "build"),
    filename: "backend.js",
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: "raw-loader",
      },
      {
        test: /\.log$/i,
        use: "raw-loader",
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, "/global.js")],
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  mode: "production",
  devtool: "inline-source-map",
};
