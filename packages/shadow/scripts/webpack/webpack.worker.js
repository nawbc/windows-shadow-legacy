'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { resolve } = require('path');
const os = require('os');
const env = process.env.NODE_ENV;
const isProduction = env === 'production';

module.exports = {
	mode: env,
	entry: {
		mouse_worker: resolve(__dirname, '../../src/main/worker/mouse_worker.ts')
	},
	output: {
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		path: resolve(__dirname, '../../dist/')
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				include: [resolve(__dirname, '../../src/main/worker/')],
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
				test: /\.node$/,
				use: 'node-loader'
			}, {
				test: /\.worker\.(js|ts)$/,
				use: { loader: 'worker-loader' }
			}
		]
	},
	optimization: {
		minimize: isProduction
	},
	plugins: [new ForkTsCheckerWebpackPlugin({
		async: isProduction,
		eslint: {
			files: resolve(__dirname, '../../src/**/*')
		},
		typescript: {
			configFile: resolve(__dirname, '../../tsconfig.json')
		}
	})],
	resolve: {
		extensions: ['.js', '.ts', '.json', '.node']
	},
	node: {
		global: true,
		__dirname: true,
		__filename: true
	}
};

