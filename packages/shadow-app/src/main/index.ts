import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';
import { ShadowWindowAction, ShadowMouse, MouseEvents, MouseMove, MouseClickSpecifiedCount, MouseUp, bufferCastInt32 } from 'shadow-addon';

app.commandLine.appendSwitch('disable-site-isolation-trials');

app.allowRendererProcessReuse = true;

if (require('electron-squirrel-startup')) { app.quit(); }

const windowPath = resolve(app.getAppPath(), './shadow.html');

const createWindow = (): void => {

	const mainWindow = new BrowserWindow({
		frame: false,
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			webviewTag: true,
			sandbox: false
		}
	});

	mainWindow.maximize();
	mainWindow.loadURL(windowPath);

	const shadowWindow = new ShadowWindowAction(mainWindow.getNativeWindowHandle());

	shadowWindow.embeddedIntoDesktop();

	// const a = new BrowserWindow({
	// 	show: false,
	// 	webPreferences: {
	// 		nodeIntegration: true,
	// 		webSecurity: false,
	// 		webviewTag: true,
	// 		sandbox: false
	// 	}
	// });

	// a.loadFile();

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// class MainApp {
// 	private _initApp = () => {
// 		console.log(1);
// 	}

// }