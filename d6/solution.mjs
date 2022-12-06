import fs from 'fs';

export const findStartMarker = (packet, length = 4) => {
  for (let i = length; i < packet.length; i++) {
    if ((new Set(packet.slice(i - length, i))).size === length) {
      return i;
    }
  }
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8')
  
  const part1 = findStartMarker(text);
  console.log(part1);

  const part2 = findStartMarker(text, 14);
  console.log(part2);
}

