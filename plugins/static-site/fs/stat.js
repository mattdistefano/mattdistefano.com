const fs = require('fs');

module.exports = async path =>
  new Promise((res, rej) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return rej(err);
      }
      res(stats);
    });
  });
