import fs from 'fs';

export const parseAssignment = (assignment) => {
  const range = assignment.split('-');
  return {
    start: Number.parseInt(range[0], 10),
    end: Number.parseInt(range[1], 10),
  };
}

export const parseAssignments = (assignments) => {
  const elfs = assignments.split(',');
  return [
    parseAssignment(elfs[0]),
    parseAssignment(elfs[1]),
  ];
}

export const isFullyOverlapping = (assignments) => {
  return (
    (assignments[0].start <= assignments[1].start && assignments[0].end >= assignments[1].end)
    || (assignments[1].start <= assignments[0].start && assignments[1].end >= assignments[0].end)
  )
};

export const isPartlyOverlapping = (assignments) => {
  return (
    (assignments[0].start <= assignments[1].start && assignments[0].end >= assignments[1].start)
    || (assignments[1].start <= assignments[0].start && assignments[1].end >= assignments[0].start)
  );
}

const text = fs.readFileSync('input.txt', 'utf-8')
const lines = text.split('\n');

const part1 = lines
  .map(parseAssignments)
  .map(isFullyOverlapping)
  .reduce((a, b) => a + (b ? 1 : 0), 0)

  console.log(part1);

const part2 = lines
  .map(parseAssignments)
  .map(isPartlyOverlapping)
  .reduce((a, b) => a + (b ? 1 : 0), 0)

console.log(part2);
