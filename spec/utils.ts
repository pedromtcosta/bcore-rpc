import * as E from 'fp-ts/lib/Either';

export const assertEitherIsRight = (expect: jest.Expect) => <E, T>(either: E.Either<E, T>): either is E.Right<T> => {
  expect(E.isRight(either)).toBe(true);
  return E.isRight(either);
};

export const assertEitherValue = (expect: jest.Expect) => <E, T>(either: E.Either<E, T>, value: T) => {
  if (assertEitherIsRight(expect)(either)) {
    expect(either.right).toEqual(value);
  }
};

export const assertEitherIsLeft = (expect: jest.Expect) => <E, T>(either: E.Either<E, T>): either is E.Left<E> => {
  expect(E.isLeft(either)).toBe(true);
  return E.isLeft(either);
};

export const assertEitherError = (expect: jest.Expect) => <E, T>(either: E.Either<E, T>, error: E) => {
  if (assertEitherIsLeft(expect)(either)) {
    expect(either.left).toEqual(error);
  }
};
