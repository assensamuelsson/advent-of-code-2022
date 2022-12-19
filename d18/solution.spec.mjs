import assert from 'assert';

import {
  getFaceCoordinates,  
} from './solution.mjs';

assert.deepStrictEqual(getFaceCoordinates('1,1,1'), [
  '0.5,1,1',
  '1.5,1,1',
  '1,0.5,1',
  '1,1.5,1',
  '1,1,0.5',
  '1,1,1.5',
])