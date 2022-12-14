import fs from 'fs';

export const CompareResult = {
  Correct: -1,
  Incorrect: 1,
  Indecisive: 0,
}

export const comparePackets = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      return CompareResult.Correct;
    } else if (left > right) {
      return CompareResult.Incorrect;
    } else {
      return CompareResult.Indecisive;
    }
  } else if (Array.isArray(left) && Array.isArray(right)) {
    let result;
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      if (left[i] === undefined) return CompareResult.Correct;
      if (right[i] === undefined) return CompareResult.Incorrect;
      result = comparePackets(left[i], right[i]);
      if (result !== CompareResult.Indecisive) return result;
    }
    return CompareResult.Indecisive;
  } else if (Array.isArray(left) && typeof right === 'number') {
    return comparePackets(left, [right]);
  } else if (typeof left === 'number' && Array.isArray(right)) {
    return comparePackets([left], right);
  }
}

export const parsePackets = (text) => {
  const packets = [];

  const rows = text.split('\n');
  for (let i = 0; i < rows.length; i += 3) {
    packets.push({ left: eval(rows[i]), right: eval(rows[i + 1]) });
  }

  return packets;
}

const packetsToFlatList = (packets) => {
  const list = [];
  packets.forEach(packet => {
    list.push(packet.left);
    list.push(packet.right);
  });
  return list;
};

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const packets = parsePackets(text);
  const part1 = packets.reduce((sum, packet, idx) => {
    if (comparePackets(packet.left, packet.right) === CompareResult.Correct) {
      return sum + idx + 1;
    } else {
      return sum;
    }
  }, 0);

  console.log(part1);

  const flatList = packetsToFlatList(packets);
  flatList.push([[2]]);
  flatList.push([[6]]);
  flatList.sort(comparePackets);

  const div1 = flatList.findIndex(packet => packet?.length === 1 && packet[0]?.length ===1 && packet[0][0] === 2) + 1;
  const div2 = flatList.findIndex(packet => packet?.length === 1 && packet[0]?.length ===1 && packet[0][0] === 6) + 1;
  console.log(div1 * div2);
}
