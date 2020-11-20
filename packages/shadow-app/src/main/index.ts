import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';
import { ShadowWindowAction, ShadowMouse, MouseEvents } from 'shadow-addon';

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
			sandbox: false,
			enableRemoteModule: true 
		}
	});

	mainWindow.maximize();
	mainWindow.loadURL(windowPath);

	const shadowWindow = new ShadowWindowAction(mainWindow.getNativeWindowHandle());

	shadowWindow.embeddedIntoDesktop();

	const shadowMouse = new ShadowMouse(shadowWindow, {
		autoCreateThread: false
	});

	console.log(shadowMouse);

	shadowMouse.on(MouseEvents.clickSpecifiedCount, (event) => {
		console.log(111);
	});

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