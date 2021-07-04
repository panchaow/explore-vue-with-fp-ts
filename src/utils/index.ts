import { Commit, CommitOptions } from "vuex";

export const noop = () => {};

export const pick =
  <T, K extends keyof T>(propsToPick: readonly K[]) =>
  (input: T): Pick<T, K> => {
    return propsToPick.reduce((a, k) => {
      a[k] = input[k];
      return a;
    }, {} as Pick<T, K>);
  };

export const omit = <T, K extends keyof T>(propsToOmit: readonly K[]) => (input: T): Omit<T,K> => {
  const _ = { ...input }
  propsToOmit.forEach((key) => delete _[key])
  return _ 
}

export const commit =
  (type: string, payload?: any, options?: CommitOptions) =>
  (commit: Commit) =>
  () =>
    commit(type, payload, options);

export type Nullable<T> = {
  [K in keyof T]: K | null;
} 
