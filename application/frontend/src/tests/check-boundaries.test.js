import { test, expect } from "vitest";
import {
  checkLeftBoundary,
  checkRightBoundary,
} from "../scripts/check-boundaries";

// Mock DOM elements
const mockStack = {
  left: 100,
  width: 100,
};

const mockRecyclingBin = {
  left: 800,
};

const mockGarbageCollector = {
  width: 50,
};

test("Garbage Collector cannot move left", () => {
  mockGarbageCollector.left = 275;
  expect(checkLeftBoundary(mockGarbageCollector, mockStack)).toBe(false);
});

test("Garbage Collector can move left", () => {
  mockGarbageCollector.left = 276;
  expect(checkLeftBoundary(mockGarbageCollector, mockStack)).toBe(true);
});

test("Garbage Collector cannot move right", () => {
  mockGarbageCollector.left = 675;

  expect(checkRightBoundary(mockGarbageCollector, mockRecyclingBin)).toBe(false);
});

test("Garbage Collector can move right", () => {
  mockGarbageCollector.left = 674;

  expect(checkRightBoundary(mockGarbageCollector, mockRecyclingBin)).toBe(true);
});
