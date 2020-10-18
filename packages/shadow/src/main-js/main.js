const { app, BrowserWindow, ipcMain } = require('electron');
const { resolve } = require('path');
const { ShadowWindowAction, ShadowMouse, MouseEvents, MouseMove, MouseClickSpecifiedCount, MouseUp, bufferCastInt32 } = require('shadow-addon');

app.commandLine.appendSwitch('disable-site-isolation-trials');

app.allowRendererProcessReuse = true;

// if (require('electron-squirrel-startup')) { app.quit(); }

// const mouseWorkerPath = resolve(app.getAppPath(), './mouse_worker.js');
const windowPath = resolve(__dirname, './a.html');
let b;
let mainWindow;
const createWindow = () => {
	mainWindow = new BrowserWindow({
		// frame: false,
		// transparent: true,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			webviewTag: true,
			sandbox: false
		}
	});

	// mainWindow.maximize();
	mainWindow.loadURL(windowPath);
	mainWindow.webContents.openDevTools();

	// const shadowWindow = new ShadowWindowAction(mainWindow.getNativeWindowHandle());

	const hwnd = bufferCastInt32(mainWindow.getNativeWindowHandle());
	ipcMain.on('hwnd', (event) => {
		b.webContents.send('get-hwnd', hwnd);
	});

	// shadowWindow.embeddedIntoDesktop();

	b = new BrowserWindow({
		// show: false,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			webviewTag: true,
			sandbox: false
		}
	});

	b.loadFile(resolve(__dirname, './b.html'));
	b.webContents.openDevTools();
	console.log(b.webContents.id);
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