import assert from 'assert';

import {
  getHeadMovements,
  isAdjacent,
  moveTail,
} from './solution.mjs';

const testGetHeadMovements = () => {
  [
    ['R 4', {x: 4, y: 0}],
    ['U 5', {x: 0, y: 5}],
    ['L 6', {x: -6, y: 0}],
    ['D 3', {x: 0, y: -3}],
  ].forEach(([input, expected]) => {
    const head = {x: 0, y: 0};
    const moves = getHeadMovements(input);
  
    moves.forEach(move => move(head));

    assert.deepEqual(head, expected);
  });
}

const testIsAdjacent = () => {
  assert(isAdjacent({x: 0, y: 0}, {x: 0, y: 0}));
  assert(isAdjacent({x: 0, y: 0}, {x: 1, y: 0}));
  assert(isAdjacent({x: 0, y: 0}, {x: 1, y: 1}));
  assert(isAdjacent({x: 0, y: 0}, {x: -1, y: -1}));
  assert(!isAdjacent({x: 0, y: 0}, {x: 1, y: 2}));
  assert(!isAdjacent({x: 3, y: -3}, {x: 1, y: 2}));
}

const testMoveTail = () => {
  [
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}],
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}],
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: -1, y: 0}],
    [{x: 0, y: 0}, {x: 0, y: 2}, {x: 0, y: 1}],
    [{x: 0, y: 0}, {x: 0, y: -2}, {x: 0, y: -1}],
    [{x: 0, y: 0}, {x: 1, y: 1}, {x: 0, y: 0}],
    [{x: 0, y: 0}, {x: 1, y: 2}, {x: 1, y: 1}],
  ].forEach(([tail, head, expected]) => {
    moveTail(tail, head);

    assert.deepEqual(tail, expected); 
  });

};

testGetHeadMovements();
testIsAdjacent();
testMoveTail();
