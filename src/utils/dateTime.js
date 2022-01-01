module.exports.timeFormatmSeconds = (ms) => {
  const time = new Date(0, 0, 0, 0, 0, 0, ms);

  return time.toLocaleTimeString('en-GB');
}