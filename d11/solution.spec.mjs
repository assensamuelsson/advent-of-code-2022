import assert from 'assert';

import {
  setupExampleInitialCondition,
} from './solution.mjs';


const monkies = setupExampleInitialCondition((item) => Math.floor(item / 3));
const [m0, m1, m2, m3] = monkies;

assert.deepEqual(m0.items, [79, 98]);
assert.equal(m0.operation(79), 79 * 19);
assert(m0.test(23*14));
assert(!m0.test(23*14 + 1));
assert.equal(m0.outcomes[true], 2);
assert.equal(m0.outcomes[false], 3);

// First monkey inspects first item
m0.inspectItem();
assert.equal(m0.items[0], 1501);
assert.equal(m0.nrOfInspectedItems, 1);

m0.easeWorry();
assert.equal(m0.items[0], 500);

assert.equal(m0.testItem(), 3);

m0.throw(3, monkies);
assert.equal(m0.items.length, 1);
assert.equal(m3.items.length, 2);
assert.equal(m3.items[m3.items.length - 1], 500);

// First monkey inspects 2nd item
m0.inspectAllItems(monkies);
assert.equal(m0.items.length, 0);
assert.equal(m3.items.length, 3);
assert.equal(m3.items[m3.items.length - 1], 620);

// Rest of monkies inspects items
m1.inspectAllItems(monkies);
m2.inspectAllItems(monkies);
m3.inspectAllItems(monkies);
assert.deepEqual(m0.items, [20, 23, 27, 26])
assert.deepEqual(m1.items, [2080, 25, 167, 207, 401, 1046])
assert.deepEqual(m2.items, [])
assert.deepEqual(m3.items, [])

// 19 more rounds
for (let i = 0; i < 19; i++) {
  monkies.forEach(monkey => monkey.inspectAllItems(monkies));
}
assert.deepEqual(m0.items, [10, 12, 14, 26, 34])
assert.deepEqual(m1.items, [245, 93, 53, 199, 115])
assert.deepEqual(m2.items, [])
assert.deepEqual(m3.items, [])
assert.equal(m0.nrOfInspectedItems, 101);
assert.equal(m1.nrOfInspectedItems, 95);
assert.equal(m2.nrOfInspectedItems, 7);
assert.equal(m3.nrOfInspectedItems, 105);
