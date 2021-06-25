const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")


const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, '../app')
const dirAssets = path.join(__dirname, '../assets')
const dirStyles = path.join(__dirname, '../styles')
const dirNode = 'node_modules'

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  entry: [
    path.join(dirApp, 'index.js'),
    path.join(dirStyles, 'index.scss')
  ],

  resolve: {
    // alias: {
    //   '@app': dirApp,
    //   '@assets': dirAssets,
    //   '@styles': dirStyles,
    // },
    modules: [
      dirApp,
      dirAssets,
      dirStyles,
      dirNode
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './assets', to: '' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }]
        ]
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }

        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              name (file) {
                return '[hash].[ext]'
              },
              outputPath: 'images',
              severityError: 'warning', // Ignore errors on corrupted images
              minimizerOptions: {
                plugins: ['gifsicle']
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|fnt)$/,
        loader: 'file-loader',
        options: {
          name (file) {
            return '[hash].[ext]'
          },
          outputPath:
            'fonts'
        }
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
}
