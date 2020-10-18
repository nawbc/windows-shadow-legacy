// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ShadowWindowAction, MouseEvents, ShadowMouse, MouseClickCountEmit, MouseMove, MouseUp } from 'shadow-addon';

// the window handle that you wanna operate you can use spyxx to get
const hwnd = 0x0007056C;

const win = new ShadowWindowAction(hwnd);

win.embeddedIntoDesktop();

const shadowMouse = new ShadowMouse(win);

shadowMouse.mount((mouse) => {

	mouse.on(MouseEvents.up, (event: MouseUp) => {

	});

	mouse.on(MouseEvents.clickCountEmit, (event: MouseClickCountEmit) => {
		console.log(event);
		const { window } = event;
		if (window.isUnderDesktop) {
			win.takeOutFromDesktop();
			mouse.setInteractive(false);
		}
	});

	mouse.on(MouseEvents.move, (event: MouseMove) => {
		const { window } = event;
		if (event.x > window.screen.width - 5 && event.y < 20 && !window.isUnderDesktop) {
			window.embeddedIntoDesktop();
		}
	});

	mouse.on(MouseEvents.mouseInvisible, (event) => {

	});

});

