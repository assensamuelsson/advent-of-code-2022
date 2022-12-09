import { count } from 'console';
import fs from 'fs';
import { parse } from 'path';

export const parseInput = (input) => {
  const lines = input.split('\n');
  return lines.map((line) => line.split('').map(n => Number.parseInt(n, 10)));
}

export const isTreeVisible = (trees, row, col) => {
  const nrows = trees.length;
  const ncols = trees[0].length;

  if (row === 0 || (row + 1) === nrows || col === 0  || (col + 1) === ncols) {
    return true;
  } else {
    let visibleFromTop = true;
    for (let r = row - 1; r >= 0; r--) {
      if (trees[r][col] >= trees[row][col]) {
        visibleFromTop = false;
        break;
      }
    }

    let visibleFromBottom = true;
    for (let r = row + 1; r < nrows; r++) {
      if (trees[r][col] >= trees[row][col]) {
        visibleFromBottom = false;
        break;
      }
    }
    
    let visibleFromRight = true;
    for (let c = col + 1; c < ncols; c++) {
      if (trees[row][c] >= trees[row][col]) {
        visibleFromRight = false;
        break;
      }
    }
    
    let visibleFromLeft = true;
    for (let c = col - 1; c >= 0; c--) {
      if (trees[row][c] >= trees[row][col]) {
        visibleFromLeft = false;
        break;
      }
    }
    return visibleFromTop || visibleFromBottom || visibleFromRight || visibleFromLeft;
  }
}

export const countVisibleTrees = (trees) => {
  const nrows = trees.length;
  const ncols = trees[0].length;

  let sum = 0;

  for (let r = 0; r < nrows; r++) {
    for (let c = 0; c < ncols; c++) {
      if (isTreeVisible(trees, r, c)) {
        sum++;
      }
    }
  }

  return sum;
}

export const calcScenicScore = (trees, row, col) => {
  const nrows = trees.length;
  const ncols = trees[0].length;

  if (row === 0 || (row + 1) === nrows || col === 0  || (col + 1) === ncols) {
    return 0;
  } else {
    let visibleToTop = 0;
    for (let r = row - 1; r >= 0; r--) {
      if (trees[r][col] <= trees[row][col]) {
        visibleToTop++;
        if (trees[r][col] === trees[row][col]) {
          break;
        }
      } else {
        visibleToTop++;
        break;
      }
    }

    let visibleToBottom = 0;
    for (let r = row + 1; r < nrows; r++) {
      if (trees[r][col] <= trees[row][col]) {
        visibleToBottom++;
        if (trees[r][col] === trees[row][col]) {
          break;
        }
      } else {
        visibleToBottom++;
        break;
      }
    }
    
    let visibleToRight = 0;
    for (let c = col + 1; c < ncols; c++) {
      if (trees[row][c] <= trees[row][col]) {
        visibleToRight++;
        if (trees[row][c] === trees[row][col]) {
          break;
        }
      } else {
        visibleToRight++;
        break;
      }
    }
    
    let visibleToLeft = 0;
    for (let c = col - 1; c >= 0; c--) {
      if (trees[row][c] <= trees[row][col]) {
        visibleToLeft++;
        if (trees[row][c] === trees[row][col]) {
          break;
        }
      } else {
        visibleToLeft++;
        break;
      }
    }
    return visibleToTop * visibleToBottom * visibleToLeft * visibleToRight;
  }
}

export const getMaxScenicScores = (trees) => {
  const nrows = trees.length;
  const ncols = trees[0].length;
  let max = 0;
  for (let r = 0; r < nrows; r++) {
    for (let c = 0; c < ncols; c++) {
      const score = calcScenicScore(trees, r, c);
      max = score > max ? score : max;
    }
  }
  return max;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const trees = parseInput(text);

  const part1 = countVisibleTrees(trees);
  console.log(part1);

  const part2 = getMaxScenicScores(trees);
  console.log(part2);  
}
