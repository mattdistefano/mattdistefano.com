const glob = require('glob');
const path = require('path');

module.exports = async dataPath =>
  new Promise((resolve, reject) =>
    glob(path.join(dataPath, '**', '*.md'), (err, matches) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    })
  );
