import assert from 'assert';
import fs from 'fs';

import {
  parseMap,
  putSand,
  fallenSands,
  fallenSandsWithFloor,
} from './solution.mjs';

assert.deepStrictEqual(parseMap('1,1 -> 1,3 -> 3,3'), {
  1: new Set([1, 2, 3]),
  2: new Set([3]),
  3: new Set([3]),
  maxY: 3,
});
assert.deepStrictEqual(parseMap('1,1 -> 1,3 -> 3,3\n4,4 -> 4,1'), {
  1: new Set([1, 2, 3]),
  2: new Set([3]),
  3: new Set([3]),
  4: new Set([1, 2, 3, 4]),
  maxY: 4,
});
assert.deepStrictEqual(parseMap('1,1 -> 1,3 -> 3,3\n4,4 -> 4,1\n5,2 -> 1,2'), {
  1: new Set([1, 2, 3]),
  2: new Set([3, 2]),
  3: new Set([3, 2]),
  4: new Set([1, 2, 3, 4]),
  5: new Set([2]),
  maxY: 4,
});

const example = fs.readFileSync('example.txt', 'utf-8');
const exampleMap = parseMap(example);

assert.equal(exampleMap.maxY, 9);

assert(!exampleMap[500].has(8))
putSand(exampleMap, 500, 0);
assert(exampleMap[500].has(8))

assert(!exampleMap[499].has(8))
putSand(exampleMap, 500, 0);
assert(exampleMap[499].has(8))

assert(!exampleMap[501].has(8))
putSand(exampleMap, 500, 0);
assert(exampleMap[501].has(8))

for (let i = 0; i < 21; i++) {
  putSand(exampleMap, 500, 0);
}

assert(!putSand(exampleMap, 500, 0))

const exampleMap2 = parseMap(example);
assert.equal(fallenSands(exampleMap2, 500, 0), 24)

const exampleMap3 = parseMap(example);
assert.equal(fallenSandsWithFloor(exampleMap3, 500, 0), 93)
