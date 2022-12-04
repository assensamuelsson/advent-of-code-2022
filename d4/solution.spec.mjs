import assert from 'assert';

import {
  parseAssignment,
  parseAssignments,
  isFullyOverlapping,
  isPartlyOverlapping,
} from './solution.mjs';

assert.deepStrictEqual(parseAssignment('2-4'), {start: 2, end: 4});

assert.deepStrictEqual(parseAssignments('2-4,3-6'), [{start: 2, end: 4}, {start: 3, end: 6}]);

assert(isFullyOverlapping([{start: 2, end: 4}, {start: 1, end: 6}]))
assert(!isFullyOverlapping([{start: 2, end: 4}, {start: 3, end: 6}]))
assert(isFullyOverlapping([{start: 5, end: 6}, {start: 6, end: 6}]))

assert(isPartlyOverlapping([{start: 1, end: 3}, {start: 3, end: 5}]))
assert(!isPartlyOverlapping([{start: 1, end: 3}, {start: 4, end: 5}]))


