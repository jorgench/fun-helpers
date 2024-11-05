export interface ErrorResult {
  kind: string;
}

export interface Result<A, E extends ErrorResult> {
  isOk(): boolean;
  isError(): boolean;
  value(): A | E;
  getOrElse(arg: A): A;
  getOrThrow(errorMessage: string): A;
  match: <B>(math: {
    ifOk: (value: A) => B;
    ifError: (descriptiveError: E) => B;
  }) => B;
}

function ok<T>(newValue: T): Result<T, never> {
  return {
    isOk: () => true,
    isError: () => false,
    value: () => newValue,
    getOrElse: () => newValue,
    getOrThrow: () => newValue,
    match({ ifOk }) {
      return ifOk(newValue);
    },
  };
}

function errResult<E extends ErrorResult>(
  descriptiveError: E
): Result<never, E> {
  return {
    isError: () => true,
    isOk: () => false,
    value: () => descriptiveError,
    getOrElse: (defaultValue) => defaultValue,
    getOrThrow(errorMessage) {
      throw Error(
        errorMessage
          ? errorMessage
          : "An error has ocurred: " + descriptiveError
      );
    },
    match({ ifError }) {
      return ifError(descriptiveError);
    },
  };
}

export const result = {
  OK: <T>(newValue: T) => ok(newValue),
  Error: <E extends ErrorResult>(descriptiveError: E) =>
    errResult(descriptiveError),
};
