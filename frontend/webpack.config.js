const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        bundle: './src/index.tsx',
        vendors: [
            'react',
            'react-dom',
            'react-bootstrap',
            'whatwg-fetch',
            'react-router',
            'react-monaco-editor',
            'immutability-helper',
            'immutable-assign',
            __dirname + '/schema/tsconfig.schema.json'
        ]
    },

    output: {
        filename: 'bundle.js',
        path: __dirname + '/../dist/frontend'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'}
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
        },
        {
            from: 'node_modules/bootstrap/dist/css',
            to: 'css'
        }]),

        new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendor.js' })
    ]
};
