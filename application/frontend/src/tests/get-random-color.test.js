import { test, expect } from "vitest";
import getRandomColor from "../scripts/get-random-color";

function includesGtoZ(str) {
    for (const char of str.toLowerCase())
      if (char >= 'g' && char <= 'z') 
        return true;

    return false;
  }

test("Ensure each output is a different result", () => {
  const random1 = getRandomColor();
  const random2 = getRandomColor();
  const random3 = getRandomColor();

  expect(Object.is(random1, random2)).toBe(false);
  expect(Object.is(random2, random3)).toBe(false);
  expect(Object.is(random1, random3)).toBe(false);

  expect(random1.length).toBe(7);
  expect(random2.length).toBe(7);
  expect(random3.length).toBe(7);

  expect(random1.includes('#')).toBe(true);
  expect(random2.includes('#')).toBe(true);
  expect(random3.includes('#')).toBe(true);

  expect(includesGtoZ(random1)).toBe(false);
  expect(includesGtoZ(random2)).toBe(false);
  expect(includesGtoZ(random3)).toBe(false);
});
