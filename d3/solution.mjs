import fs from 'fs';
import { findCommonItem, findCommonItemInGroup, splitIntoCompartments, toGroups, toPriority } from './utils.mjs';

const text = fs.readFileSync('input.txt', 'utf-8')
const lines = text.split('\n');

const part1 = lines
  .map(splitIntoCompartments)
  .map(findCommonItem)
  .map(toPriority)
  .reduce((a, b) => a + b, 0);

console.log(part1);

const part2 = toGroups(lines)
  .map(findCommonItemInGroup)
  .map(toPriority)
  .reduce((a, b) => a + b, 0);

console.log(part2);
