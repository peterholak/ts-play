const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        bundle: './src/index.tsx',
        vendors: [
            'react',
            'react-dom'
        ]
    },

    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
        ],

        preLoaders: [
            { test: /\.js$/, loader: 'source-map-loader'}
        ]
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: 'node_modules/monaco-editor/release/min/vs',
            to: 'vs'
        },
        {
            from: 'index.html',
            to: '.'
        }]),

        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js')
    ]
};
