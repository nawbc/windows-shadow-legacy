/**
 *	@ignore
 *
 */
import { WinWin, CPP, ref } from 'win-win-api';

export const overwriteFns = {
	CallNextHookEx: [CPP.LRESULT, [CPP.HHOOK, CPP.INT, CPP.WPARAM, ref.refType(CPP.StructMOUSEHOOKSTRUCT)]]
};

WinWin.overwrite({ user32Fns: overwriteFns });

export const winFns = new WinWin().winFns();

