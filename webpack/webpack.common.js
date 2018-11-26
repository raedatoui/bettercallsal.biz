const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');
const path = require( 'path' );
module.exports = {
  context: paths.src,
  entry: {
    app: `./scripts/index.js`,
  },
  output: {
    filename: `scripts/[name].[hash:10].js`,
    path: paths.dist,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: [/node_modules/,  path.resolve(paths.src, 'scripts/third_party')],
        loader: 'babel-loader',
      },
      // {
      //   // The delimiter of path fragment of stupid windows has the format "//"
      //   test: /\.js$/,
      //   include: [
      //     path.resolve(paths.src, 'scripts/third_party')
      //   ],
      //   use: [
      //     {
      //       loader: "three-contrib-loader"
      //     }
      //   ]
      // },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '../fonts',
            outputPath: 'fonts',
            name: '[name].[hash:10].[ext]',
          },
        },
      },
      {
        test: /\.(gif|ico|jpe?g|png|svg|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '../images',
            outputPath: 'images',
            name: '[name].[hash:10].[ext]',
          },
        },
      },
      {
        test: /\.glsl$/,
        use: {
          loader: 'webpack-glsl-loader'
        }
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[hash:10].css',
    }),
    new CopyWebpackPlugin([{ from: paths.static }]),
  ],
};
