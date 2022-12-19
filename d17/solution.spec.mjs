import assert from 'assert';

import {
  createRockBuilder,
  createChamber,
  toGlobalCoords,
  getBlockSpawn,
  canMoveRight,
  moveRight,
  canMoveLeft,
  moveLeft,
  canMoveDown,
  moveDown,
  freeze,
  createGustBuilder,
} from './solution.mjs';

const nextRock = createRockBuilder();

assert.deepStrictEqual(nextRock(0), [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
]);

assert.deepStrictEqual(nextRock(1), [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
]);

assert.deepStrictEqual(nextRock(2), [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
]);

assert.deepStrictEqual(nextRock(3), [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 },
]);

assert.deepStrictEqual(nextRock(4), [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
]);

const rock = nextRock(4);
rock[0].x = 99;
assert.equal(nextRock(4)[0].x, 0);

const chamber = createChamber();
assert.deepStrictEqual(chamber, {
  maxY: 0,
  minY: 0,
  tiles: [
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
  ],
});

assert.deepStrictEqual(getBlockSpawn(chamber), { x: 2, y: 4 });
assert.deepStrictEqual(getBlockSpawn({ maxY: 345 }), { x: 2, y: 345 + 4 });

const r1 = nextRock(0);
toGlobalCoords(r1, { x: 2, y: 57});
assert.deepStrictEqual(r1, [
  { x: 2, y: 57 },
  { x: 3, y: 57 },
  { x: 4, y: 57 },
  { x: 5, y: 57 },
]);

// Simulation
const square = nextRock(4);
toGlobalCoords(square, getBlockSpawn(chamber));

for (let i = 0; i < 3; i++) {
  assert(canMoveRight(square, chamber));
  moveRight(square);
}
assert(!canMoveRight(square, chamber));

for (let i = 0; i < 5; i++) {
  assert(canMoveLeft(square, chamber));
  moveLeft(square);
}
assert(!canMoveLeft(square, chamber));

for (let i = 0; i < 3; i++) {
  assert(canMoveDown(square, chamber));
  moveDown(square);
}
assert(!canMoveDown(square, chamber));

freeze(square, chamber);
assert.equal(chamber.maxY, 2);
assert(chamber.tiles[0].has(1))
assert(chamber.tiles[0].has(2))
assert(chamber.tiles[1].has(1))
assert(chamber.tiles[1].has(2))

const plus = nextRock(1);
toGlobalCoords(plus, getBlockSpawn(chamber));
moveLeft(plus);
for (let i = 0; i < 4; i++) {
  assert(canMoveDown(plus, chamber));
  moveDown(plus);
}
assert(!canMoveDown(plus, chamber));

const gustBuilder = createGustBuilder('<<>>');
assert.deepStrictEqual(gustBuilder(0), {
  test: canMoveLeft,
  action: moveLeft,
});
assert.deepStrictEqual(gustBuilder(2), {
  test: canMoveRight,
  action: moveRight,
});
assert.deepStrictEqual(gustBuilder(4), {
  test: canMoveLeft,
  action: moveLeft,
});