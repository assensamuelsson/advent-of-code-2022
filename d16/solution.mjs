import fs from 'fs';

export const parseValves = (text) => {
  const lines = text.split('\n');
  const valves = {};

  const regex = /^Valve (?<name>[A-Z]+) has flow rate=(?<flowRate>[\d]+); tunnels? leads? to valves? (?<children>[, A-Z]+)$/

  lines.forEach((line) => {
    const match = line.match(regex);
    const name = match.groups.name;
    const flowRate = parseInt(match.groups.flowRate, 10);
    const children = match.groups.children.split(', ');
    valves[name] = {
      flowRate,
      children,
      parents: [],
    }
  })

  for (const name in valves) {
    for (const child of valves[name].children) {
      valves[child].parents.push(name);
    }
  }

  return valves;
}

const dp = (valves, valvesToOpen, atValve = 'AA', minute = 1, lookup = {}, openedValves = new Set()) => {
  if (minute === 30 || valvesToOpen.size === 0) return 0;

  const thisState = JSON.stringify({ atValve, minute, valvesToOpen });
  if (thisState in lookup) return lookup[thisState];

  // Pressure released by opening this valve
  // Only open if valve has flowRate and is not already opened
  let openThisValve = 0;
  if (valves[atValve].flowRate > 0 && valvesToOpen.includes(atValve)) {
    //              Pressure released by opening this valve   Pressure gained by opening other valves
    openThisValve = (30 - minute) * valves[atValve].flowRate + dp(valves, valvesToOpen.filter(v => v !== atValve), atValve, minute + 1, lookup, openedValves)
  }

  // Pressure gained by moving to children
  const childrenPressure = valves[atValve].children.map((childName) => dp(valves, valvesToOpen, childName, minute + 1, lookup, openedValves))

  // Find max pressure and set the lookup for this state
  const maxValue = Math.max(openThisValve, ...childrenPressure);
  if (maxValue === openThisValve) {
    openedValves.add(atValve);
  }
  lookup[thisState] =  maxValue;

  return maxValue;
}

const dp2 = (valves, valvesToOpen, meAtValve = 'AA', elephantAtValve = 'AA', meParent = null, elephantParent = null, minute = 1, lookup = {}) => {
  if (minute === 26 || valvesToOpen.length === 0) return 0;

  const thisState = JSON.stringify({ meAtValve, elephantAtValve, minute, valvesToOpen });
  if (thisState in lookup) return lookup[thisState];

  // Case 1 Both of use opens current valve
  let bothOpensValve = 0;
  if (valvesToOpen.includes(meAtValve) && valvesToOpen.includes(elephantAtValve) && meAtValve !== elephantAtValve) {
    bothOpensValve = (26 - minute) * (valves[meAtValve].flowRate + valves[elephantAtValve].flowRate) + dp2(valves, valvesToOpen.filter(v => v !== meAtValve && v !== elephantAtValve), meAtValve, elephantAtValve, meAtValve, elephantAtValve, minute + 1, lookup)
  }
  
  // Case 2 I open valve, elephant moves
  let iOpenValve = [];
  if (valvesToOpen.includes(meAtValve)) {
    iOpenValve = valves[elephantAtValve].children.filter(c => c !== elephantParent && c !== meAtValve).map((childName) => (26 - minute) * valves[meAtValve].flowRate + dp2(valves, valvesToOpen.filter(v => v !== meAtValve), meAtValve, childName, meAtValve, elephantAtValve, minute + 1, lookup))
  }
  
  // Case 3 I move, elephant opens valves
  let elephantOpenValve = [];
  if (valvesToOpen.includes(elephantAtValve)) {
    elephantOpenValve = valves[meAtValve].children.filter(c => c !== meParent && c !== elephantAtValve).map((childName) => (26 - minute) * valves[elephantAtValve].flowRate + dp2(valves, valvesToOpen.filter(v => v !== elephantAtValve), childName, elephantAtValve, meAtValve, elephantAtValve, minute + 1, lookup))
  }

  // Case 4 both moves
  const bothMoves = [];
  if (bothOpensValve === 0 && iOpenValve.length === 0 && elephantOpenValve.length === 0 ) {
    const myChildren = valves[meAtValve].children.filter(c => c !== meParent && c !== elephantAtValve);
    for (const meChild of myChildren) {
      const elephantChildren = valves[elephantAtValve].children.filter(c => c !== elephantParent && c !== meAtValve && c !== meChild);
      for (const elephantChild of elephantChildren) {
        bothMoves.push(dp2(valves, valvesToOpen, meChild, elephantChild, meAtValve, elephantAtValve, minute + 1, lookup));
      }
    }
  }

  // Find max pressure and set the lookup for this state
  const maxValue = Math.max(bothOpensValve, ...iOpenValve, ...elephantOpenValve, ...bothMoves);
  lookup[thisState] =  maxValue;

  return maxValue;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const valves = parseValves(text);
  
  const valvesWithFlowRate = [];
  for (const [name, values] of Object.entries(valves)) {
    if (values.flowRate > 0) {
      valvesWithFlowRate.push(name);
    }
  }
  const p1OpenedValves = new Set();
  //console.log(dp(valves, valvesWithFlowRate, 'AA', 1, {}, p1OpenedValves));
  console.log(dp2(valves, valvesWithFlowRate));
}
