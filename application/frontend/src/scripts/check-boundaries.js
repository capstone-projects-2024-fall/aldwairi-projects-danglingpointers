export function checkLeftBoundary(garbageCollector, stack) {
  const stackBoundary = stack.left + stack.width;
  const garbageCollectorLeftBoundary = garbageCollector.left;

  const collisionStack = garbageCollectorLeftBoundary <= stackBoundary + 75;

  return !collisionStack
}

export function checkRightBoundary(garbageCollector, recyclingBin) {
  const recyclingBinBoundary = recyclingBin.left;
  const garbageCollectorRightBoundary =
    garbageCollector.left + garbageCollector.width;

  const collisionRecyclingBin =
    garbageCollectorRightBoundary >= recyclingBinBoundary - 75;

  return !collisionRecyclingBin;
}
