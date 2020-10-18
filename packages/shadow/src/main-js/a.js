const { ipcRenderer, remote } = require('electron');

const button = document.querySelector('button');

ipcRenderer.send('hwnd', 'fucker');

button.onclick = () => {
	console.log(remote.getCurrentWebContents());
};

// ipcRenderer.on('h', (e, a) => {
// 	console.log(a);
// });

ipcRenderer.on('fucker', (e, a) => {
	console.log(a);
});