'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { resolve } = require('path');
const os = require('os');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';

module.exports = {
	mode: env,
	devtool: isProduction ? false : 'cheap-module-eval-source-map',
	entry: {
		shadow: resolve(__dirname, '../../src/renderer/shadow/index.tsx'),
		setting: resolve(__dirname, '../../src/renderer/setting/index.tsx')
	},
	target: 'electron-renderer',
	output: {
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		path: resolve(__dirname, '../../dist')
	},
	optimization: {
		minimize: isProduction,
		splitChunks: {
			cacheGroups: {
				common: {
					name: "common",
					chunks: "all",
					minSize: 1,
					priority: 0
				},
				vendor: {
					name: "vendor",
					test: /[\\/]node_modules[\\/]/,
					chunks: "all",
					priority: 10
				}
			}
		}
	},
	module: {
		rules: [
			// {
			// 	test: /\.(js|jsx|tsx|ts)$/,
			// 	include: [resolve(__dirname, '../../src'), resolve(__dirname, '../../../shadow-ui/src/')],
			// 	enforce: 'pre',
			// 	use: [
			// 		{
			// 			loader: 'eslint-loader',
			// 			options: {
			// 				eslintPath: require.resolve('eslint')
			// 			}
			// 		}
			// 	]
			// },
			{
				oneOf: [
					{
						test: [/\.(js|jsx|ts|tsx)$/],
						// include shadow-ui
						include: [resolve(__dirname, '../../src/'), resolve(__dirname, '../../../shadow-ui/src/')],
						use: [
							{
								loader: 'ts-loader',
								options: {
									transpileOnly: true,
									experimentalWatchApi: true
								}
							},
							{
								loader: 'thread-loader',
								options: {
									worker: os.cpus().length
								}
							}
						]
					},
					{
						test: /\.(sa|sc|c)ss$/,
						include: [resolve(__dirname, '../../src/'), resolve(__dirname, '../../../shadow-ui/src/')],
						use: [
							'style-loader',
							{
								loader: 'css-loader',
								options: {
									sourceMap: isProduction
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sourceMap: isProduction
								}
							},
							{
								loader: 'thread-loader',
								options: {
									worker: os.cpus().length
								}
							}
						].filter(Boolean)
					},
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						loader: 'url-loader',
						options: {
							limit: 0x1400,
							name: 'resource/[name].[hash:8].[ext]'
						}
					},
					{
						loader: 'file-loader',
						exclude: [/\.(js|jsx|ts|tsx)$/, /\.htm?(.|l)$/, /\.json$/, /\.ejs$/],
						options: {
							name: 'resource/[name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			async: isProduction,
			// eslint: {
			// 	files: resolve(__dirname, '../../src/**/*')
			// },
			typescript: {
				configFile: resolve(__dirname, '../../tsconfig.json')
			}
		}),
		new HtmlWebpackPlugin({
			filename: 'shadow.html',
			template: resolve(__dirname, '../../src/renderer/shadow/index.ejs'),
			minify: {
				removeRedundantAttributes: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				collapseBooleanAttributes: true
			},
			nodeModules: isProduction ? resolve(__dirname, '../../node_modules/') : false,
			chunks: ['shadow']
		}),
		new HtmlWebpackPlugin({
			filename: 'setting.html',
			template: resolve(__dirname, '../../src/renderer/setting/index.ejs'),
			minify: {
				removeRedundantAttributes: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				collapseBooleanAttributes: true
			},
			nodeModules: isProduction ? resolve(__dirname, '../../node_modules/') : false,
			chunks: ['setting']
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ExtraWatchWebpackPlugin({
			dirs: [resolve(__dirname, '../../../shadow-ui/src')]
		})
	].filter(Boolean),
	resolve: {
		extensions: ['.js', '.json', '.jsx', '.tsx', '.ts', '.json', '.css', '.scss', '.sass', '.node'],
		alias: {
			'@': resolve(__dirname, '../../../shadow-app/src/renderer/'),
			// '@addon': resolve(__dirname, '../../../shadow-addon/lib/'),
			'@ui': resolve(__dirname, '../../../shadow-ui/src/')
		}
	},
	node: {
		global: true,
		__dirname: true,
		__filename: true
	}
};

