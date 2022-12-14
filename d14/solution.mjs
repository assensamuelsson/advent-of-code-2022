import fs from 'fs';

export const parseMap = (text) => {
  const lines = text.split('\n');
  const map = {};
  let maxY = -Infinity;
  lines.forEach((line) => {
    const points = line.split(' -> ');
    for (let i = 0; i < points.length - 1; i++) {
      const source = points[i];
      const sourceX = Number.parseInt(source.split(',')[0]);
      const sourceY = Number.parseInt(source.split(',')[1]);
      const target = points[i + 1];
      const targetX = Number.parseInt(target.split(',')[0]);
      const targetY = Number.parseInt(target.split(',')[1]);
      if (targetX === sourceX) {
        if (!(targetX in map)) map[targetX] = new Set();
        for (let y = Math.min(sourceY, targetY); y <= Math.max(sourceY, targetY); y++) {
          map[targetX].add(y);
          maxY = y > maxY ? y : maxY;
        }
      } else if (targetY === sourceY) {
        maxY = targetY > maxY ? targetY : maxY;
        for (let x = Math.min(sourceX, targetX); x <= Math.max(sourceX, targetX); x++) {
          if (!(x in map)) map[x] = new Set();
          map[x].add(targetY);
        }
      }
    }
  });
  map.maxY = maxY;
  return map;
}

export const putSand = (map, x, y, infFloor = false) => {
  if (!(x in map)) map[x] = new Set();
  if (infFloor && map[x].has(y)) return false;

  while (true) {
    if (!(x - 1 in map)) map[x - 1] = new Set();
    if (!(x + 1 in map)) map[x + 1] = new Set();

    if (!(map[x].has(y + 1)) && y + 1 <= map.maxY) {
      y++;
    } else if (!(map[x - 1].has(y + 1)) && y + 1 <= map.maxY) {
      x--;
      y++;
    } else if (!(map[x + 1].has(y + 1)) && y + 1 <= map.maxY) {
      x++;
      y++;
    } else if (!infFloor && y < map.maxY) {
      map[x].add(y);
      break;
    } else if (infFloor && y <= map.maxY) {
      map[x].add(y);
      break;
    } else {
      return false;
    }
  }
  return true;
}

export const fallenSands = (map, sourceX, sourceY) => {
  let sands = 0;
  while (putSand(map, sourceX, sourceY)) sands++;
  return sands;
};

export const fallenSandsWithFloor = (map, sourceX, sourceY) => {
  let sands = 0;
  map.maxY += 1;
  while (putSand(map, sourceX, sourceY, true)) sands++;
  return sands;
};

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  
  const map1 = parseMap(text);
  console.log(fallenSands(map1, 500, 0));
  
  const map2 = parseMap(text);
  console.log(fallenSandsWithFloor(map2, 500, 0));
}
