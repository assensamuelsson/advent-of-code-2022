import fs from 'fs';

export const getCycles = (instructions) => {
  const cycles = [1];
  instructions.forEach((instruction) => {
    const x = cycles[cycles.length - 1];
    cycles.push(x);
    if (instruction.startsWith('addx')) {
      const value = Number.parseInt(instruction.split(' ')[1], 10);
      cycles.push(x + value);
    }
  });
  return cycles;
}

export const getSignalStrength = (x, i) => {
  return x * (i + 1);
}

export const isInterestingCycle = (_, i) => (i + 1 - 20) % 40 === 0;

export const part2 = (cycles) => {
  cycles.forEach((x, i) => {
    const cycle = i + 1;
    const pixel = i % 40;
    process.stdout.write(pixel >= x - 1 && pixel <= x + 1 ? '#' : '.');
    if (cycle % 40 === 0) {
      process.stdout.write('\n');
    }
  });
}


if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const instructions = text.split('\n');

  const part1 = getCycles(instructions)
    .map(getSignalStrength)
    .filter(isInterestingCycle)
    .reduce((p, c) => p + c, 0);

  console.log(part1);
  
  part2(getCycles(instructions));
}
