import { Math as M } from 'phaser';

const _d = (n: number) => M.RoundTo(M.RadToDeg(n));
const _r = M.RoundTo;
const _f = (n: number) => M.RoundTo(n, -3);

const Math_ = Math;

export { Math_, _r, _f, _d };