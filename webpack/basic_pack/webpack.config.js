import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    login: './page/login/index.js',
    content: './page/content/index.js',
    publish: './page/publish/index.js',
  },
  output: {
    filename: 'page/[name]/index.js',
    // 确保chunk文件输出到utils目录，并禁用哈希
    chunkFilename: 'utils/[name].js',
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.html$/, use: 'html-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    // 提取公共模块
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 提取utils工具类为单独文件
        utils: {
          test: /[\\/]utils[\\/]/,
          name: 'utils',
          chunks: 'all',
          priority: 10,
        },
        // 提取其他公共模块
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      ...new CssMinimizerPlugin({
        parallel: true, // 开启多进程并行压缩
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }, // 移除所有注释
              normalizeWhitespace: true,
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'page/[name]/index.css',
    }),
    new HtmlWebpackPlugin({
      filename: 'page/login/index.html',
      template: './page/login/index.html',
      chunks: ['login', 'utils', 'commons'],
    }),
    new HtmlWebpackPlugin({
      filename: 'page/content/index.html',
      template: './page/content/index.html',
      chunks: ['content', 'utils', 'commons'],
    }),
    new HtmlWebpackPlugin({
      filename: 'page/publish/index.html',
      template: './page/publish/index.html',
      chunks: ['publish', 'utils', 'commons'],
    }),
  ],
};
