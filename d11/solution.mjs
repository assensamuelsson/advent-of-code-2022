export class Monkey {
  constructor({ items, operation, test, outcomes, ease }) {
    this.items = items;
    this.operation = operation;
    this.test = test;
    this.outcomes = outcomes;
    this.nrOfInspectedItems = 0;
    this.ease = ease;
  }

  inspectAllItems(monkies) {
    while (this.items.length) {
      this.inspectItem();
      this.easeWorry();
      const to = this.testItem();
      this.throw(to, monkies);
    }
  }

  inspectItem() {
    this.items[0] = this.operation(this.items[0]);
    this.nrOfInspectedItems++;
  }

  easeWorry() {
    this.items[0] = this.ease(this.items[0]);
  }

  testItem() {
    return this.outcomes[this.test(this.items[0])];
  }

  throw(to, monkies) {
    monkies[to].items.push(this.items.shift());
  }
};

export const setupExampleInitialCondition = (ease) => {
  return [
    new Monkey({
      items: [79, 98],
      operation: (worryLevel) => worryLevel * 19,
      test: (worryLevel) => worryLevel % 23 === 0,
      outcomes: {true: 2, false: 3},
      ease,
    }),
    new Monkey({
      items: [54, 65, 75, 74],
      operation: (worryLevel) => worryLevel + 6,
      test: (worryLevel) => worryLevel % 19 === 0,
      outcomes: {true: 2, false: 0},
      ease,
    }),
    new Monkey({
      items: [79, 60, 97],
      operation: (worryLevel) => worryLevel * worryLevel,
      test: (worryLevel) => worryLevel % 13 === 0,
      outcomes: {true: 1, false: 3},
      ease,
    }),
    new Monkey({
      items: [74],
      operation: (worryLevel) => worryLevel + 3,
      test: (worryLevel) => worryLevel % 17 === 0,
      outcomes: {true: 0, false: 1},
      ease,
    }),
  ]
}

const setupInitialCondition = (ease,) => {
  return [
    new Monkey({
      items: [54, 89, 94],
      operation: o => o * 7,
      test: i => i % 17 === 0,
      outcomes: {true: 5, false: 3},
      ease,
    }),
    new Monkey({
      items: [66, 71],
      operation: o => o + 4,
      test: i => i % 3 === 0,
      outcomes: {true: 0, false: 3},
      ease,
    }),
    new Monkey({
      items: [76, 55, 80, 55, 55, 96, 78],
      operation: o => o + 2,
      test: i => i % 5 === 0,
      outcomes: {true: 7, false: 4},
      ease,
    }),
    new Monkey({
      items: [93, 69, 76, 66, 89, 54, 59, 94],
      operation: o => o + 7,
      test: i => i % 7 === 0,
      outcomes: {true: 5, false: 2},
      ease,
    }),
    new Monkey({
      items: [80, 54, 58, 75, 99],
      operation: o => o * 17,
      test: i => i % 11 === 0,
      outcomes: {true: 1, false: 6},
      ease,
    }),
    new Monkey({
      items: [69, 70, 85, 83],
      operation: o => o + 8,
      test: i => i % 19 === 0,
      outcomes: {true: 2, false: 7},
      ease,
    }),
    new Monkey({
      items: [89],
      operation: o => o + 6,
      test: i => i % 2 === 0,
      outcomes: {true: 0, false: 1},
      ease,
    }),
    new Monkey({
      items: [62, 80, 58, 57, 93, 56],
      operation: o => o * o,
      test: i => i % 13 === 0,
      outcomes: {true: 6, false: 4},
      ease,
    }),
  ]
}

if (process.argv[2]) {  
  const m1 = setupInitialCondition((item) => Math.floor(item / 3));
  for (let i = 0; i < 20; i++) m1.forEach(monkey => monkey.inspectAllItems(m1));
  m1.sort((a, b) => b.nrOfInspectedItems - a.nrOfInspectedItems);
  console.log(m1[0].nrOfInspectedItems * m1[1].nrOfInspectedItems);

  const m2 = setupInitialCondition((item) => item % (17 * 3 * 5 * 7 * 11 * 19 * 2 * 13));
  for (let i = 0; i < 10000; i++) m2.forEach(monkey => monkey.inspectAllItems(m2));
  m2.sort((a, b) => b.nrOfInspectedItems - a.nrOfInspectedItems);
  console.log(m2[0].nrOfInspectedItems * m2[1].nrOfInspectedItems);
}