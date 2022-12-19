import assert from 'assert';
import fs from 'fs';

import {
  parseValves,
} from './solution.mjs';

assert.deepStrictEqual(parseValves(fs.readFileSync('example.txt', 'utf-8')), {
  AA: {flowRate: 0, children: ['DD', 'II', 'BB'], parents: ['BB', 'DD', 'II']},
  BB: {flowRate: 13, children: ['CC', 'AA'], parents: ['AA', 'CC']},
  CC: {flowRate: 2, children: ['DD', 'BB'], parents: ['BB', 'DD']},
  DD: {flowRate: 20, children: ['CC', 'AA', 'EE'], parents: ['AA', 'CC', 'EE']},
  EE: {flowRate: 3, children: ['FF', 'DD'], parents: ['DD', 'FF']},
  FF: {flowRate: 0, children: ['EE', 'GG'], parents: ['EE', 'GG']},
  GG: {flowRate: 0, children: ['FF', 'HH'], parents: ['FF', 'HH']},
  HH: {flowRate: 22, children: ['GG'], parents: ['GG']},
  II: {flowRate: 0, children: ['AA', 'JJ'], parents: ['AA', 'JJ']},
  JJ: {flowRate: 21, children: ['II'], parents: ['II']},
});