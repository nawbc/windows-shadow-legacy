import { winFns } from './win_fns';

/**
 *	@ignore 
 */
const { GetDoubleClickTime } = winFns;

export interface ShadowMouseOptions {
	/**
	 *
	 *
	 * @type {boolean}
	 * @memberof ShadowMouseOptions
	 */
	autoCreateThread?: boolean;
	/**
	 *
	 *
	 * @type {number}
	 * @memberof ShadowMouseOptions
	 * @default 4
	 */
	clickEmitCount?: number;
	/**
	 *
	 *
	 * @type {number}
	 * @memberof ShadowMouseOptions
	 * @default 200 - `GetDoubleClickTime() - 300`
	 */
	clickEmitDuration?: number;
	/**
	 *
	 *
	 * @type {boolean}
	 * @memberof ShadowMouseOptions
	 * @default true
	 */
	interactive?: boolean;
}

export const initShadowMouseOptions = {
	autoCreateThread: true,
	clickEmitCount: 4,
	clickEmitDuration: GetDoubleClickTime() - 300,
	interactive: true
};

export interface EmbeddedOption {
	/**
	 *
	 *	Maximize embedding, if `false` window will flash when embedding
	 * @type {boolean}
	 * @memberof EmbeddedOption
	 * @default true
	 */
	maximize?: boolean;
}

export const initEmbeddedOption = {
	maximize: true
};

export interface TakeOutOption {
	/**
	 *
	 *	Maximize embedding, if `false` window will flash when embedding
	 * @type {boolean}
	 * @memberof EmbeddedOption
	 * @default true
	 */
	maximize?: boolean;
	/**
	 *
	 *	set window at top when take out
	 * @type {boolean}
	 * @memberof TakeOutOption
	 * @default true
	 */
	topmost?: boolean;
}

export const initTakeOutOption = {
	maximize: true,
	topmost: true
};

export interface ShadowWindowActionOption {
	/**
	 *
	 *
	 * @type {boolean}
	 * @memberof ShadowWindowActionOption
	 * @default false
	 */
	isDebug?: boolean;
	/**
	 *
	 *
	 * @type {ShadowMouseOptions}
	 * @memberof ShadowWindowActionOption
	 * @default initShadowMouseOptions
	 */
	mouse?: ShadowMouseOptions;

	// /**
	//  *
	//  *	let target window always on the most top , use windows api `setWindowPos`
	//  * @type {boolean}
	//  * @memberof ShadowWindowActionOption
	//  * @default true
	//  */
	// alawaysOnTop?: boolean
}

export const initShadowWindowActionOption = {
	isDebug: false,
	mouse: initShadowMouseOptions
	// alawaysOnTop: false
};

