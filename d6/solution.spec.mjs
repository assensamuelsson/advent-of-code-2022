import assert from 'assert';

import {
  findStartMarker
} from './solution.mjs';

assert.equal(findStartMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb'), 7);
assert.equal(findStartMarker('bvwbjplbgvbhsrlpgdmjqwftvncz'), 5);
assert.equal(findStartMarker('nppdvjthqldpwncqszvftbrmjlhg'), 6);
assert.equal(findStartMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), 10);
assert.equal(findStartMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), 11);

assert.equal(findStartMarker('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 14), 19);
assert.equal(findStartMarker('bvwbjplbgvbhsrlpgdmjqwftvncz', 14), 23);
assert.equal(findStartMarker('nppdvjthqldpwncqszvftbrmjlhg', 14), 23);
assert.equal(findStartMarker('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 14), 29);
assert.equal(findStartMarker('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 14), 26);
