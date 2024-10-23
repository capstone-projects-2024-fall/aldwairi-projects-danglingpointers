export default function convertSecondsToMinutes(timer) {
  if (timer === -1) {
    return "GAME OVER";
  }

  const rawMinutes = Math.floor(timer / 60);
  const rawSeconds = timer % 60;
  let minutes;
  let seconds;

  rawMinutes < 10 ? minutes = `0${rawMinutes}` : minutes = rawMinutes;
  rawSeconds < 10 ? seconds = `0${rawSeconds}` : seconds = rawSeconds;

  return `${minutes}:${seconds}`;
}
