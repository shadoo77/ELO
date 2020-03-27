export function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

export function convertSecondsToTimestamp(time) {
  const currentTimeSeconds = Math.floor(time);
  const stampSeconds = pad(currentTimeSeconds % 60, 2);
  const stampMinutes = pad((currentTimeSeconds - stampSeconds) / 60, 2);
  return `${stampMinutes}:${stampSeconds}`;
}
