const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  mode: 'development',
  entry: {
    'app': './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules|monaco-build/ }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'monaco-build/monaco-editor/release/min/vs', to: 'vs' },
      { from: 'monaco-build/monaco-editor/release/min-maps', to: 'min-maps' },
      { from: 'src/index.html', to: '.' },
      { from: 'node_modules/bootstrap/dist/css', to: 'css' }
    ]),
  ],
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  externals: {
    // TypeScript (the compiler implementation which the web page is using) uses `require()` with this module,
    // and webpack's implementation would by default return an empty object `{}`, which TypeScript then tests
    // with an if {} if it's falsy. With this configuration, it will be...
    "@microsoft/typescript-etw": 'undefined'
  },
  // Suppress some harmless warnings for a 3rd party library (the code already handles the missing modules properly).
  stats: {
    warningsFilter: ["source-map-support.js"]
  }
}

module.exports = config