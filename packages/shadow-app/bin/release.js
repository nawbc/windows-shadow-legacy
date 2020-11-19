"use strict";

const builder = require("electron-builder");
const path = require("path");
const rm = require('rimraf');
const webpack = require('webpack');
const { promisify } = require('util');
const log = require('../scripts/utils/output');
const mainConfig = require('../scripts/webpack/webpack.main');
const rendererConfig = require('../scripts/webpack/webpack.renderer');

const Platform = builder.Platform;

builder.build({
	targets: Platform.WINDOWS.createTarget(['nsis', 'squirrel']),
	config: {
		productName: 'shadow',
		icon: path.resolve(__dirname, '../src/assets/icons/icon.ico'),
		nsis: {
			runAfterFinish: true,
			perMachine: true,
			installerIcon: path.resolve(__dirname, '../src/assets/icons/icon.ico'),
			uninstallerIcon: path.resolve(__dirname, '../src/assets/icons/icon.ico')
		},
		squirrelWindows: true,
		artifactName: "${name}-setup-${version}.${ext}"
	}

})
	.then((val) => {
		console.log(val);
		// handle result
	})
	.catch((err) => {
		// handle error
	});

const buildRenderer = () => new Promise((resolve, reject) => {
	const compiler = webpack(rendererConfig);

	compiler.run((err, status) => {
		(!!err) ? reject(err) : resolve(status);
	}
	);
});

const buildMain = () => new Promise((resolve, reject) => {
	const compiler = webpack(mainConfig);

	compiler.run((err, status) => {
		(!!err) ? reject(err) : resolve(status);
	}
	);
});

(async () => {
	await promisify(rm)(path.resolve(__dirname, '../dist/')).catch(err => {
		!!err && log.error('Dev.js', err);
	});
	await buildMain().then((stats) => {
		log.reportWebpackLog(stats.toJson(), 'Build Main');
	}).catch((err) => {
		log.error('Build Main', err);
	});
	await buildRenderer().then((stats) => {
		log.reportWebpackLog(stats.toJson(), 'Build Renderer');
	}).catch((err) => {
		log.error('Build Renderer', err);
	});
})();
