import fs from 'fs';

export const parseInstructions = (text) => {
  return text.split('\n').map((line) => {
    const tokens = line.split(' ');
    return {
      move: Number.parseInt(tokens[1], 10),
      from: Number.parseInt(tokens[3], 10),
      to: Number.parseInt(tokens[5], 10),
    }
  })
}

export const executeInstruction = (instruction, stacks, inOrder = false) => {
  const from = stacks[instruction.from];
  const to = stacks[instruction.to];
  if (inOrder) { // part 2
    stacks[instruction.to] = to.concat(from.splice(from.length - instruction.move));
  } else { // part 1
    for (let i = 0; i < instruction.move; i++) {
      to.push(from.pop());
    };
  }
}

export const topRows = (stacks) => {
  return Object.values(stacks).map((stack) => stack[stack.length - 1]).join('');
}

const stacks = {
  1: ['H', 'B', 'V', 'W', 'N', 'M', 'L', 'P'],
  2: ['M', 'Q', 'H'],
  3: ['N', 'D', 'B', 'G', 'F', 'Q', 'M', 'L'],
  4: ['Z', 'T', 'F', 'Q', 'M', 'W', 'G'],
  5: ['M', 'T', 'H', 'P'],
  6: ['C', 'B', 'M', 'J', 'D', 'H', 'G', 'T'],
  7: ['M', 'N', 'B', 'F', 'V', 'R'],
  8: ['P', 'L', 'H', 'M', 'R', 'G', 'S'],
  9: ['P', 'D', 'B', 'C', 'N'],
}
const stacks2 = JSON.parse(JSON.stringify(stacks));

const textInstructions = fs.readFileSync('instructions.txt', 'utf-8')
const instructions = parseInstructions(textInstructions)

// Part 1
instructions.forEach((instruction) => executeInstruction(instruction, stacks));
console.log(topRows(stacks));

// Part 2
instructions.forEach((instruction) => executeInstruction(instruction, stacks2, true));
console.log(topRows(stacks2));
