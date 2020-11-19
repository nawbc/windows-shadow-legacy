const { Worker, isMainThread, workerData } = require('worker_threads');
const MouseWorker = require('./b');
const { resolve } = require('path');

if (isMainThread) {
	// const worker = new MouseWorker();
	console.log(1111);
}

