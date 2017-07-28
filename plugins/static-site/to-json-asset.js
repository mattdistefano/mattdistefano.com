module.exports = contents => {
  const b = new Buffer(JSON.stringify(contents));

  return {
    source: () => b,
    size: () => b.byteLength
  };
};