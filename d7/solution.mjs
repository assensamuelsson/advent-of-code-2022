import fs from 'fs';

export const getCurrentDirectory = (fileSystem, directoryStack) => {
  if (directoryStack.length === 0) {
    return fileSystem;
  } else {
    return getCurrentDirectory(
      fileSystem[directoryStack[0]],
      directoryStack.slice(1))
  }
};

export const parseTerminalLine = (line, fileSystem, directoryStack) => {
  const dirRegex = /^dir (?<name>\w+)$/
  const fileRegex = /^(?<size>\d+) (?<name>[\w\.]+)$/
  const cdRegex = /^\$ cd (?<name>[\w\.]+)$/
  
  if (line === '$ cd /' || line === '$ ls') return;

  const currentDirectory = getCurrentDirectory(fileSystem, directoryStack);

  const lineMatch = line.match(dirRegex);
  const fileMatch = line.match(fileRegex);
  const cdMatch = line.match(cdRegex);
  if (lineMatch) {
    currentDirectory[lineMatch.groups.name] = {};
  } else if (fileMatch) {
    currentDirectory[fileMatch.groups.name] = Number.parseInt(fileMatch.groups.size);
  } else if (cdMatch) {
    const name = cdMatch.groups.name;
    if (name === '..') {
      directoryStack.pop();
    } else {
      directoryStack.push(cdMatch.groups.name);
    }
  }
}

export const parseTerminalLines = (lines) => {
  const fileSystem = {};
  let directoryStack = [];

  lines.forEach((line) => parseTerminalLine(line, fileSystem, directoryStack));

  return fileSystem;
}

export const getDirectorySizes = (fileSystem) => {
  const sizes = {};
  const dirName = Object.keys(fileSystem)[0];
  let thisSize = 0;
  for (const [name, dirOrFile] of Object.entries(fileSystem)) {
    if (typeof dirOrFile === 'number') {
      thisSize += dirOrFile;
    } else {
      const innerSize = getDirectorySizes(dirOrFile);
      sizes[name] = innerSize;
      thisSize += innerSize._size;
    }
  }
  
  if (thisSize > 0) {
    sizes._size = thisSize;
  }

  return sizes;
};

export const getLargeDirectories = (sizes, limit) => {
  return Object.values(sizes).reduce((n, size) => {
    if (typeof size === 'number') {
      return n + (size <= limit ? size : 0);
    } else {
      return n + getLargeDirectories(size, limit);
    }
  }, 0);
};

export const getSizeOfDirectoryToBeDeleted = (sizes, total, requiredUnused) => {
  const toBeFreed = requiredUnused - (total - sizes._size);
  let sizeToBeFreed = total;

  const getSize = (sizes) => {
    Object.values(sizes).forEach((size) => {
      if (typeof size === 'number') {
        sizeToBeFreed = size >= toBeFreed && size < sizeToBeFreed ? size : sizeToBeFreed;
      } else {
        getSize(size);
      }
    });
  }

  getSize(sizes);

  return sizeToBeFreed;
}

if (process.argv[2]) {
  const text = fs.readFileSync(process.argv[2], 'utf-8');
  const lines = text.split('\n');
  
  const fileSystem = parseTerminalLines(lines);
  const fileSizes = getDirectorySizes(fileSystem);

  const part1 = getLargeDirectories(fileSizes, 100000);
  console.log(part1);

  const part2 = getSizeOfDirectoryToBeDeleted(fileSizes, 70000000, 30000000);
  console.log(part2);
}
