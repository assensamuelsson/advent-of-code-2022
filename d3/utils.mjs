export const splitIntoCompartments = (rucksack) => {
  return [
    rucksack.slice(0, rucksack.length / 2),
    rucksack.slice(rucksack.length / 2),
  ]
}

export const findCommonItem = (compartments) => {
  for (const item of compartments[0]) {
    if (compartments[1].includes(item)) {
      return item;
    }
  }
}

export const findCommonItemInGroup = (groups) => {
  for (const item of groups[0]) {
    if (groups[1].includes(item) && groups[2].includes(item)) {
      return item;
    }
  } 
}

export const toPriority = (item) => {
  const charCode = item.charCodeAt(0)
  return charCode >= 97 ? charCode - 96 : charCode - 38;
}

export const toGroups = (rucksacks) => {
  const groups = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    groups.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]])
  }
  return groups;
}