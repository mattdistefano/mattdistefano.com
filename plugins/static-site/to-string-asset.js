module.exports = contents => {
  const b = new Buffer(contents);

  return {
    source: () => b,
    size: () => b.byteLength
  };
};