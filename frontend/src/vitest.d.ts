import '@testing-library/jest-dom'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends jest.Matchers<void, T> {}
}