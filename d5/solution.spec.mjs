import assert from 'assert';

import {
  parseInstructions,
  executeInstruction,
  topRows,
} from './solution.mjs';

const stacks = {
  1: ['Z', 'N'],
  2: ['M', 'C', 'D'],
  3: ['P']
}
const stacks2 = JSON.parse(JSON.stringify(stacks));

const textInstructions = `move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const instructions = parseInstructions(textInstructions);

assert.deepStrictEqual(parseInstructions(textInstructions), [
  {move: 1, from: 2, to: 1},
  {move: 3, from: 1, to: 3},
  {move: 2, from: 2, to: 1},
  {move: 1, from: 1, to: 2},
]);

executeInstruction(instructions[0], stacks);
assert.deepStrictEqual(stacks, {
  1: ['Z', 'N', 'D'],
  2: ['M', 'C'],
  3: ['P']
});
assert.equal(topRows(stacks), 'DCP')

instructions.slice(1).forEach((instruction) => executeInstruction(instruction, stacks));
assert.equal(topRows(stacks), 'CMZ')

executeInstruction(instructions[0], stacks2, true);
assert.deepStrictEqual(stacks2, {
  1: ['Z', 'N', 'D'],
  2: ['M', 'C'],
  3: ['P']
});
assert.equal(topRows(stacks2), 'DCP')

instructions.slice(1).forEach((instruction) => executeInstruction(instruction, stacks2, true));
assert.equal(topRows(stacks2), 'MCD')