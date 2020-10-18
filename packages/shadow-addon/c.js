const { WinWin, CPP } = require('win-win');

const win = new WinWin().user32();

const list = 0x0003024E;
const LVM_FIRST = 0x1000;
const L = 0x0003066E;

// win.SendMessageW(list, CPP.LVM_GETITEMCOUNT, 0, 0);
// const a = win.SendMessageW(list, CPP.LVM_GETITEMCOUNT, 0, 0);

// const hWndHdr = win.SendMessageW(list, 0x1000 + 32, 0, 0);
const count = win.SendMessageW(list, 1234, 1, 1);
// console.log(a);
// console.log(hWndHdr);
// console.log(count);