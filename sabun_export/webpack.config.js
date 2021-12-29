const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'sabun_export.jsx',
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
