import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { resolve } from 'path';
import { remote } from 'electron';
// import { CityNight } from 'shadow-ui';
// import './index.scss';

const { app, BrowserWindow } = remote;

const MainWindow: FC<any> = function (props) {

	return (
		<div
			className="fucker"
		// style={{
		// 	width: 500,
		// 	height: 500,
		// 	backgroundColor: 'red',
		// 	position: 'relative'
		// }}
		>
			<button
				style={{
					position: 'absolute',
					top: 30,
					right: 30
				}}
				onClick={() => {
					const settingWindow = new BrowserWindow({
						width: 800,
						height: 500,
						webPreferences: {
							nodeIntegration: true,
							webSecurity: false,
							webviewTag: true
						}
					});
					settingWindow.loadFile(resolve(app.getAppPath(), './setting.html'));
				}}>Click</button>
		</div>
	);
};

ReactDOM.render(<MainWindow />, document.getElementById('shadow-root'));
