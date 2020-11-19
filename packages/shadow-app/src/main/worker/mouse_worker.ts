// import { ShadowWindowAction, ShadowMouse, MouseEvents, MouseMove, MouseClickSpecifiedCount } from 'shadow-addon';

console.log('1111111111111111111111111');
console.log(process.argv);
// const targetHwnd = workerData as number;
// const shadowWindow = new ShadowWindowAction(targetHwnd);

// shadowWindow.embeddedIntoDesktop();

// console.log(shadowWindow);

// const shadowMouse = new ShadowMouse(shadowWindow, {
// 	autoCreateThread: false
// });

// shadowMouse.mount((mouse: ShadowMouse) => {

// 	mouse.on(MouseEvents.clickSpecifiedCount, (event: MouseClickSpecifiedCount) => {
// 		const { window } = event;
// 		console.log(window);
// 		if (window.isUnderDesktop) {
// 			shadowWindow.takeOutFromDesktop();
// 			mouse.setInteractive(false);
// 		}
// 	});

// 	mouse.on(MouseEvents.move, (event: MouseMove) => {
// 		const { window } = event;
// 		if (event.x > window.screen.width - 5 && event.y < 20 && !window.isUnderDesktop) {
// 			window.embeddedIntoDesktop();
// 		}
// 	});
// });

