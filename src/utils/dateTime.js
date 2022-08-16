export const timeFormatMilliseconds = (ms) => {
  const time = new Date(0, 0, 0, 0, 0, 0, ms);

  return time.toLocaleTimeString('en-GB');
};
