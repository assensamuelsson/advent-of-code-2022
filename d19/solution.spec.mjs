import assert from 'assert';

import {
  dp,
  parseBlueprint,
} from './solution.mjs';

assert.deepStrictEqual(parseBlueprint('Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.'), {
  id: 1,
  ore: { ore: 4 },
  clay: { ore: 2 },
  obsidian: { ore: 3, clay: 14 },
  geode: { ore: 2, obsidian: 7 },
})

const blueprint = {
  ore: { ore: 4 },
  clay: { ore: 2 },
  obsidian: { ore: 3, clay: 14 },
  geode: { ore: 2, obsidian: 7 },
};

const zeros = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

assert.deepStrictEqual(
  dp(blueprint, zeros, zeros, 24),
  [
    { robots: zeros, resources: zeros, choice: 'do-nothing' },
  ]
);

assert.deepStrictEqual(
  dp(blueprint, { ore: 1, clay: 2, obsidian: 3, geode: 4 }, zeros, 24),
  [
    {
      robots: { ore: 1, clay: 2, obsidian: 3, geode: 4 },
      resources: { ore: 1, clay: 2, obsidian: 3, geode: 4 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(blueprint, zeros, {ore: blueprint.geode.ore, clay: 0, obsidian: blueprint.geode.obsidian, geode: 0}, 23),
  [
    {
      robots: { ore: 0, clay: 0, obsidian: 0, geode: 1 },
      resources: zeros,
      choice: 'geode',
    },
    {
      robots: { ore: 0, clay: 0, obsidian: 0, geode: 1 },
      resources: { ore: 0, clay: 0, obsidian: 0, geode: 1 },
      choice: 'do-nothing',
    },
  ]
);

// Examples
assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 2 },
    { ore: 5, clay: 37, obsidian: 6, geode: 7 },
    24
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 2},
    { ore: 4, clay: 33, obsidian: 4, geode: 5},
    23
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 2},
    { ore: 3, clay: 29, obsidian: 2, geode: 3},
    22
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 1},
    { ore: 4, clay: 25, obsidian: 7, geode: 2},
    21
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 1},
    { ore: 3, clay: 21, obsidian: 5, geode: 1},
    20
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 1},
    { ore: 3, clay: 21, obsidian: 5, geode: 1},
    20
    ),
    [
      {
        robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
        resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
        choice: 'do-nothing',
      },
      {
        robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
        resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
        choice: 'geode',
      },
      {
        robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
        resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
        choice: 'do-nothing',
      },
      {
        robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
        resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
        choice: 'do-nothing',
      },
      {
        robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
        resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
        choice: 'do-nothing',
      },
    ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 1},
    { ore: 2, clay: 17, obsidian: 3, geode: 0},
    19
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 3, clay: 21, obsidian: 5, geode: 1},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 0},
    { ore: 3, clay: 13, obsidian: 8, geode: 0},
    18
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 2, clay: 17, obsidian: 3, geode: 0},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 3, clay: 21, obsidian: 5, geode: 1},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 0},
    { ore: 2, clay: 9, obsidian: 6, geode: 0},
    17
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 0},
      resources: { ore: 3, clay: 13, obsidian: 8, geode: 0},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 2, clay: 17, obsidian: 3, geode: 0},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 3, clay: 21, obsidian: 5, geode: 1},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 2, geode: 0},
    { ore: 1, clay: 5, obsidian: 4, geode: 0},
    16
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 0},
      resources: { ore: 2, clay: 9, obsidian: 6, geode: 0},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 0},
      resources: { ore: 3, clay: 13, obsidian: 8, geode: 0},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 2, clay: 17, obsidian: 3, geode: 0},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 3, clay: 21, obsidian: 5, geode: 1},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);

assert.deepStrictEqual(
  dp(
    blueprint,
    { ore: 1, clay: 4, obsidian: 1, geode: 0},
    { ore: 3, clay: 15, obsidian: 3, geode: 0},
    15
  ),
  [
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 0},
      resources: { ore: 1, clay: 5, obsidian: 4, geode: 0},
      choice: 'obsidian',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 0},
      resources: { ore: 2, clay: 9, obsidian: 6, geode: 0},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 0},
      resources: { ore: 3, clay: 13, obsidian: 8, geode: 0},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 2, clay: 17, obsidian: 3, geode: 0},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 3, clay: 21, obsidian: 5, geode: 1},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 1 },
      resources: { ore: 4, clay: 25, obsidian: 7, geode: 2},
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 3, clay: 29, obsidian: 2, geode: 3},
      choice: 'geode',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 4, clay: 33, obsidian: 4, geode: 5 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 5, clay: 37, obsidian: 6, geode: 7 },
      choice: 'do-nothing',
    },
    {
      robots: { ore: 1, clay: 4, obsidian: 2, geode: 2 },
      resources: { ore: 6, clay: 41, obsidian: 8, geode: 9 },
      choice: 'do-nothing',
    },
  ]
);