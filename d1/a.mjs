import fs from 'fs';

const text = fs.readFileSync('input.txt', 'utf-8')
const lines = text.split('\n');

let elfCarryingMostCalories;
let mostCalories = 0;
let sum = 0;
let elf = 1;
for (const line of lines) {
  const calory = Number.parseInt(line);
  if (!calory) {
    if (sum > mostCalories) {
      mostCalories = sum;
      elfCarryingMostCalories = elf;
    }
    elf += 1;
    sum = 0;
  } else {
    sum += calory;
  }
}

console.log(mostCalories)
