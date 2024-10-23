export default function convertSecondsToMinutes(timer) {
  if (timer === -1) {
    return "GAME OVER";
  }
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return `${minutes}:${seconds}`;
}
