import fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

export const parseBlueprint = (input) => {
  const regex = /^Blueprint (?<id>[\d]+): Each ore robot costs (?<oreOre>[\d]+) ore. Each clay robot costs (?<clayOre>[\d]+) ore. Each obsidian robot costs (?<obsidianOre>[\d]+) ore and (?<obsidianClay>[\d]+) clay. Each geode robot costs (?<geodeOre>[\d]+) ore and (?<geodeObsidian>[\d]+) obsidian.$/;
  //              Blueprint 1           : Each ore robot costs 4                ore. Each clay robot costs 2                 ore. Each obsidian robot costs 3                     ore and 14                     clay. Each geode robot costs 2                  ore and 7                       obsidian.
  const match = input.match(regex);
  
  return {
    id: parseInt(match.groups.id),
    ore: { ore: parseInt(match.groups.oreOre) },
    clay: { ore: parseInt(match.groups.clayOre) },
    obsidian: { ore: parseInt(match.groups.obsidianOre), clay: parseInt(match.groups.obsidianClay) },
    geode: { ore: parseInt(match.groups.geodeOre), obsidian: parseInt(match.groups.geodeObsidian) },
  }
}

export const dp = (
  blueprint,
  robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 },
  resources = { ore: 0, clay: 0, obsidian: 0, geode: 0 },
  minute = 1,
  lookup = {},
  lastMinute = 24,
) => {
  const state = JSON.stringify({ robots, resources, minute});
  if (state in lookup) {
    return lookup[state];
  }

  const collected = collect(resources, robots);
  if (minute >= lastMinute) {
    return [
      {
        robots,
        resources: collected,
        choice: 'do-nothing'
      },
    ];  
  }

  if (canBuildRobot('geode', resources, blueprint)) {
    const { robots: builtRobots, resources: usedResources } = buildRobot('geode', robots, collected, blueprint);
    const next = dp(blueprint, builtRobots, usedResources, minute + 1, lookup);
    lookup[state] = [
      { robots: builtRobots, resources: usedResources, choice: 'geode'},
      ...next,
    ];
    return lookup[state];
  } else {
    const choices = [{ robots, resources: collected, next: dp(blueprint, robots, collected, minute + 1, lookup, lastMinute), choice: 'do-nothing' }];
    for (const type of ['ore', 'clay', 'obsidian']) {
      if (type === 'ore' && minute >= 12) continue;
      if (type === 'clay' && minute >= 20) continue;
      if (type === 'obsidian' && minute >= 23) continue;
      if (canBuildRobot(type, resources, blueprint)) {
        const { robots: builtRobots, resources: usedResources } = buildRobot(type, robots, collected, blueprint);
        choices.push({ robots: builtRobots, resources: usedResources, next: dp(blueprint, builtRobots, usedResources, minute + 1, lookup, lastMinute), choice: type }); 
      }
    }

    const best = choices.reduce((best, current) => {
      return current.next[current.next.length - 1].resources.geode > best.next[best.next.length - 1].resources.geode ? current : best;
    }, { next: [{ resources: { geode: -Infinity } }] });

    lookup[state] = [
      { robots: best.robots, resources: best.resources, choice: best.choice },
      ...best.next,
    ];
    return lookup[state];
  }
};

const canBuildRobot = (type, resources, blueprint) => {
  return Object.entries(blueprint[type]).every(([ resource, amount ]) => resources[resource] >= amount);
}

const buildRobot = (type, robots, resources, blueprint) => {
  const robotsCopy = {...robots};
  robotsCopy[type]++;
  const resourcesCopy = {...resources};
  for (const [resource, amount ] of Object.entries(blueprint[type])) {
    resourcesCopy[resource] -= amount;
  }
  return { robots: robotsCopy, resources: resourcesCopy };
}

const collect = (resources, robots) => {
  const resourcesCopy = {...resources};
  for (const [type, amount] of Object.entries(robots)) {
    resourcesCopy[type] += amount;
  }

  return resourcesCopy;
}

const part1 = (text) => {
  const blueprints = text.split('\n').map(parseBlueprint);
  const qualityLevels = blueprints.map((blueprint) => {
    const simulation = dp(blueprint);
    const geodes = simulation[simulation.length - 1].resources.geode;
    console.log('Simulated id', blueprint.id);
    return blueprint.id * geodes;
  });
  const sum = qualityLevels.reduce((p, c) => p + c, 0);
  console.log(sum);
}

const part2 = (text) => {
  const blueprints = text.split('\n').map(parseBlueprint);
  const geodes = blueprints.slice(0, 3).map((blueprint) => {
    const simulation = dp(
      blueprint,
      { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      1,
      {},
      32,
    )
    console.log('Simulated id', blueprint.id);
    return simulation[simulation.length - 1].resources.geode;
  });
  const product = geodes.reduce((p, c) => p * c, 1);
  console.log(product);
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  
  //part1(text);
  part2(text);

}
