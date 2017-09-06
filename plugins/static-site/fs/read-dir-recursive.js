const fs = require('fs');
const path = require('path');
const stat = require('./stat');
const readDir = require('./read-dir');

const readRecursive = async (dirPath, name) => {
  const dir = {
    path: dirPath,
    name: name,
    files: [],
    folders: []
  };

  for (let file of await readDir(dirPath)) {
    const fullPath = path.join(dirPath, file);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      dir.folders.push(await readRecursive(fullPath, file));
    } else {
      dir.files.push({
        path: fullPath,
        name: file,
        mtime: stats.mtime,
        ctime: stats.ctime
      });
    }
  }

  return dir;
};

// TODO should just use a promification lib
// or one of the promisified fs wrappers
module.exports = async dirPath => await readRecursive(dirPath, '');
