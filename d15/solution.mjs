import fs from 'fs';
import MySet from '../utils/myset.mjs';

export const parseRow = (row) => {
  const regex = /^Sensor at x=(?<sx>[\-\d]+), y=(?<sy>[\-\d]+): closest beacon is at x=(?<bx>[\-\d]+), y=(?<by>[\-\d]+)$/
  const match = row.match(regex);

  return {
    sensor: {
      x: Number.parseInt(match.groups.sx),
      y: Number.parseInt(match.groups.sy),
    },
    beacon: {
      x: Number.parseInt(match.groups.bx),
      y: Number.parseInt(match.groups.by),
    }
  }
}

export const manhattanDistance = (p1, p2) => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

export const sensorAndDistance = ({ sensor, beacon }) => {
  return {
    sensor,
    distance: manhattanDistance(sensor, beacon),
  }
}

export const isSensorCoveringRow = ({ sensor, distance }, row) => {
  return sensor.y - distance <= row && sensor.y + distance >= row;
}

export const sensorCoverageInRow = ({ sensor, distance }, row) => {
  return {
    start: sensor.x + Math.abs(row - sensor.y) - distance,
    end: sensor.x - Math.abs(row - sensor.y) + distance,
  };
}

const minStartMaxEnd = (p, c) => {
  return {
    min: c.start < p.min ? c.start : p.min,
    max: c.end > p.max ? c.end : p.max,
  }
}

export const regionsMissing = ( sensorCoverages, clampStart, clampEnd) => {
  let rangeToCover = [{ start: clampStart, end: clampEnd }];
  sensorCoverages.forEach((c) => {
    const newRange = [];
    const sensorStart = Math.max(clampStart, c.start);
    const sensorEnd = Math.min(clampEnd, c.end);
    rangeToCover.forEach((range) => {
      if (sensorStart > range.start && sensorEnd < range.end) {
        newRange.push({ start: range.start, end: sensorStart - 1});
        newRange.push({ start: sensorEnd + 1, end: range.end});
      } else if (sensorStart <= range.start && sensorEnd < range.end) {
        newRange.push({ start: Math.max(sensorEnd + 1, range.start), end: range.end });
      } else if (sensorEnd >= range.end && sensorStart > range.start) {
        newRange.push({ start: range.start, end: Math.min(sensorStart - 1, range.end) });
      }
    });
    rangeToCover = newRange;
  });

  return rangeToCover;
}

if (process.argv[2]) {
  const input = fs.readFileSync(process.argv[2], 'utf-8');
  const row = Number.parseInt(process.argv[3]);
  const lines = input.split('\n');

  const sensorsAndDistances = lines
  .map(parseRow)
  .map(sensorAndDistance);

  const coverageInRow = sensorsAndDistances
    .filter((data) => isSensorCoveringRow(data, row))
    .map((data) => sensorCoverageInRow(data, row))
    .reduce(minStartMaxEnd, { min: Infinity, max: -Infinity})

  console.log(coverageInRow.max - coverageInRow.min);

  // Part 2
  const min = Number.parseInt(process.argv[4]);
  const max = Number.parseInt(process.argv[5]);
  for (let row = min; row <= max; row++) {
    const covering = sensorsAndDistances.filter((data) => isSensorCoveringRow(data, row))
    const coverage = covering.map((data) => sensorCoverageInRow(data, row))
    const missing = regionsMissing(coverage, min, max);
    if (missing.length > 0) {
      if (missing.length === 1 && missing[0].start === missing[0].end) {
        const x = missing[0].start;
        console.log(x * 4000000 + row);
        break;
      }
    }
  }
}
