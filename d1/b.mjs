import fs from 'fs';

const text = fs.readFileSync('input.txt', 'utf-8')
const lines = text.split('\n');

const elfs = [];
let sum = 0;
for (const line of lines) {
  const calory = Number.parseInt(line);
  if (!calory) {
    elfs.push(sum);
    sum = 0;
  } else {
    sum += calory;
  }
}

elfs.sort((a, b) => b - a);
console.log(elfs[0] + elfs[1] + elfs[2]);
