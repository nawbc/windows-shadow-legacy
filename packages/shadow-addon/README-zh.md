# `shadow-addon`

> TODO: description

## Usage

[Document](./doc/index.html)

## Notice

#### 常见错误使用
```ts
import { WindowAction, MouseEvents, ShadowMouse  } from 'shadow-addon';

const hwnd = 0x000406C0;

const win = new WindowAction(hwnd);
win.embeddedIntoDesktop();

// 会创建一个新的线程
const shadowMouse = new ShadowMouse(win);

shadowMouse.mount((mouse) => {
	mouse.on(MouseEvents.move, (event) => {
	// 错误 这是另一个线程 无法获取win,   windows 会报资源错误 
	// 解决  使用event里的window对象 当然你也可以关闭  autoCreateThread 使用 worker_threads 
		if (event.x > win.screen.width - 5 && event.y < 20 && !event.isWindowBehind) {
			win.embeddedIntoDesktop();
		}
	});
});
```
