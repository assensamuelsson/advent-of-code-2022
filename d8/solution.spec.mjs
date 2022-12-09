import assert from 'assert';
import fs from 'fs';

import {
  parseInput,
  isTreeVisible,
  countVisibleTrees,
  calcScenicScore,
  getMaxScenicScores,
} from './solution.mjs';

const exampleInput = fs.readFileSync('example.txt', 'utf-8');
const exampleTrees = parseInput(exampleInput);

assert.deepEqual(parseInput('12\n34'), [[1, 2], [3, 4]]);

// Corner trees
assert(isTreeVisible(exampleTrees, 0, 0));
assert(isTreeVisible(exampleTrees, 0, 4));
assert(isTreeVisible(exampleTrees, 4, 0));
assert(isTreeVisible(exampleTrees, 4, 4));

// Edge trees
assert(isTreeVisible(exampleTrees, 0, 2));
assert(isTreeVisible(exampleTrees, 2, 4));
assert(isTreeVisible(exampleTrees, 4, 2));
assert(isTreeVisible(exampleTrees, 2, 0));

// Inner trees
assert(isTreeVisible(exampleTrees, 1, 1));
assert(isTreeVisible(exampleTrees, 1, 2));
assert(!isTreeVisible(exampleTrees, 1, 3));

assert(isTreeVisible(exampleTrees, 2, 1));
assert(!isTreeVisible(exampleTrees, 2, 2));
assert(isTreeVisible(exampleTrees, 2, 3));

assert(!isTreeVisible(exampleTrees, 3, 1));
assert(isTreeVisible(exampleTrees, 3, 2));
assert(!isTreeVisible(exampleTrees, 3, 3));

assert.equal(countVisibleTrees(exampleTrees), 21);

assert.equal(calcScenicScore(exampleTrees, 0, 0), 0);
assert.equal(calcScenicScore(exampleTrees, 1, 2), 4);
assert.equal(calcScenicScore(exampleTrees, 3, 2), 8);

assert.equal(getMaxScenicScores(exampleTrees), 8);
