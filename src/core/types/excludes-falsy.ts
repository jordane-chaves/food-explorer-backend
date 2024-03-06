export type ExcludesFalsy = <T>(
  x: T,
) => x is Exclude<T, false | null | undefined | '' | 0>
