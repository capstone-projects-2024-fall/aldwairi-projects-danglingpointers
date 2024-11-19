import { test, expect } from "vitest";
import checkForCollision from "../scripts/check-for-collision";

// Mock DOM elements
const mockPointer = {
  left: 100,
  bottom: 100,
  width: 50,
};

const mockGarbageCollector = {
  left: 100,
  top: 100,
  width: 50,
};

test("Pointer collides with Garbage Collector", () => {
  expect(checkForCollision(mockPointer, mockGarbageCollector)).toBe(true);
});

test("Pointer does not collide with Garbage Collector on x-axis", () => {
  mockPointer.left = 0;
  expect(checkForCollision(mockPointer, mockGarbageCollector)).toBe(false);

  mockPointer.left = 300;
  expect(checkForCollision(mockPointer, mockGarbageCollector)).toBe(false);
  
  // Reset value before next test
  mockPointer.left = 100;
});

test("Pointer does not collide with Garbage Collector on y-axis", () => {
  mockPointer.bottom = 99;
  expect(checkForCollision(mockPointer, mockGarbageCollector)).toBe(false);
});