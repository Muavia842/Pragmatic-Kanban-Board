const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { CompiledExtractPlugin } = require('@compiled/webpack-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require('./package.json').dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => ({
  output: {
    publicPath: 'http://localhost:6060/',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  devServer: {
    port: 6060,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port;

      printCompilationMessage('compiling', port);

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port);
          } else {
            printCompilationMessage('success', port);
          }
        });
      });
    },
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Match image file types
        type: 'asset/resource', // Use Webpack 5's built-in handling
        generator: {
          filename: 'images/[hash][ext][query]', // Optional: Customize output path
        },
      },
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /compiled-css\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /(?<!compiled-css)(?<!\.compiled)\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          { loader: 'babel-loader' },
          {
            // ↓↓ Compiled should run last ↓↓
            loader: '@compiled/webpack-loader',
            options: {
              transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'],
              extract: true,
              inlineCss: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'pragmatic_dnd',
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
    new Dotenv(),
    new MiniCssExtractPlugin(),
    new CompiledExtractPlugin({ sortShorthand: true }),
  ],
});
