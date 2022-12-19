import fs from 'fs';

export const createRockBuilder = () => {
  const ROCKS = [[
      { x: 0, y: 0 }, // ####
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ], [
      { x: 1, y: 0 }, // .#.
      { x: 0, y: 1 }, // ###
      { x: 1, y: 1 }, // .#.
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ], [
      { x: 0, y: 0 }, // ..#
      { x: 1, y: 0 }, // ..#
      { x: 2, y: 0 }, // ###
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ], [
      { x: 0, y: 0 }, // #
      { x: 0, y: 1 }, // #
      { x: 0, y: 2 }, // #
      { x: 0, y: 3 }, // #
    ], [
      { x: 0, y: 0 }, // ##
      { x: 0, y: 1 }, // ##
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]
  ];

  // Return a copy of correct rock
  return (round) => ROCKS[round % 5].map(point => ({...point}));
}

export const createChamber = () => ({ 
  maxY: 0,
  minY: 0,
  tiles: [
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
    new Set([0]),
  ],
});

export const getBlockSpawn = (chamber) => ({ x: 2, y: chamber.maxY + 4 });

export const toGlobalCoords = (rock, origin) => {
  rock.forEach((point) => {
    point.x += origin.x;
    point.y += origin.y;
  })
};

export const canMoveRight = (block, chamber) => {
  return block.every((point) => point.x + 1 < chamber.tiles.length && !chamber.tiles[point.x + 1].has(point.y));
}

export const moveRight = (block) => {
  block.forEach((point) => {
    point.x += 1;
  })
}

export const canMoveLeft = (block, chamber) => {
  return block.every((point) => point.x - 1 >= 0 && !chamber.tiles[point.x - 1].has(point.y));
}

export const moveLeft = (block) => {
  block.forEach((point) => {
    point.x -= 1;
  })
}

export const canMoveDown = (block, chamber) => {
  return block.every((point) => !chamber.tiles[point.x].has(point.y - 1));
}

export const moveDown = (block) => {
  block.forEach((point) => {
    point.y -= 1;
  })
}

export const freeze = (block, chamber) => {
  let blockMaxY = -Infinity;
  let blockMinY = Infinity;
  block.forEach((point) => {
    chamber.tiles[point.x].add(point.y);
    blockMaxY = Math.max(blockMaxY, point.y);
    blockMinY = Math.min(blockMinY, point.y);
  });
  chamber.maxY = Math.max(blockMaxY, chamber.maxY);
  chamber.minY = Math.min(blockMinY, chamber.minY);
}

export const createGustBuilder = (input) => {
  return (round) => {
    const isLeft = input.charAt(round % input.length) === '<';
    return {
      test: isLeft ? canMoveLeft : canMoveRight,
      action: isLeft ? moveLeft : moveRight,
    };
  }
};

const simulate = (input, blocks) => {
  const chamber = createChamber();
  const nextRock = createRockBuilder();
  const nextGustFunctions = createGustBuilder(input);

  let blockRound = 0;
  let gustRound = 0;

  let hasFastForward = false;

  const pattern = [{ round: 0, max: 0, diff: 0 }];

  while (blockRound < blocks) {
    if (gustRound % input.length === 4) {
      console.log(blockRound, blockRound % 5);
    }
    if ((blockRound % 5 === 4) && (gustRound % input.length === 4)) {
      pattern.push({ round: blockRound, max: chamber.maxY, diff: chamber.maxY - pattern[pattern.length - 1].max });
      if (!hasFastForward && pattern.length > 2) {
        hasFastForward = true;
        const diff = pattern[pattern.length - 1].diff;
        const blockLoop = pattern[pattern.length - 1].round - pattern[pattern.length - 2].round;
        const fastForwardInterations = Math.floor(blocks / blockLoop) - 5;
        blockRound += (blockLoop * fastForwardInterations);
        chamber.maxY += (diff * fastForwardInterations);
        chamber.minY += (diff * fastForwardInterations);
        chamber.tiles = chamber.tiles.map((rocks) => new Set([...rocks].map(r => r + (diff * fastForwardInterations))));
      }
    }

    const block = nextRock(blockRound);
    toGlobalCoords(block, getBlockSpawn(chamber));

    while (true) {

      const gustFunctions = nextGustFunctions(gustRound);
      if (gustFunctions.test(block, chamber)) {
        gustFunctions.action(block);
      }
      gustRound++;

      if (canMoveDown(block, chamber)) {
        moveDown(block);
      } else {
        freeze(block, chamber);
        break;
      }
    }

    blockRound++;
  }

  return chamber.maxY;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  
  console.log(simulate(text, 2022));
  console.log(simulate(text, 1000000000000));
  // Part 2 too low  1514285714289
  //                 1566272189352
  // Part 2 too high 1566272191118
  // Part 2 too high 1566272191117
}
