import { test, expect } from "vitest";
import convertSecondsToMinutes from "../scripts/convert-seconds-to-minutes";

test("Proper formatting when minutes and seconds less than 10", () => {
  expect(convertSecondsToMinutes(9)).toBe("00:09");
});

test("Proper formatting when minutes less than 10", () => {
  expect(convertSecondsToMinutes(80)).toBe("01:20");
});

test("Proper formatting when seconds less than 10", () => {
  expect(convertSecondsToMinutes(129)).toBe("02:09");
});

test("Proper formatting when minutes and seconds greater than 10", () => {
  expect(convertSecondsToMinutes(719)).toBe("11:59");
});
