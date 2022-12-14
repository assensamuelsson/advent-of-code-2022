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

      graph[currentId] = { pos: { x: c, y: r } };
      if (currentId !== 'end') {
        graph[currentId].children = {};
        if (r >= 1 && heightMap[r - 1][c] - heightMap[r][c] <= 1) graph[currentId].children[getNodeName(textMatrix, r - 1, c)] = 1;
        if (c <= nCols - 2 && heightMap[r][c + 1] - heightMap[r][c] <= 1) graph[currentId].children[getNodeName(textMatrix, r, c + 1)] = 1;
        if (r <= nRows - 2 && heightMap[r + 1][c] - heightMap[r][c] <= 1) graph[currentId].children[getNodeName(textMatrix, r + 1, c)] = 1;
        if (c >= 1 && heightMap[r][c - 1] - heightMap[r][c] <= 1) graph[currentId].children[getNodeName(textMatrix, r, c - 1)] = 1;
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

    for (const [childNodeName, weight] of Object.entries(currentNode.children)) {
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

const astar = (graph, h) => {
  const reconstructPath = (cameFrom, current) => {
    const totalPath = [current];
    while (Object.keys(cameFrom).includes(current)) {
      current = cameFrom[current];
      totalPath.push(current);
    }
    return totalPath.reverse();
  }

  const openSet = new Set(['start']);

  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  Object.keys(graph).forEach(nodeName => {
    gScore[nodeName] = Infinity;
    fScore[nodeName] = Infinity;
  });
  gScore.start = 0;
  fScore.start = h(graph.start.pos, graph.end.pos);

  while(openSet.size) {
    const currentNodeName = [...openSet].reduce((min, nodeName) => {
      return fScore[nodeName] < min.score ? {score: fScore[nodeName], nodeName} : min;
    }, {score: Infinity, nodeName: null}).nodeName;

    if (currentNodeName === 'end') {
      return reconstructPath(cameFrom, currentNodeName);
    }

    openSet.delete(currentNodeName);
    for (const [childName, weight] of Object.entries(graph[currentNodeName].children)) {
      const tentativeGScore = gScore[currentNodeName] + weight;
      if (tentativeGScore < gScore[childName]) {
        cameFrom[childName] = currentNodeName;
        gScore[childName] = tentativeGScore;
        fScore[childName] = tentativeGScore + h(graph[childName].pos, graph.end.pos);
        if (!openSet.has(childName)) {
          openSet.add(childName);
        }
      }
    }
  }
}

const manhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

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

const part2 = (text, algorithm) => {
  const start = new Date();
  const startingNodeNames = getNodeNamesWithSpecificHeight(text, 'a');
  let minSteps = Infinity;
  console.log('Solving', startingNodeNames.length, 'graphs');

  startingNodeNames.forEach((nodeName) => {
    const graph = parseGraph(text);
    graph['20-0'] = graph.start;
    graph.start = graph[nodeName];
    delete graph[nodeName];

    const path = algorithm(graph);
    minSteps = (path && path.length < minSteps) ? path.length : minSteps;
  })

  console.log('Part 2:', minSteps - 1, 'It took', new Date().getTime() - start.getTime(), 'ms');
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  part1(text);
  //part2(text, djikstras);
  part2(text, (graph) => astar(graph, manhattanDistance));
}
