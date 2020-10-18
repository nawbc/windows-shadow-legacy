import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { resolve } from 'path';
import { remote } from 'electron';
// import { CityNight } from 'shadow-ui';
// import './index.scss';

const { app, BrowserWindow } = remote;

const SettingWindow: FC<any> = function (props) {

	return (
		<div >
			<button onClick={() => {
				const settingWindow = new BrowserWindow({
					// frame: false,
					// transparent: true,
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

ReactDOM.render(<SettingWindow />, document.getElementById('setting-root'));
