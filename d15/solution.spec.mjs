import assert from 'assert';

import {
  parseRow,
  manhattanDistance,
  sensorAndDistance,
  isSensorCoveringRow,
  sensorCoverageInRow,
  regionsMissing,
} from './solution.mjs';

[
  {
    input: 'Sensor at x=2, y=1: closest beacon is at x=2, y=1',
    expected: { sensor: { x: 2, y: 1 }, beacon: { x: 2, y: 1 } }
  },
  {
    input: 'Sensor at x=-2, y=-1: closest beacon is at x=-2, y=-1',
    expected: { sensor: { x: -2, y: -1 }, beacon: { x: -2, y: -1 } }
  },
  {
    input: 'Sensor at x=-2345, y=12345: closest beacon is at x=-98765, y=4567',
    expected: { sensor: { x: -2345, y: 12345 }, beacon: { x: -98765, y: 4567 } }
  },
].forEach(({ input, expected }) => {
  assert.deepStrictEqual(parseRow(input), expected);
});

[
  {
    input: { sensor: { x: 2, y: 1 }, beacon: { x: 2, y: 1 } },
    expected: 0
  },
  {
    input: { sensor: { x: -3, y: 1 }, beacon: { x: 5, y: -3 } },
    expected: 8 + 4
  },
].forEach(({ input, expected }) => {
  assert.deepStrictEqual(manhattanDistance(input.sensor, input.beacon), expected);
})

assert.deepStrictEqual(
  sensorAndDistance({ sensor: { x: -3, y: 1 }, beacon: { x: 5, y: -3 }}),
  { sensor: { x: -3, y: 1 }, distance: 8 + 4 },
)

assert(isSensorCoveringRow({ sensor: { x: 1, y: 1 }, distance: 3 }, 1))
assert(isSensorCoveringRow({ sensor: { x: 1, y: 1 }, distance: 3 }, 4))
assert(!isSensorCoveringRow({ sensor: { x: 1, y: 1 }, distance: 3 }, 5))

assert.deepEqual(
  sensorCoverageInRow({ sensor: { x: 1, y: 1 }, distance: 1 }, 2),
  { start: 1, end: 1},
)
assert.deepEqual(
  sensorCoverageInRow({ sensor: { x: 1, y: 1 }, distance: 1 }, 1),
  { start: 0, end: 2},
)
assert.deepEqual(
  sensorCoverageInRow({ sensor: { x: 1, y: 1 }, distance: 1 }, 0),
  { start: 1, end: 1},
)
assert.deepEqual(
  sensorCoverageInRow({ sensor: { x: 12, y: 14 }, distance: 4 }, 10),
  { start: 12, end: 12 },
)

assert.equal(regionsMissing([{ start: 5, end: 15 }], 0, 20).length, 2)
assert.equal(regionsMissing([{ start: 0, end: 15 }], 0, 20).length, 1)
assert.equal(regionsMissing([{ start: 5, end: 20 }], 0, 20).length, 1)
assert.equal(regionsMissing([{ start: 0, end: 20 }], 0, 20).length, 0)

assert.equal(regionsMissing([{ start: 0, end: 10 }, { start: 11, end: 20 }], 0, 20).length, 0)
assert.equal(regionsMissing([{ start: 0, end: 15 }, { start: 5, end: 20 }], 0, 20).length, 0)
assert.equal(regionsMissing([{ start: 5, end: 15 }, { start: -1, end: 6 }, { start: 14, end: 21 }], 0, 20).length, 0)
assert.equal(regionsMissing([{ start: -2, end: 10 }, { start: 12, end: 21 }], 0, 20).length, 1)