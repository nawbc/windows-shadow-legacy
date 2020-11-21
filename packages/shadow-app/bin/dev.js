const { spawn } = require('child_process');
const electron = require('electron');
const webpack = require('webpack');
const path = require('path');
const mainConfig = require('../scripts/webpack/webpack.main');
const rendererConfig = require('../scripts/webpack/webpack.renderer');
const serverConfig = require('../scripts/webpack/webpack.server');
// const { say } = require('cfonts');
const log = require('../scripts/utils/output');
const rm = require('rimraf');
const { promisify } = require('util');
const { fork } = require('child_process');
// const ioHook = require('iohook');

let electronProcess = null;

// const printDevTitle = () =>
// 	say('SHADOW', {
// 		font: 'block',
// 		colors: ['white']
// 	});

const bootElectron = () => new Promise((resolve, reject) => {

	electronProcess = spawn(electron, [path.resolve(__dirname, '../dist/main.js')]);

	electronProcess.stdout.on('data', (data) => {
		log.info('Electron', data.toString('utf8'));
		// printDevTitle();
		resolve();
	});

	electronProcess.stderr.on('data', (err) => {
		log.error('Electron', err.toString('utf8'));
		reject();
	});

	electronProcess.on('close', () => {
		log.info('Electron', 'Restarting');
	});
});

const bootMain = () => new Promise((resolve, reject) => {
	const compiler = webpack(mainConfig);
	compiler.hooks.done.tap('done', resolve);

	compiler.hooks.failed.tap('failed', reject);

	compiler.watch({
		aggregateTimeout: 1500,
		ignored: ['/**/*.json']
	}, async (err, stats) => {
		if (!!err) {
			log.error('Main Process', err);
			reject(err);
		} else {
			const statsJson = stats.toJson();
			log.reportWebpackLog(statsJson, 'Main Process');
		}
	});
});

// const bootServer = () => new Promise((resolve, reject) => {
// 	const compiler = webpack(serverConfig);
// 	compiler.hooks.done.tap('done', resolve);

// 	compiler.hooks.failed.tap('failed', reject);

// 	compiler.watch({
// 		aggregateTimeout: 2500,
// 		ignored: ['/**/*.json']
// 	}, async (err, stats) => {
// 		if (!!err) {
// 			log.error('Server', err);
// 			reject(err);
// 		} else {
// 			const statsJson = stats.toJson();
// 			log.reportWebpackLog(statsJson, 'Server');

// 		}
// 	});
// });

// const bootWorkers = () => new Promise((resolve, reject) => {
// 	const compiler = webpack(workerConfig);
// 	compiler.hooks.done.tap('done', resolve);

// 	compiler.hooks.failed.tap('failed', reject);

// 	compiler.watch({
// 		aggregateTimeout: 2500,
// 		ignored: ['/**/*.json']
// 	}, async (err, stats) => {
// 		if (!!err) {
// 			log.error('Worker', err);
// 			reject(err);
// 		} else {
// 			const statsJson = stats.toJson();
// 			log.reportWebpackLog(statsJson, 'Worker');
// 		}
// 	});
// });

const bootRenderer = () => new Promise((resolve, reject) => {
	const compiler = webpack(rendererConfig);

	compiler.hooks.done.tap('done', resolve);

	compiler.hooks.failed.tap('failed', reject);

	compiler.watch({
		aggregateTimeout: 2000,
		ignored: ['*.scss', '*.css']
	}, (err, stats) => {
		if (!!err) {
			log.error('Renderer Process', err);
			reject(err);
		} else {
			const statsJson = stats.toJson();
			log.reportWebpackLog(statsJson, 'Renderer Process');
		}
	});
});

(async function () {

	await promisify(rm)(path.resolve(__dirname, '../dist/')).catch(err => {
		!!err && log.error('Dev.js', err);
	});

	// ioHook.registerShortcut([56, 19], async () => {
	// 	if (!!electronProcess && !!electronProcess.pid) {
	// 		log.info('restart electron ' + electronProcess.pid);
	// 		process.kill(electronProcess.pid);
	// 		await bootElectron();
	// 	}
	// });

	await bootMain().catch(() => {
		process.exit();
	});

	await bootRenderer().catch(() => {
		process.exit();
	});

	await bootElectron().catch(() => {
		process.exit();
	});

	// ioHook.start();

})();