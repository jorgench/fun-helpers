import { describe, it, expect, vi } from "vitest";
import { option, optionRun } from "./option";

describe("Option values", () => {
  describe("When option receive a", () => {
    it("non-null and non-undefined values should return Some", () => {
      const result = option(42);
      expect(result.isSome()).toBeTruthy();
      expect(result.isNothing()).toBeFalsy();
      expect(result.value()).toBe(42);

      const result2 = option("new text");
      expect(result2.isSome()).toBeTruthy();
      expect(result2.isNothing()).toBeFalsy();
      expect(result2.value()).toBe("new text");

      const result3 = option(false);
      expect(result3.isSome()).toBeTruthy();
      expect(result3.isNothing()).toBeFalsy();
      expect(result3.value()).toBeFalsy();

      const result4 = option(-1);
      expect(result4.isSome()).toBeTruthy();
      expect(result4.isNothing()).toBeFalsy();
      expect(result4.value()).toBe(-1);
    });

    it("falsy js values except null and undefined should return Some ", () => {
      const result3 = option(false);
      expect(result3.isSome()).toBeTruthy();
      expect(result3.isNothing()).toBeFalsy();
      expect(result3.value()).toBeFalsy();

      const result4 = option(-1);
      expect(result4.isSome()).toBeTruthy();
      expect(result4.isNothing()).toBeFalsy();
      expect(result4.value()).toBe(-1);
    });

    it("objects should return Some", () => {
      const obj = { key: "value" };
      const result = option(obj);
      expect(result.isSome()).toBeTruthy();
      expect(result.value()).toEqual(obj);
    });

    it("null value should return Nothing", () => {
      const result = option(null);
      expect(result.isNothing()).toBeTruthy();
      expect(result.isSome()).toBeFalsy();
    });

    it("undefined value should return Nothing", () => {
      const result = option(undefined);
      expect(result.isNothing()).toBeTruthy();
      expect(result.isSome()).toBeFalsy();
    });

    it("NaN should return Nothing", () => {
      const result = option(NaN);
      expect(result.isNothing()).toBeTruthy();
      expect(result.isSome()).toBeFalsy();
    });
  });

  describe("When option some value apply", () => {
    const someValue = option(42);

    it("getOrElse should return the value", () => {
      expect(someValue.getOrElse(10)).toBe(42);
    });

    it("map should transform the value", () => {
      const result = someValue.map((x) => x * 2);
      expect(result.value()).toBe(84);
    });

    it("andThen should apply the function returning another Option", () => {
      const result = someValue.andThen((x) => option(x + 1));
      expect(result.isSome()).toBeTruthy();
      expect(result.value()).toBe(43);
    });

    it("mapOr should apply the function and return the result", () => {
      const result = someValue.mapOr((x) => x + 1, 0);
      expect(result).toBe(43);
    });

    it("mapOrElse should apply the function and return the result", () => {
      const result = someValue.mapOrElse(
        () => 0,
        (x) => x + 1
      );
      expect(result).toBe(43);
    });

    it("filter should return Nothing if the filter fails", () => {
      const result = someValue.filter((x) => x > 100);
      expect(result.isNothing()).toBeTruthy();
    });

    it("filter should return Some if the filter passes", () => {
      const result = someValue.filter((x) => x < 100);
      expect(result.isSome()).toBeTruthy();
    });

    it("match should execute the isSome condition", () => {
      const result = someValue.match({
        isSome: (value) => value + 1,
        isNothing: () => 0,
      });
      expect(result).toBe(43);
    });
  });

  describe("When option nothing value apply", () => {
    const emptyValue = option<number>(null);
    const callbacks = {
      cb1: (x: number) => option(x + 1),
      cb2: (x: number) => x + 1,
    };

    it("getOrElse should return the default value", () => {
      expect(emptyValue.getOrElse(10)).toBe(10);
    });

    it("map should not transform the value", () => {
      const result = emptyValue.map((x) => x * 2);
      expect(result.isNothing()).toBeTruthy();
      expect(result.value()).toBe(undefined);
    });

    it("andThen should return Nothing", () => {
      const callbackSpy = vi.spyOn(callbacks, "cb1");

      const result = emptyValue.andThen(callbacks.cb1);
      expect(result.isNothing()).toBeTruthy;
      expect(callbackSpy).toHaveBeenCalledTimes(0);
    });

    it("mapOr should return the default value", () => {
      const callbackSpy = vi.spyOn(callbacks, "cb2");

      const result = emptyValue.mapOr(callbacks.cb2, 0);
      expect(result).toBe(0);
      expect(callbackSpy).toHaveBeenCalledTimes(0);
    });

    it("mapOrElse should return the default function result", () => {
      const result = emptyValue.mapOrElse(
        () => 0,
        (x) => x + 1
      );
      expect(result).toBe(0);
    });

    it("filter should return Nothing", () => {
      const result = emptyValue.filter((x) => x > 100);
      expect(result.isNothing()).toBeTruthy();
    });

    it("match should execute the isNothing condition", () => {
      const result = emptyValue.match({
        isSome: (value) => value + 1,
        isNothing: () => 0,
      });
      expect(result).toBe(0);
    });
  });
});

describe("optionRun function", () => {
  it("should apply the function to Some and return a new Option", () => {
    const someValue = option(42);
    const result = optionRun(someValue, (x) => x + 1);
    expect(result.kind).toBe("Some");
    expect(result.value()).toBe(43);
  });

  it("should return Nothing if applied to Nothing", () => {
    const result = optionRun(option<number>(null), (x) => x + 1);
    expect(result.kind).toBe("Nothing");
  });
});
