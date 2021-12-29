const path = require('path')
const BomPlugin = require('webpack-utf8-bom');

module.exports = {
  entry: './src/main.ts',
  plugins: [
    new BomPlugin(true)
  ],
  output: {
    filename: 'action_to_all_opened_files.jsx',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    mainFiles: ['index']
  },
}