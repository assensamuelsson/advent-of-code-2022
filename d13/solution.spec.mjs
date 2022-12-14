import assert from 'assert';
import fs from 'fs';

import {
  CompareResult,
  comparePackets,
  parsePackets,
} from './solution.mjs';

// Integers
assert.equal(comparePackets(1, 2), CompareResult.Correct);
assert.equal(comparePackets(2, 1), CompareResult.Incorrect);
assert.equal(comparePackets(1, 1), CompareResult.Indecisive);

// Flat lists same size
assert.equal(comparePackets([2], [3]), CompareResult.Correct);
assert.equal(comparePackets([3], [2]), CompareResult.Incorrect);
assert.equal(comparePackets([3], [3]), CompareResult.Indecisive);
assert.equal(comparePackets([3, 2], [3, 3]), CompareResult.Correct);
assert.equal(comparePackets([3, 4], [3, 3]), CompareResult.Incorrect);
assert.equal(comparePackets([3, 4], [3, 4]), CompareResult.Indecisive);

// Flat lists different size different values
assert.equal(comparePackets([3], [4, 2]), CompareResult.Correct);
assert.equal(comparePackets([5], [4, 2]), CompareResult.Incorrect);
assert.equal(comparePackets([3, 7], [4]), CompareResult.Correct);
assert.equal(comparePackets([5, 1], [4]), CompareResult.Incorrect);

// Flat lists different size same values
assert.equal(comparePackets([5], [5, 5]), CompareResult.Correct);
assert.equal(comparePackets([5, 5], [5]), CompareResult.Incorrect);

// Different types
assert.equal(comparePackets(3, [5]), CompareResult.Correct);
assert.equal(comparePackets(7, [5]), CompareResult.Incorrect);

// Examples
assert.equal(comparePackets([1,1,3,1,1], [1,1,5,1,1]), CompareResult.Correct);
assert.equal(comparePackets([[1],[2,3,4]], [[1],4]), CompareResult.Correct);
assert.equal(comparePackets([9], [[8,7,6]]), CompareResult.Incorrect);
assert.equal(comparePackets([7,7,7,7], [7,7,7]), CompareResult.Incorrect);
assert.equal(comparePackets([], [3]), CompareResult.Correct);
assert.equal(comparePackets([[[]]], [[]]), CompareResult.Incorrect);
assert.equal(comparePackets([1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9]), CompareResult.Incorrect);

// parsePackets
const example = fs.readFileSync('example.txt', 'utf-8');
assert.deepEqual(parsePackets(example), [
  { left: [1,1,3,1,1], right: [1,1,5,1,1] },
  { left: [[1],[2,3,4]], right: [[1],4] },
  { left: [9], right: [[8,7,6]] },
  { left: [[4,4],4,4], right: [[4,4],4,4,4] },
  { left: [7,7,7,7], right: [7,7,7] },
  { left: [], right: [3] },
  { left: [[[]]], right: [[]] },
  { left: [1,[2,[3,[4,[5,6,7]]]],8,9], right: [1,[2,[3,[4,[5,6,7]]]],8,9] },
]);
