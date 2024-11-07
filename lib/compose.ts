/*type FN<A, R> = (arg0: A) => R;

export function compose<T, R>(...fns: FN<?, ?>[]) {
  return (x: Parameters<(typeof fns)[0]>): ReturnType<(typeof fns)[-1]> =>
    fns.reduceRight((y, fn) => fn(y), x);
}

function sum2(num: number) {
  return num + 2;
}

function sum3(num: number) {
  return num + 3;
}

function convertToString(num: number) {
  return num + "";
}

const a = compose(sum2, sum3, sum3)("sda");*/

/*
const compose = (...fns) => x => fns.reduceRight((y, fn) => fn(y), x)

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((y, fn) => fn(y), x);

/*
const trace = (x) => (y) => {
  console.log(x, y);
  return y;
};

const setThrow = (CustomError, errorConditionFn) => (y) => {
  if (errorConditionFn(y)) {
    throw CustomError;
  }
  return y;
};
*/
