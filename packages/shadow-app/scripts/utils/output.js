const chalk = require('chalk');

const _getDash = (d = 0) => {
	const ttyWidth = process.stdout.getWindowSize()[0];
	return Array(ttyWidth - d).fill('-').join('');
};

const info = (type = 'info', ...args) => {
	console.log();
	console.log(chalk.green(`-----${type}${_getDash(type.length + 5)}\n`));
	console.log(...args);
	console.log(chalk.green(`${_getDash()}`));
	console.log();
};

const error = (type = 'error', ...args) => {
	console.log();
	console.log(chalk.red(`-----${type}${_getDash(type.length + 5)}\n`));
	console.log(...args);
	console.log(chalk.red(`${_getDash()}\n`));
	console.log();
};

const warn = (type = 'warn', ...args) => {
	console.log();
	console.log(chalk.yellow(`-----${type}${_getDash(type.length + 5)}\n`));
	console.log(...args);
	console.log(chalk.yellow(`${_getDash()}`));
	console.log();
};

const successInfo = (json, type) => {
	const duration = json.time;
	const startTime = new Date(json.builtAt);
	const webpackVersion = json.version;
	const chunkName = json.assetsByChunkName.main;
	const totalSize = (json.assets.reduce((pre, next) => ({ size: pre.size + next.size }), { size: 0 }).size / Math.pow(1024, 2)).toFixed(4) + 'MB';

	info(type,
		'[WEBPACK_VERSION]: ', webpackVersion, '\n',
		'[MAIN_CHUNK]: ', chunkName, '\n',
		'[USING_TIME]', duration, 'ms', '\n',
		'[TOTAL_SIZE]: ', totalSize, '\n',
		'[START_AT]: ', startTime, '\n'
	);
};

const errorsInfo = ({ errors }, type) => {
	if (!!errors.length) {
		error(type, errors.map(val => val + '\n').join(''));
	}
};

const warningsInfo = ({ warnings }, type) => {
	if (!!warnings.length) {
		warn(type, warnings.map(val => val + '\n').join(''));
	}
};

const reportWebpackLog = (statsJson, type) => {
	successInfo(statsJson, type);
	errorsInfo(statsJson, type);
	warningsInfo(statsJson, type);
};

module.exports = {
	info,
	error,
	warn,
	reportWebpackLog,
	warningsInfo,
	errorsInfo,
	successInfo
};