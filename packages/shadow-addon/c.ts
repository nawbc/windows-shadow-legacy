
import { ShadowWindowAction, MouseEvents, ShadowMouse, MouseClickSpecifiedCount, MouseMove, MouseUp } from './lib';

const hwnd = 0x007E08F0;

const win = new ShadowWindowAction(hwnd);

win.embeddedIntoDesktop();

const a = win.getDesktopIconsCount();
console.log(a);

const shadowMouse = new ShadowMouse(win);

shadowMouse.mount((mouse) => {

	mouse.on(MouseEvents.up, (event: MouseUp) => {

	});

	mouse.on(MouseEvents.clickSpecifiedCount, (event: MouseClickSpecifiedCount) => {
		const { window } = event;
		console.log(event);
		if (window.isUnderDesktop) {
			win.takeOutFromDesktop();
			mouse.setInteractive(false);
		}
	});

	mouse.on(MouseEvents.move, (event: MouseMove) => {
		const { window } = event;
		console.log('move 事件');
		console.log(event);
		if (event.x > window.screen.width - 5 && event.y < 20 && !window.isUnderDesktop) {
			window.embeddedIntoDesktop();
		}
	});

	mouse.on(MouseEvents.mouseInvisible, (event) => {
		// console.log(event);
	});

});

