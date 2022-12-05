import assert from 'assert';

import MySet from './myset.mjs';

const a = new MySet([1, 2, 3, 4, 5]);
const b = new MySet([3, 4, 5, 6, 7]);

assert.deepEqual(a.union(b), new MySet([1, 2, 3, 4, 5, 6, 7]));
assert.deepEqual(a.intersection(b), new MySet([3, 4, 5]));
assert.deepEqual(a.difference(b), new MySet([1, 2]));
assert.deepEqual(a.symmetricDifference(b), new MySet([1, 2, 6, 7]));