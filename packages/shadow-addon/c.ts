
import {
	ShadowWindowAction,
	MouseEvents,
	ShadowMouse,
	MouseClickSpecifiedCount,
	MouseMove,
	MouseUp
} from './lib';

const hwnd = 0x002209D4;

const win = new ShadowWindowAction(hwnd);

win.embeddedIntoDesktop();

const a = win.getDesktopIconsCount();
console.log(a);

const shadowMouse = new ShadowMouse(win, {
	clickEmitCount: 2
});

	// shadowMouse.on(MouseEvents.up, (event: MouseUp) => {
		
	// });

	// shadowMouse.on(MouseEvents.clickSpecifiedCount, (event: MouseClickSpecifiedCount) => {
	// 	const { window } = event;
	// 	console.log('点击事件');
	// 	console.log(event);
	// 	if (window.isUnderDesktop) {
	// 		win.takeOutFromDesktop();
	// 		shadowMouse.setInteractive(false);
	// 	}
	// });

	// shadowMouse.on(MouseEvents.move, (event: MouseMove) => {
	// 	const { window } = event;
	// 	// console.log('move 事件');
	// 	// console.log(event);
	// 	if (event.x > window.screen.width - 5 && event.y < 20 && !window.isUnderDesktop) {
	// 		window.embeddedIntoDesktop();
	// 	}
	// });

	// shadowMouse.on(MouseEvents.mouseInvisible, (event) => {
	// 	// console.log(event);
	// });

shadowMouse.mount((mouse) => {

	mouse.on(MouseEvents.up, (event: MouseUp) => {
		
	});

	mouse.on(MouseEvents.clickSpecifiedCount, (event: MouseClickSpecifiedCount) => {
		const { window } = event;
		console.log('点击事件');
		console.log(event);
		if (window.isUnderDesktop) {
			win.takeOutFromDesktop();
			// mouse.setInteractive(false);
		}
	});

	mouse.on(MouseEvents.move, (event: MouseMove) => {
		const { window } = event;
		// console.log('move 事件');
		// console.log(event);
		if (event.x > window.screen.width - 5 && event.y < 20 && !window.isUnderDesktop) {
			window.embeddedIntoDesktop();
		}
	});

	mouse.on(MouseEvents.mouseInvisible, (event) => {
		// console.log(event);
	});

});

