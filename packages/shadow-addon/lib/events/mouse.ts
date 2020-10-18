import { initShadowMouseOptions, ShadowMouseOptions } from '../init_options';
import { ShadowWindowAction, ShadowUsefulHwnds } from './../shadow_window_action';
import { TS, ffi, CPP, ref, NULL } from 'win-win-api';
import { winFns } from '../win_fns';

import * as events from 'events';

const EventEmitter = events.EventEmitter;

const {
	TranslateMessage,
	SetWindowsHookExW,
	DispatchMessageW,
	GetMessageW,
	WindowFromPoint,
	GetTickCount,
	CallNextHookEx,
	CreateThread,
	UnhookWindowsHookEx,
	SendMessageW,
	MAKEWPARAM
} = winFns;

export enum MouseEvents {
	move = 'move',
	click = 'click',
	clickSpecifiedCount = 'clickSpecifiedCount',
	down = 'down',
	up = 'up',
	mouseInvisible = 'mouseInvisible',
	desktop = 'desktop',
}

interface MouseBasicEvent {
	x: number;
	y: number;
	window: ShadowWindowAction,
	hWndFromPoint: TS.HWND
}

export interface MouseMove extends MouseBasicEvent {
	hWndFromPoint: TS.HWND
}

export interface MouseClickEvent extends MouseBasicEvent {
	count: number
}

export interface MouseClickSpecifiedCount extends MouseBasicEvent { }

export interface MouseDown extends MouseBasicEvent {
	left: boolean;
	right: boolean;
}

export interface MouseUp extends MouseBasicEvent {
	left: boolean;
	right: boolean;
}

export interface MouseInvisible extends MouseBasicEvent { }

export interface MouseDesktop extends MouseBasicEvent { }

export class ShadowMouse extends EventEmitter {
	private _hWnds: ShadowUsefulHwnds;
	private _window: ShadowWindowAction;
	private _trigger: boolean;
	private _clickCount: number;
	// record last click time for continue click
	private _lastClickTime: number;
	public _options: ShadowMouseOptions;
	public _mouseHook!: TS.HANDLE;
	private _interactive: boolean;
	// public on: any;
	// private _mouseHook: any;

	/**
	 * 
	 *	@param { ShadowWindowAction } window - the ShadowWindowAction instance
	 *	@param { ShadowMouseOptions } options - the shadow mouse options
	 *	@param { boolean } [options.autoCreateThread = true] - if auto create a thread for mouse to not block the main process
	 * 
	 */
	constructor (window: ShadowWindowAction, options: ShadowMouseOptions = initShadowMouseOptions) {
		super();
		this._window = window;
		this._trigger = true;
		this._hWnds = this._window.hWnds;
		this._lastClickTime = 0;
		this._clickCount = 0;
		this._options = Object.assign({}, window.options?.mouse, initShadowMouseOptions, options);
		this._interactive = this._options.interactive!;
		this.setMaxListeners(Object.keys(MouseEvents).length / 2 + 1);
	}

	public mount = (register: (arg: ShadowMouse) => void): void => {
		register(this);

		if (this._options.autoCreateThread) {
			CreateThread(null, 0, this._createMouseThreadProc(), NULL, 0, NULL);
		} else {
			this._setMouseHook();
		}
	}

	public unmount = (): void => {
		this._trigger = false;

		UnhookWindowsHookEx(this._mouseHook);
	}

	// eslint-disable-next-line no-unused-vars
	private _setMouseHook = (lp?: TS.LPVOID): void => {
		// The hMod parameter must be set to NULL if the dwThreadId parameter specifies a thread created 
		// by the current process and if the hook procedure is within the code associated with the current process.
		try {
			this._mouseHook = SetWindowsHookExW(CPP.WH_MOUSE_LL, this._createMouseHookProc(), 0, 0);
			const msg: TS.RefStruct = new CPP.StructMSG();
			while (GetMessageW(msg.ref(), 0, 0, 0) && this._trigger) {
				TranslateMessage(msg.ref());
				DispatchMessageW(msg.ref());
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	private _createMouseThreadProc = () => ffi.Callback(CPP.DWORD, [CPP.LPVOID], this._setMouseHook)

	/**
	 *
	 *@param {boolean} -  Turn on or off interaction with the target window that under the desktop
	 *
	 */

	public setInteractive = (switcher: boolean): void => {
		this._interactive = switcher;
	}

	private _createMouseHookProc = () => ffi.Callback(CPP.LRESULT, [CPP.INT, CPP.WPARAM, ref.refType(CPP.StructMOUSEHOOKSTRUCT)],
		(nCode: TS.INT, wParam: TS.WPARAM, lParam: TS.RefStruct) => {
			const mouse: TS.MOUSEHOOKSTRUCT = lParam.deref();
			const pt = mouse.pt;
			const { x, y } = pt;
			const currentHwnd = WindowFromPoint(mouse.pt);
			const basicArg = {
				x,
				y,
				window: this._window,
				hWndFromPoint: currentHwnd
			};
			const basicMouseArg = { left: false, right: false, ...basicArg };
			const moveEvent = basicArg;
			const preSetClickCount = this._options.clickEmitCount;

			this.emit(MouseEvents.move, moveEvent);

			if (this._interactive) {
				SendMessageW(this._hWnds.target!, wParam as number, 0, MAKEWPARAM(x, y));
			}

			if (pt.x >= this._window.screen.width! - 3 || pt.y >= this._window.screen.height! - 2) {
				this.emit(MouseEvents.mouseInvisible, moveEvent);
			}

			if (wParam === CPP.WM_LBUTTONUP) {

				this.emit(MouseEvents.up, { ...basicMouseArg, left: true });
				this.emit(MouseEvents.click, { ...basicArg, count: this._clickCount });

				if (
					currentHwnd === this._hWnds.folderView
					|| currentHwnd === this._hWnds.frontWorker
					|| currentHwnd === this._hWnds.progman
				) {
					this.emit(MouseEvents.desktop);

					if (this._clickCount !== preSetClickCount) {
						this._clickCount++;
						this._lastClickTime = GetTickCount();
					} else if (this._clickCount === preSetClickCount) {
						const currentTime = GetTickCount();

						if (currentTime - this._lastClickTime <= this._options.clickEmitDuration!) {
							this.emit(MouseEvents.clickSpecifiedCount, basicArg);
							this._clickCount = 0;
						} else {
							this._clickCount = 0;
							this._lastClickTime = currentTime;
						}

					}
				}
			}

			if (wParam === CPP.WM_RBUTTONUP) { this.emit(MouseEvents.up, { ...basicMouseArg, right: true }); }

			if (wParam === CPP.WM_LBUTTONDOWN) { this.emit(MouseEvents.down, { ...basicMouseArg, left: true }); }

			if (wParam === CPP.WM_RBUTTONDOWN) { this.emit(MouseEvents.down, { ...basicMouseArg, right: true }); }

			return CallNextHookEx(0, nCode, wParam, lParam);
		}
	)
}

