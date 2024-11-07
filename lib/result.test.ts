import { describe, it, expect } from "vitest";
import { ErrorResult, Result, result } from "./result";

describe("Result", () => {
  const descriptiveError: ErrorResult = { kind: "ValidationError" };

  describe("When result is OK", () => {
    const successResult = result.OK(42);

    it("should be OK", () => {
      expect(successResult.isOk()).toBeTruthy();
      expect(successResult.isError()).toBeFalsy();
    });

    it("should return the correct value", () => {
      expect(successResult.value()).toBe(42);
    });

    it("getOrElse should return the value", () => {
      expect(successResult.getOrElse(10)).toBe(42);
    });

    it("getOrThrow should return the value", () => {
      expect(successResult.getOrThrow("An error occurred")).toBe(42);
    });

    it("match should execute the ifOk condition", () => {
      const result = successResult.match({
        ifOk: (value) => value + 1,
        ifError: () => 0,
      });
      expect(result).toBe(43);
    });
  });

  describe("When result is an error", () => {
    const errorResult: Result<number, ErrorResult> =
      result.Error(descriptiveError);

    it("should be an error", () => {
      expect(errorResult.isError()).toBeTruthy();
      expect(errorResult.isOk()).toBeFalsy();
    });

    it("should return the correct error value", () => {
      expect(errorResult.value()).toEqual(descriptiveError);
    });

    it("getOrElse should return the default value", () => {
      expect(errorResult.getOrElse(10)).toBe(10);
    });

    it("getOrThrow should throw an error with a message", () => {
      expect(() => errorResult.getOrThrow("Custom error message")).toThrow(
        "Custom error message"
      );
    });

    it("match should execute the ifError condition", () => {
      const result = errorResult.match({
        ifOk: () => 1,
        ifError: (error) => {
          if (error.kind === "ValidationError") {
            return 400;
          }
          return 500;
        },
      });
      expect(result).toBe(400);
    });
  });
});
