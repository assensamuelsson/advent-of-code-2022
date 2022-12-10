import fs from 'fs';
import assert from 'assert';

import {
  getCycles,
  getSignalStrength,
  isInterestingCycle,
} from './solution.mjs';

const ex1Instructions = fs.readFileSync('example1.txt', 'utf8').split('\n');
const ex2Instructions = fs.readFileSync('example2.txt', 'utf8').split('\n');

assert.deepEqual(getCycles(ex1Instructions), [1, 1, 1, 4, 4, -1]);

const ex2Cycles = getCycles(ex2Instructions);
const ex2SignalStrengs = ex2Cycles.map(getSignalStrength);

assert.equal(ex2Cycles[19], 21);
assert.equal(ex2SignalStrengs[19], 420);
assert.equal(ex2Cycles[59], 19);
assert.equal(ex2SignalStrengs[59], 1140);
assert.equal(ex2Cycles[99], 18);
assert.equal(ex2SignalStrengs[99], 1800);
assert.equal(ex2Cycles[139], 21);
assert.equal(ex2SignalStrengs[139], 2940);
assert.equal(ex2Cycles[179], 16);
assert.equal(ex2SignalStrengs[179], 2880);
assert.equal(ex2Cycles[219], 18);
assert.equal(ex2SignalStrengs[219], 3960);

assert(isInterestingCycle(null, 19));
assert(!isInterestingCycle(null, 20));
assert(isInterestingCycle(null, 219));
