import {test, expect } from "vitest";
import getStackInterval from "../scripts/get-stack-interval";

test('Ensure each output is a different result', () => {
    const random1 = getStackInterval(50, 5)
    const random2 = getStackInterval(50, 5)
    const random3 = getStackInterval(50, 5)

    const lowRange = 45;
    const highRange = 55;

    const result1 = random1 <= highRange && random1 >= lowRange;
    const result2 = random2 <= highRange && random2 >= lowRange;
    const result3 = random3 <= highRange && random3 >= lowRange;

    expect(Object.is(random1, random2)).toBe(false);
    expect(Object.is(random2, random3)).toBe(false);
    expect(Object.is(random1, random3)).toBe(false);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
})
