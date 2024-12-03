export default function getStackInterval(base, mod) {
  const lowerBound = base - mod;
  const upperBound = base + mod;
  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}
