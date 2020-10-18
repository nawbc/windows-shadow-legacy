const { ShadowMouse, ShadowWindowAction, MouseEvents } = require('shadow-addon');

// console.log(ShadowMouse);
const { ipcRenderer, webContents, remote } = require('electron');

ipcRenderer.once('get-hwnd', (e, hwnd) => {

	console.log(hwnd);

	const win = new ShadowWindowAction(hwnd);

	win.embeddedIntoDesktop();
	const mouse = new ShadowMouse(window);

	mouse.on(MouseEvents.clickSpecifiedCount, (event) => {
		const { window } = event;
		if (window.isUnderDesktop) {
			win.takeOutFromDesktop();
			mouse.setInteractive(false);
		}
	});

	mouse.on(MouseEvents.move, (event) => {
		const { window } = event;
		console.log(event);
		if (event.x > window.screen.width - 5 && event.y < 20 && !window.isUnderDesktop) {
			window.embeddedIntoDesktop();
		}
	});
	// ipcRenderer.sendTo(2, 'fucker', 'dsadsadas');
});

// ipcRenderer.on('', (e, a) => {
// 	console.log(a);
// });