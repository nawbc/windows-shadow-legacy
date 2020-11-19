const { Worker, isMainThread, workerData, threadId } = require('worker_threads');
if (!isMainThread) {
	console.log(workerData, threadId);
}

class MouseWorker extends Worker {

}

module.exports = MouseWorker;