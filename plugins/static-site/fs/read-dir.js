const fs = require('fs');

// TODO should just use a promification lib
// or one of the promisified fs wrappers
module.exports = async path =>
  new Promise((res, rej) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return rej(err);
      }
      res(files);
    });
  });
