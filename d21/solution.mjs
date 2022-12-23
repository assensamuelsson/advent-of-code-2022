import fs from 'fs';
import EventEmitter from 'events';

let global;

export class Monkey {
  constructor(name, emitter, action) {
    this.name = name;
    this.emitter = emitter;

    const maybeNumber = Number.parseInt(action);
    if (Number.isInteger(maybeNumber)) {
      this.number = maybeNumber;
    } else {
      const tokens = action.split(' ');
      this.requiredInputs = {};
      this.requiredInputs[tokens[0]] =  null;
      this.requiredInputs[tokens[2]] = null;
      const operator = tokens[1];

      if (operator === '+') {
        this.fn = (a, b) => a + b;
      } else if (operator === '-') {
        this.fn = (a, b) => a - b;
      } else if (operator === '*') {
        this.fn = (a, b) => a * b;
      } else if (operator === '/') {
        this.fn = (a, b) => a / b;
      } else if (operator === '=') {
        this.fn = (a, b) => {
          //console.log(a, b);
          return a === b;
        }
      }

      emitter.on(tokens[0], (value) => this.onInput(tokens[0], value));
      emitter.on(tokens[2], (value) => this.onInput(tokens[2], value));
    }
  }

  yellIfNumber() {
    if (this.number) {
      this.emitter.emit(this.name, this.number);
    }
  }

  forgetResults() {
    if (this.requiredInputs) {
      for (const key of Object.keys(this.requiredInputs)) {
        this.requiredInputs[key] = null;
      }
    }
  }

  onInput(name, value) {
    this.requiredInputs[name] = value;
    const values = Object.values(this.requiredInputs);
    if (values.every((value) => Number.isInteger(value))) {
      this.emitter.emit(this.name, this.fn(values[0], values[1]));
    }
  }
}

export const parseMonkies = (text, emitter) => {
  const lines = text.split('\n');
  const monkies = [];
  for (let i = 0; i < lines.length; i++) {
    const [name, action] = lines[i].split(': ');
    monkies.push(new Monkey(name, emitter, action));
  }
  return monkies;
}

export const parseMonkiesPart2 = (text, emitter) => {
  const lines = text.split('\n');
  let me;
  const monkies = [];
  for (let i = 0; i < lines.length; i++) {
    let [name, action] = lines[i].split(': ');
    if (name === 'root') {
      action = action.split(' ').map((t) => t === '+' ? '=' : t).join(' ');
    }
    const monkey = new Monkey(name, emitter, action);
    if (name === 'humn') {
      me = monkey;
    }
    monkies.push(monkey);
  }
  return { monkies, me };
}

const part1 = (text) => {
  const emitter = new EventEmitter();
  const monkies = parseMonkies(text, emitter);
  emitter.on('root', (value) => console.log(value));
  monkies.forEach((monkey) => monkey.yellIfNumber());
}

const part2 = (text) => {
  const emitter = new EventEmitter();
  const {me, monkies } = parseMonkiesPart2(text, emitter);
  emitter.on('root', (value) => {
    if (value) {
      console.log(global);
      process.exit(0);
    }
  });
  //emitter.on('humn', (value) => console.log(value));
  global = 0;
  while (true) {
    me.number = global;
    monkies.forEach((monkey) => monkey.yellIfNumber());
    monkies.forEach((monkey) => monkey.forgetResults());
    global++;
  }
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  part1(text);
  part2(text);
}
