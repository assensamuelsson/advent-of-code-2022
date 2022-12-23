import assert from 'assert';
import { EventEmitter } from 'events';

import {
  Monkey,
} from './solution.mjs';

let emittedNumber;

const emitter = new EventEmitter();
emitter.on('abcd', (number) => emittedNumber = number);

const monkey = new Monkey('abcd', emitter, '2');

assert.equal(monkey.name, 'abcd');
assert.equal(monkey.number, 2);
assert.equal(new Monkey('abce', emitter, 'abcd + qwer').number, undefined);

monkey.yellIfNumber();
assert.equal(emittedNumber, 2);

const results = {};
emitter.on('rtyu', (number) => results.rtyu = number);

const m1 = new Monkey('wert', emitter, '5')
const m2 = new Monkey('erty', emitter, '7')
const m3 = new Monkey('rtyu', emitter, 'wert + erty')
m1.yellIfNumber();
m2.yellIfNumber();

assert.equal(results.rtyu, 12);
