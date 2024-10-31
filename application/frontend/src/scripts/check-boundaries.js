export function checkLeftBoundary(garbageCollector, stack) {
  const stackBoundary = stack.left + stack.width;
  const garbageCollectorLeftBoundary = garbageCollector.left;

  const collisionStack = garbageCollectorLeftBoundary <= stackBoundary + 75;

  if (collisionStack) return false;

  return true;
}

export function checkRightBoundary(garbageCollector, recyclingBin) {
  const recyclingBinBoundary = recyclingBin.left;
  const garbageCollectorRightBoundary =
    garbageCollector.left + garbageCollector.width;

  const collisionRecyclingBin =
    garbageCollectorRightBoundary >= recyclingBinBoundary - 75;

  if (collisionRecyclingBin) return false;

  return true;
}
