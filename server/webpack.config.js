var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './index.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    // externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            },
            {
                test: /\.log$/i,
                use: 'raw-loader',
            },
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, '/global.js'),
                ], // bỏ qua các thư mục node_module
                enforce: 'pre',
                use: ['source-map-loader'],
            },
        ],
    },
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        // new webpack.BannerPlugin('require("source-map-support").install();',
        //                          { raw: true, entryOnly: false })
    ],
    mode: 'production',
    devtool: 'inline-source-map'
}