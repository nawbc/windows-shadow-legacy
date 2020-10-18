
// import { WindowAction, MouseEvents, ShadowMouse, MouseClickCountEmit, MouseMove } from './lib';

// const hwnd = 0x000406C0;

// const win = new WindowAction(hwnd);

// win.embeddedIntoDesktop();

// const shadowMouse = new ShadowMouse(win);

// shadowMouse.mount((mouse) => {

// 	mouse.on(MouseEvents.up, (event) => {
// 		console.log(event);
// 	});

// 	mouse.on(MouseEvents.clickCountEmit, (event) => {
// 		// const { window } = event;
// 		// if (window.isWindowBehind) {
// 		// 	win.takeOutFromDesktop();
// 		// }
// 	});

// 	mouse.on(MouseEvents.move, (event) => {
// 		// const { window } = event;
// 		// if (event.x > window.screen.width - 5 && event.y < 20 && !window.isWindowBehind) {
// 		// 	window.embeddedIntoDesktop();
// 		// }
// 	});

// 	mouse.on(MouseEvents.mouseInvisible, (event) => {
// 		// console.log(event);
// 	});

// });

