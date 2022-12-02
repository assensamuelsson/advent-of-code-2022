import fs from 'fs';

const text = fs.readFileSync('input.txt', 'utf-8')
const lines = text.split('\n');

const rockScore = 1;
const paperScore = 2;
const scissorScore = 3;
const winScore = 6;
const drawScore = 3;

const total = lines.reduce((sum, line) => {
  // A Rock
  // B Paper
  // C Scissor
  // X Rock
  // Y Paper
  // Z Scissor
  if (line[0] === 'A' && line[2] === 'X') {
    return sum + rockScore + drawScore;
  } else if (line[0] === 'A' && line[2] === 'Y') {
    return sum + paperScore + winScore;
  } else if (line[0] === 'A' && line[2] === 'Z') {
    return sum + scissorScore;
  } else if (line[0] === 'B' && line[2] === 'X') {
    return sum + rockScore;
  } else if (line[0] === 'B' && line[2] === 'Y') {
    return sum + paperScore + drawScore;
  } else if (line[0] === 'B' && line[2] === 'Z') {
    return sum + scissorScore + winScore;
  } else if (line[0] === 'C' && line[2] === 'X') {
    return sum + rockScore + winScore;
  } else if (line[0] === 'C' && line[2] === 'Y') {
    return sum + paperScore;
  } else if (line[0] === 'C' && line[2] === 'Z') {
    return sum + scissorScore + drawScore;
  }
}, 0);

console.log(total);
