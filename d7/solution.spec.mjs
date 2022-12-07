import assert from 'assert';
import fs from 'fs';

import {
  parseTerminalLine,
  parseTerminalLines,
  getCurrentDirectory,
  getDirectorySizes,
  getLargeDirectories,
  getSizeOfDirectoryToBeDeleted,
} from './solution.mjs';

const testGetCurrentDirectory = () => {
  const fileSystem = {'a': {'b': {'foo.txt': 123}}, 'bar.txt': 234};

  assert(Object.is(getCurrentDirectory(fileSystem, []), fileSystem));
  assert(Object.is(getCurrentDirectory(fileSystem, ['a']), fileSystem['a']));
  assert(Object.is(getCurrentDirectory(fileSystem, ['a', 'b']), fileSystem['a']['b']));
}

const testSingleCommands = () => {
  const fileSystem = {};
  let directoryStack = [];

  parseTerminalLine('$ cd /', fileSystem);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {});
  
  parseTerminalLine('$ ls', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {});
  
  parseTerminalLine('dir a', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {'a': {}});
  
  parseTerminalLine('14848514 b.txt', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {'a': {}, 'b.txt': 14848514});
  
  parseTerminalLine('8504156 c.dat', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {'a': {}, 'b.txt': 14848514, 'c.dat': 8504156});
  
  parseTerminalLine('dir d', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {'a': {}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('$ cd a', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('$ ls', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('dir e', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {'e': {}}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('29116 f', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {'e': {}, 'f': 29116}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('2557 g', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {'e': {}, 'f': 29116, 'g': 2557}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('62596 h.lst', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {'e': {}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});
  
  parseTerminalLine('$ cd e', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a', 'e']);
  assert.deepEqual(fileSystem, {'a': {'e': {}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});  
  
  parseTerminalLine('$ ls', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a', 'e']);
  assert.deepEqual(fileSystem, {'a': {'e': {}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});  
  
  parseTerminalLine('584 i', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a', 'e']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});  
  
  parseTerminalLine('$ cd ..', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['a']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});  
  
  parseTerminalLine('$ cd ..', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, []);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});  

  parseTerminalLine('$ cd d', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['d']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});  

  parseTerminalLine('$ ls', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['d']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {}});

  parseTerminalLine('4060174 j', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['d']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {'j': 4060174}});

  parseTerminalLine('8033020 d.log', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['d']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {'j': 4060174, 'd.log': 8033020}});

  parseTerminalLine('5626152 d.ext', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['d']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {'j': 4060174, 'd.log': 8033020, 'd.ext': 5626152}});

  parseTerminalLine('7214296 k', fileSystem, directoryStack);
  assert.deepEqual(directoryStack, ['d']);
  assert.deepEqual(fileSystem, {'a': {'e': {'i': 584}, 'f': 29116, 'g': 2557, 'h.lst': 62596}, 'b.txt': 14848514, 'c.dat': 8504156, 'd': {'j': 4060174, 'd.log': 8033020, 'd.ext': 5626152, 'k': 7214296}});
}

const testParseExample = () => {
  const text = fs.readFileSync('example.txt', 'utf-8')
  const lines = text.split('\n');

  const fileSystem = parseTerminalLines(lines);

  assert.deepEqual(fileSystem, {
    "a": {
      "e": {
        "i": 584
      },
      "f": 29116,
      "g": 2557,
      "h.lst": 62596
    },
    "b.txt": 14848514,
    "c.dat": 8504156,
    "d": {
      "j": 4060174,
      "d.log": 8033020,
      "d.ext": 5626152,
      "k": 7214296
    }
  });

  const sizes = getDirectorySizes(fileSystem);
  assert.deepEqual(sizes, {
    a: { e: { _size: 584 }, _size: 94853 },
    d: { _size: 24933642 },
    _size: 48381165
  });
}

const testGetDirectorySizes = () => {
  assert.deepEqual(getDirectorySizes({a: {b: 123}}), {a: {_size: 123}, _size: 123});
  assert.deepEqual(getDirectorySizes({a: {b: 123, c: 234}}), {a: {_size: 123 + 234}, _size: 123 + 234});
  assert.deepEqual(getDirectorySizes({a: {b: {c: 234}}}), {a: {_size: 234, b: {_size: 234}}, _size: 234});
  assert.deepEqual(getDirectorySizes({a: {b: {c: 234}, d: 123}}), {a: {_size: 234 + 123, b: {_size: 234}}, _size: 234 + 123});
  assert.deepEqual(getDirectorySizes({a: {b: {c: 234}, d: 123}, e: 1}), {a: {_size: 234 + 123, b: {_size: 234}}, _size: 234 + 123 + 1});
}

const testGetLargeDirectories = () => {
  assert.equal(getLargeDirectories({a: {_size: 123}, _size: 123}, 200), 123+123);
  assert.equal(getLargeDirectories({a: {_size: 123}, _size: 123}, 100), 0);
  assert.equal(getLargeDirectories({a: {_size: 234 + 123, b: {_size: 234}}, _size: 234 + 123 + 1}, 100), 0);
  assert.equal(getLargeDirectories({a: {_size: 234 + 123, b: {_size: 234}}, _size: 234 + 123 + 1}, 250), 234);
  assert.equal(getLargeDirectories({a: {_size: 234 + 123, b: {_size: 234}}, _size: 234 + 123 + 1}, 234 + 123), 234 + 123 + 234);
}

const testGetSizeOfDirectoryToBeDeleted = () => {
  assert.equal(getSizeOfDirectoryToBeDeleted({a: {_size: 20, b: {_size: 10}}, _size: 30}, 50, 30), 10);
  assert.equal(getSizeOfDirectoryToBeDeleted({a: {_size: 20, b: {_size: 10}}, _size: 30}, 50, 40), 20);
};

testGetCurrentDirectory();
testSingleCommands();
testParseExample();
testGetDirectorySizes();
testGetLargeDirectories();
testGetSizeOfDirectoryToBeDeleted();
