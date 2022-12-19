import fs from 'fs';

export const getFaceCoordinates = (origin) => {
  const [x, y, z] = origin.split(',').map((n) => Number.parseInt(n, 10));

  return [
    `${x-0.5},${y},${z}`,
    `${x+0.5},${y},${z}`,
    `${x},${y-0.5},${z}`,
    `${x},${y+0.5},${z}`,
    `${x},${y},${z-0.5}`,
    `${x},${y},${z+0.5}`,
  ];
}

const getSurfaceArea = (cubes) => {
  const uniqueFaceCoordinates = new Set();

  for (const cube of cubes) {
    const faceCoordinates = getFaceCoordinates(cube);
    for (const faceCoordinate of faceCoordinates) {
      uniqueFaceCoordinates.add(faceCoordinate);
    }
  }

  const totalFaces = cubes.length * 6;
  const connectedFaces = 2 * (totalFaces - uniqueFaceCoordinates.size);
  return totalFaces - connectedFaces;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const cubes = text.split('\n');

  const part1 = getSurfaceArea(cubes);
  console.log(part1);
}
