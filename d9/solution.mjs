import fs from 'fs';

export const getHeadMovements = (command) => {
  const tokens = command.split(' ');
  const direction = tokens[0];
  const length = Number.parseInt(tokens[1]);

  const moves = {
    'R': (p) => p.x++,
    'U': (p) => p.y++,
    'L': (p) => p.x--,
    'D': (p) => p.y--,
  }

 return new Array(length).fill(moves[direction]);
};

export const isAdjacent = (p1, p2) => {
  return Math.max(
    Math.abs(p1.x - p2.x),
    Math.abs(p1.y - p2.y),
    ) < 2;
}

export const moveTail = (tail, head) => {
  if (isAdjacent(head, tail)) return;

  const clamp = (v) => Math.min(Math.max(v, -1), 1);

  tail.x += clamp(head.x - tail.x);
  tail.y += clamp(head.y - tail.y);
};

const getNTailPositions = (commands, nknots) => {
  const knots = [];
  for (let i = 0; i < nknots; i++) knots.push({x: 0, y: 0});
  const tailPositions = new Set();

  commands.forEach(command => {
    getHeadMovements(command).forEach(move => {
      move(knots[0]);
      for (let i = 1; i < knots.length; i++) {
        moveTail(knots[i], knots[i - 1]);
      }
      tailPositions.add(`x: ${knots[knots.length - 1].x}, y: ${knots[knots.length - 1].y}`);
    })
  });

  return tailPositions.size;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const commands = text.split('\n');
  
  console.log('Part 1', getNTailPositions(commands, 2));
  console.log('Part 2', getNTailPositions(commands, 10));
}
