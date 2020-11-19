import { BrowserWindow } from "electron";
import { endianness } from 'os';

export const getNativeWindowHandleInt = function (win: BrowserWindow): number {
	const buf: Buffer = win.getNativeWindowHandle();
	return endianness() === 'LE' ? buf.readInt32LE(0) : buf.readInt32BE(0);
};