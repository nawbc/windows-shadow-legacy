# `shadow-addon`

> TODO: description

## Usage

[Document](./doc/index.html)

## Notice

#### Common misuse
```ts
import { WindowAction, MouseEvents, ShadowMouse  } from 'shadow-addon';

const hwnd = 0x000406C0;

const win = new WindowAction(hwnd);
win.embeddedIntoDesktop();

//will create a new thread
const shadowMouse = new ShadowMouse(win);

shadowMouse.mount((mouse) => {
	mouse.on(MouseEvents.move, (event) => {

// error this is another thread can't get win, windows will report resource error
// Solve using the window object in the event. Of course you can also turn off autoCreateThread and use worker_threads
		if (event.x > win.screen.width - 5 && event.y < 20 && !event.isWindowBehind) {
			win.embeddedIntoDesktop();
		}
	});
});
```
