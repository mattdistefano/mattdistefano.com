const fs = require('fs');

module.exports = async (filePath, encoding = 'utf-8') =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
