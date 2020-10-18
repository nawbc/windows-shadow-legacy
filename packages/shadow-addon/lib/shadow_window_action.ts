
import { SPLIT_PROGRAM_MG } from './constants';
import { bufferCastInt32 } from './utils';
import { TS, _T, CPP, ffi } from 'win-win-api';
import { ShadowMouse } from './events';
import { winFns } from './win_fns';
import {
	initEmbeddedOption,
	EmbeddedOption,
	ShadowWindowActionOption,
	initShadowWindowActionOption,
	initTakeOutOption,
	TakeOutOption
} from './init_options';

export interface ShadowUsefulHwnds {
	target: TS.HWND;
	progman: TS.HWND;
	/* windows splits desktop into two parts, the front workerw contains the SysListView32 */
	frontWorker: TS.HWND;
	behindWorker: TS.HWND;
	folderView: TS.HWND;
	desktop: TS.HWND;
}

export interface Screen {
	width: number;
	height: number;
}

const {
	FindWindowExW,
	GetDesktopWindow,
	SendMessageW,
	EnumWindows,
	SetParent,
	GetSystemMetrics,
	SetWindowPos,
	SetForegroundWindow
} = winFns;

export class ShadowWindowAction {
	private _progmanCls: Buffer;
	private _shellViewCls: Buffer;
	private _folderViewCls: Buffer;
	private _workerCls: Buffer;

	public screen: Screen;
	public isUnderDesktop: boolean;
	public hWnds: ShadowUsefulHwnds;
	public options: ShadowWindowActionOption;

	/**
	 * @param {TS.HWND} targetHwnd - the target window handle
	 * @param {ShadowWindowActionOption} options - window action options
	 * 
	 * @example
	 * 
	 * ```ts
	 * new ShadowWindowAction(mainWindow.getNativeWindowHandle())
	 * new ShadowWindowAction(0x000406C0)
	 * ```
	 */

	// eslint-disable-next-line @typescript-eslint/ban-types
	constructor (
		targetHwnd: TS.HWND,
		options: ShadowWindowActionOption = initShadowWindowActionOption
	) {

		this.hWnds = {} as ShadowUsefulHwnds;
		this._progmanCls = _T("Progman\0");
		this._shellViewCls = _T("SHELLDLL_DefView\0");
		this._folderViewCls = _T("SysListView32\0");
		this._workerCls = _T("WorkerW\0");
		this.isUnderDesktop = false;

		if (targetHwnd instanceof Buffer) {
			this.hWnds.target = bufferCastInt32(targetHwnd);
		} else if (typeof targetHwnd === 'number') {
			this.hWnds.target = targetHwnd;
		} else {
			throw new TypeError('1 argument needs to be Buffer or Number');
		}

		this.options = options;
		this.screen = {
			width: GetSystemMetrics(CPP.SM_CXSCREEN),
			height: GetSystemMetrics(CPP.SM_CYSCREEN)
		};
		this._init();
	}

	public get mouse(): ShadowMouse {
		return new ShadowMouse(this);
	}

	private _init = () => {
		this._findProgmanWindow();
		this._splitWorkerAndFind();
		this.hWnds.desktop = GetDesktopWindow();	
	}

	private _findProgmanWindow = (): void => {
		const tmp: TS.HWND = FindWindowExW(0, 0, this._progmanCls, null);
		if (tmp !== null) {
			this.hWnds.progman = tmp;
		} else {
			throw new Error('Not find the program manager hwnd');
		}
	}

	private _createEnumWindowProc = () => ffi.Callback(CPP.BOOL, [CPP.HWND, CPP.LPARAM], (hWnd: TS.HWND) => {
		const tmpShellView: TS.HWND = FindWindowExW(hWnd, 0, this._shellViewCls, null);
		const tmpFolderView: TS.HWND = FindWindowExW(tmpShellView, 0, this._folderViewCls, null);
		if (tmpShellView !== 0 && tmpFolderView !== 0) {
			const tmpBackWorkerHwnd = FindWindowExW(0, hWnd, this._workerCls, null);
			this.hWnds.frontWorker = hWnd;
			this.hWnds.folderView = tmpFolderView;
			if (tmpBackWorkerHwnd !== 0) {
				this.hWnds.behindWorker = tmpBackWorkerHwnd;
			}
		}
		return true;
	});

	private _splitWorkerAndFind = () => {
		SendMessageW(this.hWnds.progman!, SPLIT_PROGRAM_MG, 0, 0);
		EnumWindows(this._createEnumWindowProc(), 0);

		if (this.hWnds.frontWorker === 0) {
			throw new Error('Not Found front worker Hwnd');
		}

		if (this.hWnds.behindWorker === 0) {
			throw new Error('Not Found back worker Hwnd');
		}

		if (this.hWnds.folderView === 0) {
			throw new Error('Not Found folder view Hwnd');
		}
	}

	/**
	 *
	 *	maximize window , no z-order
	 * @memberof ShadowWindowAction
	 */
	public maximize(): void {
		SetWindowPos(this.hWnds.target!, 0, 0, 0, this.screen.width!, this.screen.height!, CPP.SWP_NOZORDER);
		SendMessageW(this.hWnds.target!, CPP.WM_SYSCOMMAND, CPP.SC_MAXIMIZE, 0);
	}

	/**
	 *
	 *	embedded window into desktop
	 * @memberof ShadowWindowAction
	 */
	public embeddedIntoDesktop = (options: EmbeddedOption = initEmbeddedOption): void => {
		try {
			const { maximize } = options;
			SetParent(this.hWnds.target!, this.hWnds.behindWorker!);
			this.isUnderDesktop = true;
			maximize && this.maximize();
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 *
	 *	take out from desktop
	 * @memberof ShadowWindowAction
	 * @param {TakeOutOption} [options=initTakeOutOption] - take out from desktop options
	 */
	public takeOutFromDesktop = (options: TakeOutOption = initTakeOutOption): void => {
		try {
			const { maximize, topmost } = options;
			SetParent(this.hWnds.target!, this.hWnds.desktop!);
			this.isUnderDesktop = false;
			maximize && this.maximize();
			topmost && this.setForeground();
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 *
	 *	
	 * @memberof ShadowWindowAction
	 */
	public setForeground = (): void => {
		SetForegroundWindow(this.hWnds.target);
	}

	/**
	 *
	 *	what is obtained is the quantity after spit `progman`, if not split will get 0
	 * @memberof ShadowWindowAction
	 */
	public getDesktopIconsCount = (): number => {
		return SendMessageW(this.hWnds.folderView, CPP.LVM_GETITEMCOUNT, 0, 0) as number;
	}
}
