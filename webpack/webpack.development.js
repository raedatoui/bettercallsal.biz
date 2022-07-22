const HtmlWebpackPlugin = require('html-webpack-plugin');

const development = {
  plugins: [
    new HtmlWebpackPlugin({
        template: 'index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
        template: 'customerservice.html',
        filename: 'customerservice.html'
      })
  ],
  devtool: 'inline-source-map'
};

module.exports = development;
