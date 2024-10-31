export default function checkForCollision(pointer, garbageCollector) {
  const pointerX = pointer.left + pointer.width / 2;
  const garbageCollectorX1 = garbageCollector.left;
  const garbageCollectorX2 = garbageCollector.left + garbageCollector.width;

  const pointerY = pointer.bottom;
  const garbageCollectorY = garbageCollector.top;

  const collisionX =
    pointerX > garbageCollectorX1 && pointerX < garbageCollectorX2;
  const collisionY = pointerY > garbageCollectorY;

  if (collisionX && collisionY) return true;
  
  return false;
}
