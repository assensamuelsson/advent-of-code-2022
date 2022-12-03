import assert from 'assert';
import {
  splitIntoCompartments,
  findCommonItem,
  toPriority,
  toGroups,
  findCommonItemInGroup,
} from './utils.mjs'

assert.deepEqual(splitIntoCompartments('aAbB'), ['aA', 'bB'])

assert.equal(findCommonItem(['aA', 'bA']), 'A')
assert.equal(findCommonItem(['aB', 'bB', 'cB']), 'B')
assert.equal(findCommonItemInGroup(['aB', 'bB', 'cD']), undefined)

assert.equal(toPriority('a'), 1)
assert.equal(toPriority('z'), 26)
assert.equal(toPriority('A'), 27)
assert.equal(toPriority('Z'), 52)

assert.deepEqual(toGroups(['aB', 'cD', 'eF', 'gH', 'iJ', 'kL']), [['aB', 'cD', 'eF'], ['gH', 'iJ', 'kL']])
console.log(toGroups(['aB', 'cD', 'eF', 'gH', 'iJ', 'kL']))