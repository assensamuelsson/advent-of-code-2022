import fs from 'fs';

export const getNodeName = (textMatrix, row, col) => {
  let name = `${row}-${col}`;
  if (textMatrix[row][col] === 'S') name = 'start';
  else if (textMatrix[row][col] === 'E') name = 'end';
  return name;
}


export const parseGraph = (text, startValue = 'a', endValue = 'z') => {
  const textMatrix = text.split('\n').map(row => row.split(''));
  const nRows = textMatrix.length;
  const nCols = textMatrix[0].length;

  const heightMap = textMatrix.map(row => {
    return row.map(col => {
      if (col === 'S') col = startValue;
      else if (col === 'E') col = endValue;
      return col.charCodeAt(0) - 96;
    })
  })

  const graph = {};
  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      let currentId = getNodeName(textMatrix, r, c);

      if (currentId === 'end') {
        graph[currentId] = null;
      } else {
        graph[currentId] = {};
  
        if (r >= 1 && heightMap[r - 1][c] - heightMap[r][c] <= 1) graph[currentId][getNodeName(textMatrix, r - 1, c)] = 1;
        if (c <= nCols - 2 && heightMap[r][c + 1] - heightMap[r][c] <= 1) graph[currentId][getNodeName(textMatrix, r, c + 1)] = 1;
        if (r <= nRows - 2 && heightMap[r + 1][c] - heightMap[r][c] <= 1) graph[currentId][getNodeName(textMatrix, r + 1, c)] = 1;
        if (c >= 1 && heightMap[r][c - 1] - heightMap[r][c] <= 1) graph[currentId][getNodeName(textMatrix, r, c - 1)] = 1;
      }
    }
  }

  return graph;
}

const djikstras = (graph) => {
  const dist = {};
  const prev = {};
  const unprocessed = new Set();

  Object.keys(graph).forEach(nodeName => {
    dist[nodeName] = Infinity;
    prev[nodeName] = null;
    unprocessed.add(nodeName);
  });
  dist.start = 0;

  while(true) {
    const currentNodeName = [...unprocessed].reduce((min, nodeName) => {
      return dist[nodeName] < min.dist ? {dist: dist[nodeName], nodeName} : min;
    }, {dist: Infinity, nodeName: null}).nodeName;

    if (currentNodeName === null) return null;

    if (currentNodeName == 'end') break;

    unprocessed.delete(currentNodeName);
    const currentNode = graph[currentNodeName];

    for (const [childNodeName, weight] of Object.entries(currentNode)) {
      if (unprocessed.has(childNodeName)) {
        const alt = dist[currentNodeName] + weight;
        if (alt < dist[childNodeName]) {
          dist[childNodeName] = alt;
          prev[childNodeName] = currentNodeName;
        }
      }
    }
  }

  const path = [];
  let nodeName = 'end';
  while (nodeName) {
    path.push(nodeName);
    nodeName = prev[nodeName];
  }

  return path.reverse();
};

const getNodeNamesWithSpecificHeight = (text, height = 'a') => {
  const textMatrix = text.split('\n').map(row => row.split(''));
  const nRows = textMatrix.length;
  const nCols = textMatrix[0].length;

  const nodeNames = [];

  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      if (textMatrix[r][c] === height) {
        nodeNames.push(getNodeName(textMatrix, r, c));
      }
    }
  }

  return nodeNames;
}

const part1 = (text) => {
  const graph = parseGraph(text);
  const path = djikstras(graph);
  
  console.log('Part 1:', path.length - 1);
}

const part2 = (text) => {
  const startingNodeNames = getNodeNamesWithSpecificHeight(text, 'a');
  let minSteps = Infinity;
  console.log('Solving', startingNodeNames.length, 'graphs');

  startingNodeNames.forEach((nodeName) => {
    const graph = parseGraph(text);
    graph['20-0'] = graph.start;
    graph.start = graph[nodeName];
    delete graph[nodeName];

    const path = djikstras(graph);
    minSteps = (path && path.length < minSteps) ? path.length : minSteps;
  })

  console.log('Part 2:', minSteps - 1);
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  part1(text);
  part2(text);
}
