import fs from 'fs';
import crypto from 'crypto';

export const mixList = (list, uuids) => {
  for (const id of uuids) {
    const currentIndex = list.findIndex((item) => item.id === id);
    const current = list[currentIndex];
    let newIndex = (currentIndex + current.value) % (list.length - 1);
    list.splice(currentIndex, 1);
    list = [...list.slice(0, newIndex), current, ...list.slice(newIndex)];
  }

  return list;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const list = text.split('\n').map((v) => Number.parseInt(v));

  const uuids = list.map(() => crypto.randomUUID());
  let withUuids = [];
  for (let i = 0; i < list.length; i++) {
    withUuids.push({ id: uuids[i], value: list[i] });
  }
  const mixed = mixList(withUuids, uuids).map((v) => v.value);
  const zeroIndex = mixed.findIndex((item) => item === 0);
  const numbers = [1000, 2000, 3000].map((n) => mixed[(zeroIndex + n) % mixed.length]);
  const part1 = numbers.reduce((a, b) => a + b, 0);

  console.log(part1);

  const decryptionKey = 811589153;
  let actual = text.split('\n').map((v) => Number.parseInt(v) * decryptionKey);
  const uuids2 = actual.map(() => crypto.randomUUID());
  let withUuids2 = [];
  for (let i = 0; i < actual.length; i++) {
    withUuids2.push({ id: uuids2[i], value: actual[i] });
  }

  for (let i = 0; i < 10; i++) {
    withUuids2 = mixList(withUuids2, uuids2);
    console.log(i, withUuids2);
  }
  const zeroIndex2 = withUuids2.findIndex((item) => item.value === 0);
  const numbers2 = [1000, 2000, 3000].map((n) => withUuids2[(zeroIndex2 + n) % withUuids2.length].value);
  const part2 = numbers2.reduce((a, b) => a + b, 0);

  console.log(part2);
}
