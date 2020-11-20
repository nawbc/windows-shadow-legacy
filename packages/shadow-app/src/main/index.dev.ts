import { app } from 'electron';
import * as extensionInstaller from 'electron-devtools-installer';
// import * as devtron from 'devtron';

app.on('browser-window-created', (event, win) => {
	win.webContents.once('dom-ready', () => {
		win.webContents.openDevTools({ mode: 'detach' });
	});
});

app.on('ready', async () => {
	// await devtron.install();
	await extensionInstaller
		.default([extensionInstaller.REACT_DEVELOPER_TOOLS])
		.catch((err: Error) => {
			console.log('Unable to install devtools: \n', err);
		});
});

require('./index');