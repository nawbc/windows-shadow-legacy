import * as os from 'os';

export const bufferCastInt8 = function (buf: Buffer): number {
	return buf.readInt8();
};

export const bufferCastInt16 = function (buf: Buffer): number {
	return os.endianness() == "LE" ?
		buf.readInt16LE() : buf.readInt16BE();
};

export const bufferCastInt32 = function (buf: Buffer): number {
	return os.endianness() == "LE" ?
		buf.readInt32LE() : buf.readInt32BE();
};

export const bufferCastInt = function (buf: Buffer): number {
	const blen = buf.byteLength;
	return os.endianness() == "LE" ?
		buf.readIntLE(0, blen) : buf.readIntBE(0, blen);
};

